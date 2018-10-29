import { encodeLink, decodeLink } from './admin/encoder';
import FieldType from './admin/form/field-type';
import FieldPost from './admin/form/field-post';
import FieldUrl from './admin/form/field-url';
import FieldTemplate from './admin/form/field-template';

import '../css/blocks/blocks.scss';

const { __ } = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;
const {
	RichText,
	MediaUpload
} = wp.editor;
const {
	Button
} = wp.components;
const {
	Component,
	renderToString,
} = wp.element;

const blockStyle = {
	backgroundColor: '#900',
	color: '#fff',
	padding: '20px',
};

const formattingControls = [ 'bold', 'italic', 'strikethrough' ];

registerBlockType( 'visual-link-preview/link', {
	title: __( 'Visual Link Preview' ),
	icon: 'id',
	keywords: ['vlp'],
	category: 'widgets',
	supportHTML: false,

	attributes: {		
		title: {
			type: 'array',
			source: 'children',
			selector: 'h3',
		},
		summary: {
			type: 'array',
			source: 'children',
			selector: '.summary',
		},
		image_id: {
			type: 'numer',
		},
		image_url: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'src',
		},
		type: {
			type: 'string',
			default: 'internal',
		},
		post: {
			type: 'number',
			default: 0,
		},
		post_label: {
			type: 'string',
			default: '',
		},
		url: {
			type: 'string',
			default: '',
		},
		template: {
			type: 'string',
			default: 'default',
		},
		encoded: {
			type: 'string',
		},
	},

	edit: class extends Component {
		componentWillUpdate(nextProps) {
			let link = Object.assign({}, this.props.attributes);

			link.title = renderToString(link.title);
			link.summary = renderToString(link.summary);
			delete link.encoded;

			const encoded = encodeLink(link);

			if(this.props.attributes.encoded !== encoded) {
				this.props.setAttributes({
					encoded: encoded
				});
			}
		}

		render() {
			const { attributes, setAttributes, isSelected, className } = this.props;

			const imageBlock = (
				<div className={ attributes.image_id ? 'image-selected' : 'no-image' }>
					<MediaUpload
							onSelect={
								( media ) => {
									setAttributes( { image_id: media.id, image_url: media.url } );
								}
							}
							type="image"
							value={ attributes.image_id }
							render={ ( { open} ) => (
								<Button className={ attributes.image_id ? 'image-button' : 'components-button button button-large' } onClick={ open }>
								{
									attributes.image_id
									? <img src={ attributes.image_url } />
									: __( 'Choose Image' )
								}
								</Button>
							) }
						/>
					{ attributes.image_id && isSelected && (
						<a onClick={ (e) => { e.preventDefault(); e.stopPropagation(); setAttributes({ image_id: null, image_url: null }); } }>(remove)</a>
					)}
				</div>
			);

			return [
				<div key="vlp" className={ className }>
					{ attributes.image_id && imageBlock }
					<RichText
						tagName="h3"
						placeholder="Link Title"
						value={ attributes.title }
						onChange={ ( nextValue ) => setAttributes( { title: nextValue } ) }
						formattingControls={ formattingControls }
					/>
					{ ( attributes.summary || isSelected ) && (
						<RichText
							tagName="div"
							multiline="p"
							placeholder="Summary for the link"
							value={ attributes.summary }
							onChange={ ( nextValue ) => setAttributes( { summary: nextValue } ) }
							formattingControls={ formattingControls }
						/>
					)
					}
					{ ( ! attributes.image_id && isSelected ) && imageBlock }
				</div>,
				isSelected && (
					<div key="settings" className="vlp-form">
						<FieldType value={attributes.type} onChangeField={ (value) => setAttributes( { type: value } ) } />
						{
							attributes.type === 'internal'
							?
							<FieldPost
								value={ {
									id: attributes.post,
									text: attributes.post_label,
								} }
								onChangeField={ (option) => {
									setAttributes( {
										post: option.id,
										post_label: option.text,
									} );
								} }
								updateCachedPosts={ () => {} }
							/>
							:
							<FieldUrl value={ attributes.url } onChangeField={ (e) => setAttributes( { url: e.target.value } ) } />
						}
						<FieldTemplate value={ attributes.template } onChangeField={ (value) => setAttributes( { template: value } ) } />
					</div>
				)
			];
		}
	},

	save( { className, attributes } ) {
		return (
			<div className={ className }>
				{
					attributes.image_url && (
						<img className="vlp-image" src={ attributes.image_url } />
					)
				}
				<h3>
					{ attributes.title }
				</h3>
				<div className="summary">
					{ attributes.summary }
				</div>
			</div>
		);
	}
} );