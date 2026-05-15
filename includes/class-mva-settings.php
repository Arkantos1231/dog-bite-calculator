<?php

if (!defined('ABSPATH')) {
    exit;
}

class DBC_Settings
{
    public static function init()
    {
        add_action('admin_menu',            array(__CLASS__, 'add_admin_menu'));
        add_action('admin_init',            array(__CLASS__, 'register_settings'));
        add_action('admin_enqueue_scripts', array(__CLASS__, 'enqueue_admin_assets'));
    }

    public static function enqueue_admin_assets($hook)
    {
        if (strpos($hook, 'dbc_') === false) {
            return;
        }
        wp_enqueue_media();
    }

    public static function add_admin_menu()
    {
        add_menu_page(
            'Dog Bite Settlement Calculator',
            'Dog Bite Calc',
            'manage_options',
            'dbc_settings',
            array(__CLASS__, 'render_settings_page'),
            'dashicons-pets',
            21
        );

        add_submenu_page(
            'dbc_settings',
            'General Settings',
            'Settings',
            'manage_options',
            'dbc_settings',
            array(__CLASS__, 'render_settings_page')
        );

        add_submenu_page(
            'dbc_settings',
            'AI Prompt & Disclaimer',
            'AI Prompt',
            'manage_options',
            'dbc_ai_prompt',
            array(__CLASS__, 'render_ai_prompt_page')
        );
    }

    public static function register_settings()
    {
        // General
        register_setting('dbc_options_group', 'dbc_openai_api_key');
        register_setting('dbc_options_group', 'dbc_openai_model');
        register_setting('dbc_options_group', 'dbc_ghl_api_key');
        register_setting('dbc_options_group', 'dbc_ghl_location_id');

        // Language
        register_setting('dbc_options_group', 'dbc_language');

        // AI Prompt & Disclaimer
        register_setting('dbc_prompt_group', 'dbc_system_prompt');
        register_setting('dbc_prompt_group', 'dbc_disclaimer');
    }

    // -------------------------------------------------------------------------
    // Settings Page — API keys, GHL
    // -------------------------------------------------------------------------

    public static function render_settings_page()
    {
        ?>
        <div class="wrap">
            <h1>Dog Bite Settlement Calculator — Settings</h1>
            <form method="post" action="options.php">
                <?php settings_fields('dbc_options_group'); ?>
                <?php do_settings_sections('dbc_options_group'); ?>

                <table class="form-table">

                    <tr valign="top">
                        <th scope="row"><label for="dbc_openai_api_key">OpenAI API Key</label></th>
                        <td>
                            <input type="password" name="dbc_openai_api_key" id="dbc_openai_api_key"
                                value="<?php echo esc_attr(get_option('dbc_openai_api_key')); ?>" class="regular-text" />
                            <p class="description">Your OpenAI secret key (sk-...). Used for AI case analysis.</p>
                        </td>
                    </tr>

                    <tr valign="top">
                        <th scope="row"><label for="dbc_openai_model">OpenAI Model</label></th>
                        <td>
                            <select name="dbc_openai_model" id="dbc_openai_model">
                                <?php
                                $current = get_option('dbc_openai_model', 'gpt-4o');
                                $models  = array(
                                    'gpt-4o'       => 'GPT-4o',
                                    'gpt-4o-mini'  => 'GPT-4o Mini',
                                    'gpt-4.1'      => 'GPT-4.1',
                                    'gpt-4.1-mini' => 'GPT-4.1 Mini',
                                    'gpt-4.1-nano' => 'GPT-4.1 Nano',
                                    'o3'           => 'o3',
                                    'o3-mini'      => 'o3 Mini',
                                    'o4-mini'      => 'o4 Mini',
                                    'gpt-5'        => 'GPT-5',
                                );
                                foreach ($models as $val => $label) {
                                    printf(
                                        '<option value="%s" %s>%s</option>',
                                        esc_attr($val),
                                        selected($current, $val, false),
                                        esc_html($label)
                                    );
                                }
                                ?>
                            </select>
                        </td>
                    </tr>

                    <tr valign="top">
                        <th scope="row">GoHighLevel Integration</th>
                        <td>
                            <p class="description" style="margin-bottom:10px;">Leads submitted through the calculator will be created/updated in GHL.</p>

                            <label style="display:block;margin-bottom:5px;"><strong>API Key (Private Integration Token)</strong></label>
                            <input type="password" name="dbc_ghl_api_key"
                                value="<?php echo esc_attr(get_option('dbc_ghl_api_key')); ?>"
                                class="regular-text" placeholder="pit-..." /><br><br>

                            <label style="display:block;margin-bottom:5px;"><strong>Location ID</strong></label>
                            <input type="text" name="dbc_ghl_location_id"
                                value="<?php echo esc_attr(get_option('dbc_ghl_location_id')); ?>"
                                class="regular-text" placeholder="ZZu..." />
                        </td>
                    </tr>

                    <tr valign="top">
                        <th scope="row"><label for="dbc_language">Calculator Language</label></th>
                        <td>
                            <select name="dbc_language" id="dbc_language">
                                <option value="en" <?php selected(get_option('dbc_language', 'en'), 'en'); ?>>English</option>
                                <option value="es" <?php selected(get_option('dbc_language', 'en'), 'es'); ?>>Español</option>
                            </select>
                            <p class="description">Language displayed to users in the front-end calculator.</p>
                        </td>
                    </tr>

                </table>

                <?php submit_button('Save Settings'); ?>
            </form>
        </div>
        <?php
    }

    // -------------------------------------------------------------------------
    // AI Prompt page
    // -------------------------------------------------------------------------

    public static function render_ai_prompt_page()
    {
        ?>
        <div class="wrap">
            <h1>Dog Bite Calculator — AI Prompt &amp; Disclaimer</h1>
            <p class="description" style="margin-bottom:20px;">
                Edit the system prompt sent to OpenAI for every case analysis. Changes take effect immediately.
            </p>

            <form method="post" action="options.php">
                <?php settings_fields('dbc_prompt_group'); ?>
                <?php do_settings_sections('dbc_prompt_group'); ?>

                <table class="form-table">

                    <tr valign="top">
                        <th scope="row"><label for="dbc_system_prompt">AI System Prompt</label></th>
                        <td>
                            <textarea name="dbc_system_prompt" id="dbc_system_prompt"
                                rows="24" class="large-text code"><?php
                                echo esc_textarea(get_option('dbc_system_prompt', DBC_AI_Engine::get_default_prompt()));
                            ?></textarea>
                            <p class="description">This is the instruction set the AI receives before analyzing each case.</p>
                        </td>
                    </tr>

                    <tr valign="top">
                        <th scope="row"><label for="dbc_disclaimer">Results Disclaimer</label></th>
                        <td>
                            <textarea name="dbc_disclaimer" id="dbc_disclaimer"
                                rows="5" class="large-text"><?php
                                echo esc_textarea(get_option('dbc_disclaimer', self::get_default_disclaimer()));
                            ?></textarea>
                            <p class="description">Shown to the user below their settlement results.</p>
                        </td>
                    </tr>

                </table>

                <?php submit_button('Save AI Settings'); ?>
            </form>
        </div>
        <?php
    }

    public static function get_default_disclaimer()
    {
        return 'This analysis provides informational estimates only and does not establish an attorney-client relationship or privilege. Results are subject to significant variation based on available insurance limits, state-specific dog bite liability doctrine, and the quality of medical and legal evidence. Always consult a licensed personal injury attorney before making any settlement decision.';
    }
}
