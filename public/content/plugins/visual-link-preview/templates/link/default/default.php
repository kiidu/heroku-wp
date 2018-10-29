<?php
/**
 * Default link template.
 *
 * @link       http://bootstrapped.ventures
 * @since      1.0.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/templates/link
 */

?>

<div class="vlp-link-container vlp-template-default">
	<?php if ( $link->url() ) : ?>
	<?php $link_attributes = 'external' === $link->type() ? ' rel="nofollow" target="_blank"' : ''; ?>
	<a href="<?php echo esc_attr( $link->url() ); ?>" class="vlp-link" title="<?php echo esc_html( $link->title() ); ?>"<?php echo $link_attributes; ?>></a>
	<?php endif; // URL. ?>
	<?php if ( $link->image_id() ) : ?>
	<div class="vlp-link-image-container">
		<div class="vlp-link-image">
			<?php echo $link->image( array( 150, 999 ) ); ?>
		</div>
	</div>
	<?php endif; // Image ID. ?>
	<div class="vlp-link-text-container">
		<?php if ( $link->title() ) : ?>
		<div class="vlp-link-title">
			<?php echo wp_kses_post( $link->title() ); ?>
		</div>
		<?php endif; // Title. ?>
		<?php if ( $link->summary() ) : ?>
		<div class="vlp-link-summary">
			<?php echo wp_kses_post( $link->summary() ); ?>
		</div>
		<?php endif; // Summary. ?>
	</div>
</div>
