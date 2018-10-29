<?php
/**
 * Responsible for the link preview template.
 *
 * @link       http://bootstrapped.ventures
 * @since      1.1.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 */

/**
 * Responsible for the link preview template.
 *
 * @since      1.1.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
class VLP_Template_Manager {
	/**
	 * Cached version of all the available templates.
	 *
	 * @since    1.1.0
	 * @access   private
	 * @var      array    $templates    Array containing all templates that have been loaded.
	 */
	private static $templates = array();

	/**
	 * Register actions and filters.
	 *
	 * @since    1.1.0
	 */
	public static function init() {
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue' ) );

		add_action( 'wp_ajax_vlp_get_template', array( __CLASS__, 'ajax_get_template' ) );
	}

	/**
	 * Enqueue stylesheets and scripts.
	 *
	 * @since    1.1.0
	 */
	public static function enqueue() {
		$templates = self::get_templates();

		foreach ( $templates as $template ) {
			wp_enqueue_style( 'vlp-template-' . $template['slug'], $template['url'] . '/' . $template['slug'] . '.min.css', array(), VLP_VERSION, 'all' );
		}
	}

	/**
	 * Get template for a specific link.
	 *
	 * @since    1.1.0
	 * @param	 object $link Link object to get the template for.
	 * @param    mixed  $slug Slug of the specific template we want.
	 */
	public static function get_template( $link, $slug ) {
		$template = self::get_template_by_slug( $slug );

		// Use default template if none found.
		if ( ! $template ) {
			$template = self::get_template_by_slug( 'default' );
		}

		ob_start();
		require( $template['dir'] . '/' . $template['slug'] . '.php' );
		$template = ob_get_contents();
		ob_end_clean();

		$template = do_shortcode( $template );

		return apply_filters( 'vlp_get_template', $template, $link, $slug );
	}

	/**
	 * Search for posts by keyword.
	 *
	 * @since    1.0.0
	 */
	public static function ajax_get_template() {
		if ( check_ajax_referer( 'vlp', 'security', false ) ) {
			$encoded = isset( $_POST['encoded'] ) ? sanitize_text_field( wp_unslash( $_POST['encoded'] ) ) : ''; // Input var okay.
			$link = new VLP_Link( $encoded );

			wp_send_json_success( array(
				'template' => $link->output(),
			) );
		}

		wp_die();
	}

	/**
	 * Get template by name.
	 *
	 * @since    1.1.0
	 * @param		 mixed $slug Slug of the template we want to get.
	 */
	public static function get_template_by_slug( $slug ) {
		$templates = self::get_templates();
		$template = isset( $templates[ $slug ] ) ? $templates[ $slug ] : false;

		return $template;
	}

	/**
	 * Get all available templates.
	 *
	 * @since    1.1.0
	 */
	public static function get_templates() {
		if ( empty( self::$templates ) ) {
			self::load_templates();
		}

		return self::$templates;
	}

	/**
	 * Load all available templates.
	 *
	 * @since    1.1.0
	 */
	private static function load_templates() {
		$templates = array();

		// Load included templates.
		$dirs = array_filter( glob( VLP_DIR . 'templates/link/*' ), 'is_dir' );
		$url = VLP_URL . 'templates/link/';

		foreach ( $dirs as $dir ) {
			$template = self::load_template( $dir, $url, false );
			$templates[ $template['slug'] ] = $template;
		}

		// Load custom templates from parent theme.
		$theme_dir = get_template_directory();

		if ( file_exists( $theme_dir . '/vlp-templates' ) && file_exists( $theme_dir . '/vlp-templates/link' ) ) {
			$url = get_template_directory_uri() . '/vlp-templates/link/';

			$dirs = array_filter( glob( $theme_dir . '/vlp-templates/link/*' ), 'is_dir' );

			foreach ( $dirs as $dir ) {
				$template = self::load_template( $dir, $url, true );
				$templates[ $template['slug'] ] = $template;
			}
		}

		// Load custom templates from child theme (if present).
		if ( get_stylesheet_directory() !== $theme_dir ) {
			$theme_dir = get_stylesheet_directory();

			if ( file_exists( $theme_dir . '/vlp-templates' ) && file_exists( $theme_dir . '/vlp-templates/link' ) ) {
				$url = get_stylesheet_directory_uri() . '/vlp-templates/link/';

				$dirs = array_filter( glob( $theme_dir . '/vlp-templates/link/*' ), 'is_dir' );

				foreach ( $dirs as $dir ) {
					$template = self::load_template( $dir, $url, true );
					$templates[ $template['slug'] ] = $template;
				}
			}
		}

		self::$templates = $templates;
	}

	/**
	 * Load template from directory.
	 *
	 * @since    1.1.0
	 * @param    mixed 	 $dir 	 Directory to load the template from.
	 * @param	 mixed 	 $url 	 URL to load the template from.
	 * @param	 boolean $custom Wether or not this is a custom template included by the user.
	 */
	private static function load_template( $dir, $url, $custom = false ) {
		$slug = basename( $dir );
		$name = ucwords( str_replace( '-', ' ', $slug ) );

		$screenshot = false;
		$screenshots = glob( $dir . '/' . $slug . '.{jpg,jpeg,png,gif}', GLOB_BRACE );
		if ( ! empty( $screenshots ) ) {
			$info = pathinfo( $screenshots[0] );
			$screenshot = $info['extension'];
		}

		return array(
			'custom' => $custom,
			'name' => $name,
			'slug' => $slug,
			'dir' => $dir,
			'url' => $url . $slug,
			'screenshot' => $screenshot,
		);
	}
}

VLP_Template_Manager::init();
