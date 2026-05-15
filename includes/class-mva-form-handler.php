<?php

if (!defined('ABSPATH')) {
    exit;
}

class DBC_Form_Handler
{
    public static function init()
    {
        add_action('wp_ajax_dbc_calculate',                array(__CLASS__, 'handle_calculation'));
        add_action('wp_ajax_nopriv_dbc_calculate',         array(__CLASS__, 'handle_calculation'));
        add_action('wp_ajax_dbc_location_analysis',        array(__CLASS__, 'handle_location_analysis'));
        add_action('wp_ajax_nopriv_dbc_location_analysis', array(__CLASS__, 'handle_location_analysis'));
    }

    public static function handle_location_analysis()
    {
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'dbc_calculator_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed.'));
            return;
        }

        $state         = sanitize_text_field($_POST['state']        ?? '');
        $location_type = sanitize_text_field($_POST['locationType'] ?? '');

        if (empty($state) || empty($location_type)) {
            wp_send_json_error(array('message' => 'Missing required fields.'));
            return;
        }

        $ai_engine = new DBC_AI_Engine();
        $result    = $ai_engine->generate_location_analysis($state, $location_type);

        if (!$result) {
            wp_send_json_error(array('message' => 'AI analysis unavailable.'));
            return;
        }

        wp_send_json_success($result);
    }

    public static function handle_calculation()
    {
        // Verify nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'dbc_calculator_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed.'));
            return;
        }

        // Parse form data (JSON string)
        $form_data_raw  = isset($_POST['formData'])   ? stripslashes($_POST['formData'])   : '{}';
        $math_result_raw = isset($_POST['mathResult']) ? stripslashes($_POST['mathResult']) : '{}';

        $form_data   = json_decode($form_data_raw,   true);
        $math_result = json_decode($math_result_raw, true);

        if (!is_array($form_data)) {
            wp_send_json_error(array('message' => 'Invalid form data.'));
            return;
        }

        // Sanitize lead fields
        $name  = sanitize_text_field($_POST['name']  ?? '');
        $email = sanitize_email($_POST['email']       ?? '');
        $phone = sanitize_text_field($_POST['phone']  ?? '');

        // Sanitize form_data fields
        $form_data = array_map('sanitize_textarea_field', array_map('strval', $form_data));

        // AI Analysis
        $ai_engine  = new DBC_AI_Engine();
        $ai_analysis = $ai_engine->generate_analysis($form_data, $math_result);

        // Always use the disclaimer saved in settings (never the AI-generated one)
        $disclaimer = get_option('dbc_disclaimer', DBC_Settings::get_default_disclaimer());

        // GHL Lead Submission
        $ghl_api_key     = get_option('dbc_ghl_api_key');
        $ghl_location_id = get_option('dbc_ghl_location_id');

        // Parse the "$X to $Y" range from the AI text response
        // If AI failed or returned no range, fall back to the JS math result
        $settlement_low  = 0;
        $settlement_high = 0;
        $settlement_range = '';
        if ($ai_analysis && preg_match('/\$([0-9,]+)\s+to\s+\$([0-9,]+)/i', $ai_analysis, $m)) {
            $settlement_low   = (int) str_replace(',', '', $m[1]);
            $settlement_high  = (int) str_replace(',', '', $m[2]);
            $settlement_range = '$' . number_format($settlement_low) . ' to $' . number_format($settlement_high);
        } else {
            // Fallback: use the pre-calculated math result sent from the JS
            $settlement_low  = isset($math_result['low'])  ? (int) $math_result['low']  : 0;
            $settlement_high = isset($math_result['high']) ? (int) $math_result['high'] : 0;
            if ($settlement_low || $settlement_high) {
                $settlement_range = '$' . number_format($settlement_low) . ' to $' . number_format($settlement_high);
            }
        }

        if ($ghl_api_key && $ghl_location_id && $name && $email) {
            self::send_to_ghl(
                $ghl_api_key,
                $ghl_location_id,
                $name,
                $email,
                $phone,
                $form_data,
                $settlement_range
            );
        }

        wp_send_json_success(array(
            'settlement_low'  => $settlement_low,
            'settlement_high' => $settlement_high,
            'disclaimer'      => $disclaimer,
        ));
    }

    private static function send_to_ghl($api_key, $location_id, $name, $email, $phone, $form_data, $settlement_range = '')
    {
        $log_file = DBC_PLUGIN_DIR . 'ghl_debug.log';

        // Build note content
        $note = "=== DOG BITE SETTLEMENT CALCULATOR LEAD ===\n";
        $note .= "State: "              . ($form_data['state']            ?? '') . "\n";
        $note .= "Incident Date: "      . ($form_data['incidentDate']     ?? '') . "\n";
        $note .= "Location Type: "      . ($form_data['location']         ?? '') . "\n";
        $note .= "Victim Age: "         . ($form_data['victimAge']        ?? '') . "\n";
        $note .= "Dog Breed: "          . ($form_data['dogBreed']         ?? '') . "\n";
        $note .= "Prior Bite History: " . ($form_data['priorBiteHistory'] ?? '') . "\n";
        $note .= "Dog Vaccinated: "     . ($form_data['dogVaccinated']    ?? '') . "\n";
        $note .= "Injuries: "           . ($form_data['injuryDesc']       ?? '') . "\n";
        $note .= "Nerve Injury: "       . ($form_data['nerveInjury']      ?? '') . "\n";
        $note .= "Plastic Surgery: "    . ($form_data['plasticSurgery']   ?? '') . "\n";
        $note .= "Has Scarring: "       . ($form_data['hasScarring']      ?? '') . "\n";
        $note .= "Scar Locations: "     . ($form_data['scarLocations']    ?? '') . "\n";
        $note .= "Scar Description: "   . ($form_data['scarDesc']         ?? '') . "\n";
        $note .= "Medical Bills: $"     . ($form_data['totalMedBills']    ?? '0') . "\n";
        $note .= "Lost Wages: $"        . ($form_data['exactLostWages']   ?? '0') . "\n";
        $note .= "Life Impact: "        . ($form_data['lifeImpact']       ?? '') . "\n";
        $note .= "\nAI Settlement Range: " . ($settlement_range ?: 'N/A') . "\n";

        // Split name
        $name_parts = explode(' ', trim($name), 2);
        $first_name = $name_parts[0];
        $last_name  = $name_parts[1] ?? '';

        // Custom fields for filtering/sorting in GHL
        $custom_fields = array(
            array('key' => 'state_calculator',               'value' => ($form_data['state']            ?? '')),
            array('key' => 'settlement_range_calculator',    'value' => $settlement_range),
            array('key' => 'medical_bills_calculator',       'value' => ($form_data['totalMedBills']    ?? '0')),
            array('key' => 'victim_age_calculator',          'value' => ($form_data['victimAge']        ?? '')),
            array('key' => 'dog_breed_calculator',           'value' => ($form_data['dogBreed']         ?? '')),
            array('key' => 'prior_bite_history_calculator',  'value' => ($form_data['priorBiteHistory'] ?? '')),
            array('key' => 'injury_description_calculator',  'value' => ($form_data['injuryDesc']       ?? '')),
            array('key' => 'has_scarring_calculator',        'value' => ($form_data['hasScarring']      ?? '')),
            array('key' => 'lost_wages_calculator',          'value' => ($form_data['exactLostWages']   ?? '0')),
        );

        $payload = array(
            'locationId'   => $location_id,
            'firstName'    => $first_name,
            'lastName'     => $last_name,
            'email'        => $email,
            'phone'        => $phone,
            'tags'         => array('web-calculator-dog-bite-lead'),
            'source'       => 'Dog Bite Settlement Calculator',
            'customFields' => $custom_fields,
        );

        // Log payload
        $log_entry  = "---MVA---\n";
        $log_entry .= "Time: " . date('Y-m-d H:i:s') . "\n";
        $log_entry .= "Payload: " . json_encode($payload, JSON_PRETTY_PRINT) . "\n";
        file_put_contents($log_file, $log_entry, FILE_APPEND);

        $api_url = 'https://services.leadconnectorhq.com/contacts/';
        $headers = array(
            'Authorization' => 'Bearer ' . $api_key,
            'Version'       => '2021-07-28',
            'Content-Type'  => 'application/json',
        );

        // Create/update contact
        $resp        = wp_remote_post($api_url, array(
            'body'     => json_encode($payload),
            'headers'  => $headers,
            'blocking' => true,
            'timeout'  => 15,
        ));
        $resp_code   = wp_remote_retrieve_response_code($resp);
        $resp_body   = json_decode(wp_remote_retrieve_body($resp), true);
        $contact_id  = null;

        if (!is_wp_error($resp) && $resp_code < 300 && isset($resp_body['contact']['id'])) {
            $contact_id = $resp_body['contact']['id'];
        } elseif ($resp_code === 400 && isset($resp_body['meta']['contactId'])) {
            $contact_id = $resp_body['meta']['contactId'];
            // Update existing contact
            $put_payload = $payload;
            unset($put_payload['locationId']);
            wp_remote_request($api_url . $contact_id, array(
                'method'   => 'PUT',
                'body'     => json_encode($put_payload),
                'headers'  => $headers,
                'blocking' => false,
                'timeout'  => 15,
            ));
        }

        // Log response
        file_put_contents($log_file, "Response: $resp_code | ContactID: $contact_id\n", FILE_APPEND);

        // Add note to contact
        if ($contact_id) {
            wp_remote_post("https://services.leadconnectorhq.com/contacts/{$contact_id}/notes", array(
                'body'     => json_encode(array('body' => $note)),
                'headers'  => $headers,
                'blocking' => false,
            ));
        }
    }
}

// Initialize
DBC_Form_Handler::init();
