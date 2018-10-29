<?php
/**
 * Handle the link preview shortcode.
 *
 * @link       http://bootstrapped.ventures
 * @since      1.0.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 */

/**
 * Handle the link preview shortcode.
 *
 * @since      1.0.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
class VLP_Shortcode {

	/**
	 * Register actions and filters.
	 *
	 * @since    1.0.0
	 */
	public static function init() {
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue' ) );

		add_shortcode( 'visual-link-preview', array( __CLASS__, 'link_preview_shortcode' ) );

		if ( function_exists( 'register_block_type' ) ) {
			$block_settings = array(
				'attributes' => array(
					'encoded' => array(
						'type' => 'string',
						'default' => '',
					),
				),
				'render_callback' => array( __CLASS__, 'link_preview_block' ),
			);

			register_block_type( 'visual-link-preview/link', $block_settings );
		}
	}

	/**
	 * Enqueue stylesheets and scripts.
	 *
	 * @since    1.0.0
	 */
	public static function enqueue() {
		wp_enqueue_style( 'vlp-public', VLP_URL . 'dist/public.css', array(), VLP_VERSION, 'all' );
	}

	/**
	 * Output for the link shortcode.
	 *
	 * @since    1.0.0
	 * @param	 array $atts Options passed along with the shortcode.
	 */
	public static function link_preview_shortcode( $atts ) {
		$atts = shortcode_atts( array(
			'encoded' => '',
		), $atts, 'vlp_link_preview' );

		$link = new VLP_Link( $atts['encoded'] );
		return $link->output();
	}

	/**
	 * Output for the link shortcode.
	 *
	 * @since    1.0.0
	 * @param	 array $atts Options passed along with the shortcode.
	 */
	public static function link_preview_block( $atts ) {
		$encoded = isset( $atts['encoded'] ) ? trim( $atts['encoded'] ) : false;

		if ( $encoded ) {
			$link = new VLP_Link( $encoded );
			return $link->output();
		}

		return '';
	}
}

VLP_Shortcode::init();
