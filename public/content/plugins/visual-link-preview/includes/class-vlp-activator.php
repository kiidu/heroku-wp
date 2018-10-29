<?php
/**
 * Fired during plugin activation.
 *
 * @link       http://bootstrapped.ventures
 * @since      1.0.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
class VLP_Activator {

	/**
	 * Execute this on activation of the plugin.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		add_option( 'vlp_activated', true, '', 'no' );
	}
}
