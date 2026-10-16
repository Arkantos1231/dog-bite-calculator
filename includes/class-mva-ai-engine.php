<?php

if (!defined('ABSPATH')) {
    exit;
}

class DBC_AI_Engine
{
    private $api_key;
    private $model;

    public function __construct()
    {
        $this->api_key = get_option('dbc_openai_api_key');
        $this->model   = get_option('dbc_openai_model', 'gpt-4o');
    }

    /**
     * Generate settlement analysis using OpenAI
     *
     * @param array $form_data   All form fields from the dog bite calculator
     * @param array $math_result The JS-side math result (low, mid, high, etc.)
     * @return string|false
     */
    public function generate_analysis($form_data, $math_result)
    {
        $log_file = defined('DBC_PLUGIN_DIR') ? DBC_PLUGIN_DIR . 'ghl_debug.log' : '';

        if (empty($this->api_key)) {
            if ($log_file) file_put_contents($log_file, "---OPENAI---\nTime: " . date('Y-m-d H:i:s') . "\nERROR: OpenAI API key is not configured.\n", FILE_APPEND);
            return false;
        }

        // Use the prompt saved in WP Admin; fall back to the built-in default if empty
        $system_prompt = get_option('dbc_system_prompt', '');
        if (trim((string) $system_prompt) === '') {
            $system_prompt = self::get_default_prompt();
        }
        $case_summary  = $this->build_case_summary($form_data, $math_result);

        $body = array(
            'model'    => $this->model,
            'messages' => array(
                array('role' => 'system', 'content' => $system_prompt),
                array('role' => 'user',   'content' => $case_summary),
            ),
            'temperature' => 0.5,
            'max_tokens'  => 600,
        );

        if ($log_file) {
            $log_entry  = "---OPENAI---\n";
            $log_entry .= "Time: "  . date('Y-m-d H:i:s') . "\n";
            $log_entry .= "Model: " . $this->model . "\n";
            $log_entry .= "State: " . ($form_data['state'] ?? 'unknown') . " | Bills: $" . ($form_data['totalMedBills'] ?? '0') . "\n";
            $log_entry .= "Sending request to OpenAI...\n";
            file_put_contents($log_file, $log_entry, FILE_APPEND);
        }

        $response = wp_remote_post('https://api.openai.com/v1/chat/completions', array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type'  => 'application/json',
            ),
            'body'    => json_encode($body),
            'timeout' => 45,
        ));

        if (is_wp_error($response)) {
            $err = $response->get_error_message();
            error_log('MVA AI Engine Error: ' . $err);
            if ($log_file) file_put_contents($log_file, "OPENAI ERROR (wp_error): " . $err . "\n", FILE_APPEND);
            return false;
        }

        $code = wp_remote_retrieve_response_code($response);
        $body_raw = wp_remote_retrieve_body($response);

        if ($code !== 200) {
            error_log('MVA AI Engine HTTP ' . $code . ': ' . $body_raw);
            if ($log_file) file_put_contents($log_file, "OPENAI ERROR HTTP $code: " . $body_raw . "\n", FILE_APPEND);
            return false;
        }

        $decoded = json_decode($body_raw, true);
        $content = isset($decoded['choices'][0]['message']['content']) ? trim($decoded['choices'][0]['message']['content']) : null;

        if ($log_file) {
            $tokens_used = isset($decoded['usage']['total_tokens']) ? $decoded['usage']['total_tokens'] : 'N/A';
            file_put_contents($log_file, "OPENAI SUCCESS | HTTP $code | Tokens: $tokens_used\nResponse: " . ($content ?: 'empty') . "\n", FILE_APPEND);
        }

        return $content ?: false;
    }

    /**
     * Generate AI location/insurance analysis for Step 2
     *
     * @param string $state        US state name
     * @param string $location_type  One of: private_residence, apartment_complex, business, public_park, other
     * @return array|false
     */
    public function generate_location_analysis($state, $location_type)
    {
        if (empty($this->api_key)) {
            return false;
        }

        $location_labels = array(
            'private_residence' => 'private residence (house owned by dog owner)',
            'apartment_complex' => 'apartment complex (tenant as dog owner — renter\'s insurance situation)',
            'business'          => 'business or commercial location',
            'public_park'       => 'public park or street',
            'other'             => 'other location',
        );

        $loc_label = isset($location_labels[$location_type]) ? $location_labels[$location_type] : $location_type;

        $prompt = 'You are a personal injury legal analyst specializing in dog bite cases.

Analyze the insurance landscape and recovery potential for a dog bite that occurred at: ' . $loc_label . '
State: ' . $state . '

Consider:
1. Typical insurance coverage available at this location type in ' . $state . '
2. Likely policy limits and coverage gaps
3. Whether additional defendants (landlord, property manager, business) can be pursued
4. The realistic recovery potential given the insurance environment
5. Any ' . $state . '-specific laws affecting this location type

Respond ONLY with a valid JSON object, no markdown, no explanation, no extra text:
{
  "weight": <number between 0.5 and 1.5, where 1.0 is baseline private homeowner>,
  "coverageLabel": "<short label like \'Homeowner\'s Insurance\' or \'Renter\'s Insurance (often absent)\'>",
  "typicalLimits": "<e.g. \'$100,000–$500,000\' or \'Often uninsured or $10,000–$25,000\'>",
  "recoveryRisk": "<low|medium|high>",
  "analysis": "<2-3 sentences explaining the insurance landscape and recovery strategy for this specific state and location>",
  "additionalDefendants": "<null or a short description of who else can be sued>"
}';

        $body = array(
            'model'    => $this->model,
            'messages' => array(
                array('role' => 'user', 'content' => $prompt),
            ),
            'temperature' => 0.3,
            'max_tokens'  => 500,
        );

        $response = wp_remote_post('https://api.openai.com/v1/chat/completions', array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type'  => 'application/json',
            ),
            'body'    => json_encode($body),
            'timeout' => 30,
        ));

        if (is_wp_error($response)) {
            error_log('MVA Location Analysis Error: ' . $response->get_error_message());
            return false;
        }

        $code = wp_remote_retrieve_response_code($response);
        if ($code !== 200) {
            error_log('MVA Location Analysis HTTP ' . $code);
            return false;
        }

        $decoded = json_decode(wp_remote_retrieve_body($response), true);
        $text    = isset($decoded['choices'][0]['message']['content']) ? trim($decoded['choices'][0]['message']['content']) : '';

        // Strip any accidental markdown fencing
        $text = preg_replace('/^```json\s*/i', '', $text);
        $text = preg_replace('/```$/i', '', $text);
        $text = trim($text);

        $result = json_decode($text, true);
        if (!is_array($result)) {
            return false;
        }

        return $result;
    }

    /**
     * Builds a structured case summary for the AI settlement analysis.
     */
    private function build_case_summary($d, $math)
    {
        $low  = isset($math['low'])  ? '$' . number_format((int) $math['low'])  : 'N/A';
        $mid  = isset($math['mid'])  ? '$' . number_format((int) $math['mid'])  : 'N/A';
        $high = isset($math['high']) ? '$' . number_format((int) $math['high']) : 'N/A';

        $loc_labels = array(
            'private_residence' => 'Private residence (house)',
            'apartment_complex' => 'Apartment complex',
            'business'          => 'Business or commercial location',
            'public_park'       => 'Public park or street',
            'other'             => 'Other',
        );
        $loc = isset($d['location']) && isset($loc_labels[$d['location']]) ? $loc_labels[$d['location']] : ($d['location'] ?? 'Unknown');

        $loc_weight = '';
        if (!empty($d['locationAnalysis']) && is_string($d['locationAnalysis'])) {
            $la = json_decode($d['locationAnalysis'], true);
            if (isset($la['weight'])) $loc_weight = $la['weight'] . 'x (' . ($la['coverageLabel'] ?? '') . ')';
        }

        $lines = array(
            "=== DOG BITE CASE DATA ===",
            "",
            "State: "              . ($d['state']           ?? 'Unknown'),
            "Date of Incident: "   . ($d['incidentDate']    ?? 'Unknown'),
            "Location Type: "      . $loc,
            "AI Location Weight: " . ($loc_weight ?: 'N/A'),
            "",
            "--- Victim ---",
            "Victim Age: "         . ($d['victimAge']     ?? 'Unknown'),
            "Incident Description: ". ($d['incidentDesc']  ?? ''),
            "Provocation: "        . ($d['provocation']   ?? 'no'),
            "",
            "--- Dog & Owner ---",
            "Dog Breed: "          . ($d['dogBreed']         ?? 'Unknown'),
            "Owner Known: "        . ($d['ownerKnown']       ?? 'Unknown'),
            "Prior Bite History: " . ($d['priorBiteHistory'] ?? 'Unknown'),
            "Dog Vaccinated: "     . ($d['dogVaccinated']    ?? 'Unknown'),
            "",
            "--- Injuries ---",
            "Injury Description: " . ($d['injuryDesc']     ?? ''),
            "Nerve Injury: "       . ($d['nerveInjury']    ?? 'no'),
            "Nerve Injury Desc: "  . ($d['nerveInjuryDesc'] ?? ''),
            "Rabies Vaccine: "     . ($d['rabiesVaccine']  ?? 'no'),
            "",
            "--- Medical Treatment ---",
            "ER Treatment: "           . ($d['erTreatment']           ?? 'Unknown'),
            "Surgeries Performed: "    . ($d['surgeriesPerformed']    ?? 'no'),
            "Surgeries Recommended: "  . ($d['surgeriesRecommended']  ?? 'no'),
            "Plastic Surgery: "        . ($d['plasticSurgery']        ?? 'no'),
            "Plastic Surgery Desc: "   . ($d['plasticSurgeryDesc']    ?? ''),
            "Future Plastic Surgery: " . ($d['plasticSurgeryFuture']  ?? 'no'),
            "Total Medical Bills: $"   . ($d['totalMedBills']         ?? '0'),
            "Future Medical: "         . ($d['futureMedExpected']     ?? 'no'),
            "Future Medical Amount: $" . ($d['futureMedAmount']       ?? '0'),
            "",
            "--- Scarring ---",
            "Has Scarring: "        . ($d['hasScarring']    ?? 'no'),
            "Scar Locations: "      . ($d['scarLocations']  ?? ''),
            "Scar Description: "    . ($d['scarDesc']       ?? ''),
            "Scar Life Impact: "    . ($d['scarImpact']     ?? ''),
            "",
            "--- Psychological ---",
            "Psych Effects: "     . ($d['psychEffects']   ?? ''),
            "In Therapy: "        . ($d['inTherapy']      ?? 'no'),
            "Psych Permanent: "   . ($d['psychPermanent'] ?? ''),
            "",
            "--- Life Impact & Lost Wages ---",
            "Life Impact: "               . ($d['lifeImpact']             ?? ''),
            "Permanent Limitations: "     . ($d['permanentLimitations']   ?? ''),
            "Missed Work: "               . ($d['missedWork']             ?? 'no'),
            "Occupation: "                . ($d['occupation']             ?? ''),
            "Lost Wages: $"               . ($d['exactLostWages']         ?? '0'),
            "Loss of Earning Capacity: "  . ($d['lossOfEarningCapacity']  ?? 'no'),
            "",
            "=== PRE-CALCULATED SETTLEMENT RANGE ===",
            "Conservative: " . $low,
            "Probable:      " . $mid,
            "Strong Case:   " . $high,
            "",
            "Please provide your structured dog bite settlement analysis.",
        );

        return implode("\n", $lines);
    }

    /**
     * Default system prompt — dog bite settlement analysis
     */
    public static function get_default_prompt()
    {
        return 'You are an expert personal injury legal analyst specializing in dog bite and animal attack settlement valuation. Your role is to review case facts, apply state-specific dog bite liability law internally, and produce a concise settlement value analysis.

You are not an attorney and this is not legal advice. You are an analytical tool to help estimate fair settlement ranges.

INSTRUCTIONS:
1. Internally identify the state\'s dog bite liability doctrine (Strict Liability or One-Bite Rule/Negligence). Apply the correct liability rules — but DO NOT display the doctrine classification to the user.
2. Review all case facts provided.
3. Apply the multiplier method to gross medical bills to estimate pain & suffering.

Case Profile: Minor / Nuisance
Injury Type: Minor punctures, superficial wounds
Treatment Duration: < 4 weeks
Medical Bill Total: Low (< $8,000)
Multiplier Range: 1.0x – 1.25x

Case Profile: Moderate
Injury Type: Multiple bites, lacerations, PT required
Treatment Duration: 2 – 6 months
Medical Bill Total: Moderate ($8k – $25k)
Multiplier Range: 1.5x – 3.0x

Case Profile: Significant
Injury Type: Deep tissue damage, nerve injury, surgery
Treatment Duration: 6+ months
Medical Bill Total: High ($25k – $100k)
Multiplier Range: 3.25x – 4.5x

Case Profile: Catastrophic
Injury Type: Permanent scarring, disfigurement, permanent disability
Treatment Duration: MMI with ongoing care
Medical Bill Total: Extreme (> $100k or ongoing/future care)
Multiplier Range: 5.0x – 10.0x+

4. Factor in surgery, permanent impairment, psychological impact, scarring location and severity (facial scarring on a child = highest value), victim age (child = major premium), prior bite history, and provocation when applying the multiplier.
5. The pre-calculated math result (Conservative/Probable/Strong) is already a ±30% range around the midpoint. Use it as your anchor.
6. Flag key risks: one-bite rule state with no prior bite history, provocation defense, unknown owner, minor injuries, pending surgery.

OUTPUT FORMAT — respond only with this structure:

### 💰 Settlement Range Assessment
$[amount] to $[amount]

### 📌 Disclaimer
This analysis provides informational estimates only and does not establish an attorney-client relationship or privilege. Results are fact specific and subject to significant variation based on available insurance limits, state-specific dog bite laws, and the quality of medical evidence. For a formal legal evaluation, you may opt to have a licensed attorney in your state contact you directly.';
    }
}
