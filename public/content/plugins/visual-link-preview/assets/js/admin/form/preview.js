import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../../css/public/shortcode.scss';

export default class Preview extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isUpdating: false,
            updateQueued: false,
            preview: '',
        }
    }

    componentDidMount() {
        this.updatePreview();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.needPreviewUpdate) {
            this.updatePreview(nextProps.encoded);
        }
    }

    updatePreview(encoded = this.props.encoded) {
        if (this.state.isUpdating) {
            if (!this.state.updateQueued) {
                this.setState({ updateQueued: true });
            }
        } else {
            this.setState({
                isUpdating: true,
                updateQueued: false,
            });

            fetch(vlp_admin.ajax_url, {
                method: 'POST',
                credentials: 'same-origin',
                body: 'action=vlp_get_template&security=' + vlp_admin.nonce + '&encoded=' + encodeURIComponent( encoded ),
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                },
            })
            .then((response) => response.json())
            .then((json) => {
                this.setState({
                    isUpdating: false,
                    preview: json.data.template,
                });

                if(this.state.updateQueued) {
                    this.updatePreview();
                }
            });
        }
    }

    render() {
        const loader = (
            <div id="vlp-preview-loader-container">
                <div id="vlp-preview-loader" className="vlp-loader"></div>
            </div>
        );

        return (
            <div>
                <div id="vlp-preview" dangerouslySetInnerHTML={{__html: this.state.preview}}></div>
                {this.state.isUpdating ? loader : ''}
            </div>
        );
    }
}

Preview.propTypes = {
    link: PropTypes.object.isRequired,
    encoded: PropTypes.string.isRequired,
    needPreviewUpdate: PropTypes.bool.isRequired,
    onFinishedPreview: PropTypes.func.isRequired,
}