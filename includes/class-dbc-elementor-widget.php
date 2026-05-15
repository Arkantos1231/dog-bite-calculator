<?php

if (!defined('ABSPATH')) {
    exit;
}

class DBC_Elementor_Widget extends \Elementor\Widget_Base
{
    public function get_name()
    {
        return 'dog_bite_calculator';
    }

    public function get_title()
    {
        return 'Dog Bite Settlement Calculator';
    }

    public function get_icon()
    {
        return 'fa fa-paw';
    }

    public function get_categories()
    {
        return ['general'];
    }

    public function get_keywords()
    {
        return ['dog bite', 'calculator', 'settlement', 'legal', 'injury'];
    }

    public function get_style_depends()
    {
        return ['dbc-calculator-css'];
    }

    public function get_script_depends()
    {
        return ['dbc-calculator-js'];
    }

    protected function register_controls()
    {
        $this->start_controls_section(
            'content_section',
            [
                'label' => 'Dog Bite Calculator',
                'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'info_notice',
            [
                'type'            => \Elementor\Controls_Manager::RAW_HTML,
                'raw'             => '<p style="margin:0;line-height:1.5;">The <strong>Dog Bite Settlement Calculator</strong> will appear here on the live page. No additional configuration needed — use the plugin settings panel to configure OpenAI and GoHighLevel.</p>',
                'content_classes' => 'elementor-panel-alert elementor-panel-alert-info',
            ]
        );

        $this->end_controls_section();
    }

    protected function render()
    {
        // Ensure the localized JS data is available when rendered inside Elementor
        if (!wp_script_is('dbc-calculator-js', 'enqueued')) {
            wp_enqueue_style('dbc-calculator-css');
            wp_enqueue_script('dbc-calculator-js');
        }

        echo DBC_Calculator::get_instance()->render_calculator(); // phpcs:ignore WordPress.Security.EscapeOutput
    }
}
