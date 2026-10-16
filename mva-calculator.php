<?php
/**
 * Plugin Name: Dog Bite Settlement Calculator
 * Plugin URI: https://pinderplotkin.com
 * Description: Multi-step Dog Bite & Animal Attack Settlement Calculator with AI-powered insurance analysis and GHL lead integration.
 * Version: 1.5.15.5
 * Author: Julian Obando
 * Author URI: https://pinderplotkin.com
 * License: GPL v2 or later
 * Text Domain: dbc-calculator
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants — DBC_ prefix to avoid conflicts with any other plugin
// Version comes from the plugin header above, so assets always cache-bust correctly
$dbc_header = get_file_data(__FILE__, array('Version' => 'Version'));
define('DBC_VERSION', $dbc_header['Version']);
define('DBC_PLUGIN_DIR',      plugin_dir_path(__FILE__));
define('DBC_PLUGIN_URL',      plugin_dir_url(__FILE__));
define('DBC_PLUGIN_BASENAME', plugin_basename(__FILE__));

// Auto-updates from GitHub via Plugin Update Checker
if ( file_exists( DBC_PLUGIN_DIR . 'plugin-update-checker/plugin-update-checker.php' ) ) {
    require_once DBC_PLUGIN_DIR . 'plugin-update-checker/plugin-update-checker.php';
    $dbc_update_checker = \YahnisElsts\PluginUpdateChecker\v5\PucFactory::buildUpdateChecker(
        'https://github.com/Arkantos1231/dog-bite-calculator',
        __FILE__,
        'dbc-calculator'
    );
    $dbc_update_checker->setBranch('main');
}

/**
 * Main plugin class
 */
class DBC_Calculator
{
    private static $instance = null;

    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        $this->load_dependencies();
        $this->init();
    }

    private function load_dependencies()
    {
        require_once DBC_PLUGIN_DIR . 'includes/class-mva-ai-engine.php';
        require_once DBC_PLUGIN_DIR . 'includes/class-mva-form-handler.php';
        require_once DBC_PLUGIN_DIR . 'includes/class-mva-settings.php';
    }

    private function init()
    {
        if (is_admin()) {
            DBC_Settings::init();
        }

        add_action('init',               array($this, 'register_shortcode'));

        // Register assets early (always), enqueue only when shortcode is present
        add_action('wp_enqueue_scripts', array($this, 'register_assets'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets_for_shortcode'));

        // Elementor widget registration
        add_action('elementor/widgets/register', array($this, 'register_elementor_widget'));
    }

    public function register_shortcode()
    {
        add_shortcode('dog_bite_calculator', array($this, 'render_calculator'));
    }

    public function render_calculator()
    {
        ob_start();
        include DBC_PLUGIN_DIR . 'templates/mva-calculator-template.php';
        return ob_get_clean();
    }

    /**
     * Register (but don't enqueue) scripts and styles so Elementor
     * can declare them as dependencies via get_style_depends / get_script_depends.
     */
    public function register_assets()
    {
        wp_register_style(
            'dbc-calculator-css',
            DBC_PLUGIN_URL . 'assets/css/mva-calculator.css',
            array(),
            DBC_VERSION
        );

        wp_register_script(
            'dbc-calculator-js',
            DBC_PLUGIN_URL . 'assets/js/mva-calculator.js',
            array(),
            DBC_VERSION,
            true
        );

        // Localize here so data is always available when the script loads
        wp_localize_script('dbc-calculator-js', 'dbcAjax', array(
            'ajaxurl'    => admin_url('admin-ajax.php'),
            'nonce'      => wp_create_nonce('dbc_calculator_nonce'),
            'lang'       => get_option('dbc_language', 'en'),
            'disclaimer' => get_option('dbc_disclaimer', DBC_Settings::get_default_disclaimer()),
        ));
    }

    /**
     * Enqueue assets automatically when the shortcode is detected on the page.
     */
    public function enqueue_assets_for_shortcode()
    {
        global $post;

        if (!is_a($post, 'WP_Post') || !has_shortcode($post->post_content, 'dog_bite_calculator')) {
            return;
        }

        wp_enqueue_style('dbc-calculator-css');
        wp_enqueue_script('dbc-calculator-js');
    }

    /**
     * Register the Elementor widget.
     */
    public function register_elementor_widget($widgets_manager)
    {
        require_once DBC_PLUGIN_DIR . 'includes/class-dbc-elementor-widget.php';
        $widgets_manager->register(new DBC_Elementor_Widget());
    }
}

// Boot
DBC_Calculator::get_instance();
