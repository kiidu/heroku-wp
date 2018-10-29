<?php
/**
 * Add the modal.
 *
 * @link       http://bootstrapped.ventures
 * @since      1.0.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/admin/modal
 */

/**
 * Add the modal.
 *
 * @since      1.0.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/admin/modal
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
class VLP_Modal {

	/**
	 * Register actions and filters.
	 *
	 * @since    1.0.0
	 */
	public static function init() {
		add_action( 'admin_footer', array( __CLASS__, 'add_modal_content' ) );

		add_action( 'wp_ajax_vlp_search_posts', array( __CLASS__, 'ajax_search_posts' ) );
		add_action( 'wp_ajax_vlp_save_image', array( __CLASS__, 'ajax_save_image' ) );
	}

	/**
	 * Add modal template to edit screen.
	 *
	 * @since    1.0.0
	 */
	public static function add_modal_content() {
		echo '<div id="vlp-app"></div>';
	}

	/**
	 * Search for posts by keyword.
	 *
	 * @since    1.0.0
	 */
	public static function ajax_search_posts() {
		if ( check_ajax_referer( 'vlp', 'security', false ) ) {
			$search = isset( $_POST['search'] ) ? sanitize_text_field( wp_unslash( $_POST['search'] ) ) : ''; // Input var okay.

			$results = array();
			$results_with_id = array();

			$post_types = apply_filters( 'vlp_post_types', array( 'post', 'page', 'recipe', 'easy_affiliate_link', 'product' ) );

			$args = array(
				'post_type' => $post_types,
				'post_status' => 'any',
				'posts_per_page' => 100,
				's' => $search,
			);

			$query = new WP_Query( $args );

			$posts = $query->posts;
			foreach ( $posts as $post ) {
				$results[ $post->ID ] = array(
					'id' => $post->ID,
					'url' => get_permalink( $post->ID ),
					'image_id' => get_post_thumbnail_id( $post->ID ),
					'image_url' => get_the_post_thumbnail_url( $post ),
					'title' => $post->post_title,
					'excerpt' => $post->post_excerpt,
				);

				$post_type = get_post_type_object( get_post_type( $post ) );

				$results_with_id[] = array(
					'id' => $post->ID,
					'text' => $post_type->labels->singular_name . ' ' . $post->ID . ' - ' . $post->post_title,
				);
			}

			wp_send_json_success( array(
				'posts' => $results,
				'posts_with_id' => $results_with_id,
			) );
		}

		wp_die();
	}

	/**
	 * Save image locally.
	 *
	 * @since    1.3.0
	 */
	public static function ajax_save_image() {
		if ( check_ajax_referer( 'vlp', 'security', false ) ) {
			$url = isset( $_POST['url'] ) ? esc_url( wp_unslash( $_POST['url'] ) ) : ''; // Input var okay.
			$url = str_replace( array( "\n", "\t", "\r" ), '', $url );

			$image_url = media_sideload_image( $url, null, null, 'src' );
			$image_id = attachment_url_to_postid( $image_url );

			if ( ! $image_id ) {
				$image_url = '';
			}

			wp_send_json_success( array(
				'image_id' => $image_id,
				'image_url' => $image_url,
			) );
		}

		wp_die();
	}
}

VLP_Modal::init();
