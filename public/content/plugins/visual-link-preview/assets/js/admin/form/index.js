import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FieldImage from './field-image';
import FieldPost from './field-post';
import FieldSummary from './field-summary';
import FieldTemplate from './field-template';
import FieldTitle from './field-title';
import FieldType from './field-type';
import FieldUrl from './field-url';
import Preview from './preview';

export default class Form extends Component {
    
    constructor(props) {
        super(props);
        this.posts = {};
    }

    updateCachedPosts(posts) {
        Object.assign(this.posts, posts);
    }

    onChangePost(option) {
        this.props.onUpdateField('post', option.id);
        this.props.onUpdateField('post_label', option.text);

        if (this.posts.hasOwnProperty(option.id)) {
            let post = this.posts[option.id];

            if (post.image_id && post.image_url) {
                this.props.onUpdateField('image_id', parseInt(post.image_id));
                this.props.onUpdateField('image_url', post.image_url);
            } else {
                this.props.onUpdateField('image_id', 0);
                this.props.onUpdateField('image_url', '');
            }

            this.props.onUpdateField('title', post.title);
        }
    }

    onChangeURL(e) {
        const url = e.target.value;

        // Check if valid URL (https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url).
        const pattern = new RegExp('^(https?:\\/\\/)?'+
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+
            '((\\d{1,3}\\.){3}\\d{1,3}))'+
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
            '(\\?[;&a-z\\d%_.~+=-]*)?'+
            '(\\#[-a-z\\d_]*)?$','i');
        
        if ( pattern.test(url) ) {
            // Valid URL, get Open Graph information.
            // TODO Debounce.
            fetch('https://api.microlink.io?url=' + encodeURIComponent( url ))
            .then((response) => response.json())
            .then((json) => {
                if ( 'success' == json.status ) {
                    if ( json.data.title ) {
                        this.props.onUpdateField('title', json.data.title);
                    }
                    if ( json.data.description ) {
                        this.props.onUpdateField('summary', json.data.description);
                    }
                    if ( json.data.image && json.data.image.url ) {
                        this.props.onUpdateField('image_id', -1);
                        this.props.onUpdateField('image_url', json.data.image.url);
                    }
                }
            });
        }

        this.props.onUpdateField('url', url);
    }

    onChangeImage(image) {
        this.props.onUpdateField('image_id', image.id);
        this.props.onUpdateField('image_url', image.url);
    }
    
    render() {

        let post_option = {
            id: this.props.link.post,
            text: this.props.link.post_label,
        };

        return (
            <div className="vlp-form">
                <div className="vlp-form-section">
                    <FieldType value={this.props.link.type} onChangeField={(value) => this.props.onUpdateField('type', value)} />
                </div>
                <div className="vlp-form-section">
                    {
                        this.props.link.type === 'internal'
                        ?
                        <FieldPost
                            value={post_option}
                            onChangeField={this.onChangePost.bind(this)}
                            updateCachedPosts={this.updateCachedPosts.bind(this)}
                        />
                        :
                        <FieldUrl value={this.props.link.url} onChangeField={this.onChangeURL.bind(this)} />
                    }
                    {
                        this.props.link.type === 'external' || this.props.link.post > 0
                        ?
                        [<FieldImage value={this.props.link.image_id} url={this.props.link.image_url} onChangeField={this.onChangeImage.bind(this)} key={0} />,
                        <FieldTitle value={this.props.link.title} onChangeField={(e) => this.props.onUpdateField('title', e.target.value)} key={1} />,
                        <FieldSummary value={this.props.link.summary} onChangeField={(e) => this.props.onUpdateField('summary', e.target.value)} key={2} />]
                        :
                        ''
                    }
                </div>
                <div className="vlp-form-section">
                    <FieldTemplate value={this.props.link.template} onChangeField={(value) => this.props.onUpdateField('template', value)} />
                </div>
                <Preview
                    link={this.props.link}
                    encoded={this.props.encoded}
                    needPreviewUpdate={this.props.needPreviewUpdate}
                    onFinishedPreview={this.props.onFinishedPreview}
                />
            </div>
        );
    }
}

Form.propTypes = {
    link: PropTypes.object.isRequired,
    encoded: PropTypes.string.isRequired,
    onUpdateField: PropTypes.func.isRequired,
    needPreviewUpdate: PropTypes.bool.isRequired,
    onFinishedPreview: PropTypes.func.isRequired,
}