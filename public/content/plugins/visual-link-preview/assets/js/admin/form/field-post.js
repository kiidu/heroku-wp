import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class FieldPost extends Component {
    getOptions(input) {
        if (!input) {
			return Promise.resolve({ options: [] });
        }

        // TODO Use REST API.
		return fetch(vlp_admin.ajax_url, {
                method: 'POST',
                credentials: 'same-origin',
                body: 'action=vlp_search_posts&security=' + vlp_admin.nonce + '&search=' + encodeURIComponent( input ),
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                },
            })
            .then((response) => response.json())
            .then((json) => {
                this.props.updateCachedPosts(json.data.posts);
                return { options: json.data.posts_with_id };
            });
    }

    render() {
        let value = this.props.value.id === 0 ? null : this.props.value;
        return (
            <div className="vlp-form-line vlp-link-type-internal">
                <div className="vlp-form-label">
                    <label htmlFor="vlp-link-post">Post</label>
                </div>
                <div className="vlp-form-input">
                    <Select.Async
                        placeholder="Select a post or page"
                        value={value}
                        onChange={this.props.onChangeField}
                        valueKey="id"
                        labelKey="text"
                        loadOptions={this.getOptions.bind(this)}
                        clearable={false}
                    />
                </div>
                <div className="vlp-form-description">The post to link to.</div>
            </div>
        );
    }
}

FieldPost.propTypes = {
    value: PropTypes.object.isRequired,
    onChangeField: PropTypes.func.isRequired,
    updateCachedPosts: PropTypes.func.isRequired,
}