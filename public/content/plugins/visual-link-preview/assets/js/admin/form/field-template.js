import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class FieldTemplate extends Component {
    componentWillMount() {
        let options = [];
        for (let template in vlp_admin.templates) {
            options.push({
                value: template,
                label: vlp_admin.templates[template].name,
            });
        }

        this.options = options;
    }

    render() {
        return (
            <div className="vlp-form-line">
                <div className="vlp-form-label">
                    <label htmlFor="vlp-link-template">Template</label>
                </div>
                <div className="vlp-form-input">
                    <Select
                        id="vlp-link-template"
                        options={this.options}
                        simpleValue
                        value={this.props.value}
                        onChange={this.props.onChangeField}
                        searchable={false}
                        clearable={false}
                    />
                </div>
                <div className="vlp-form-description">The template to use for the link.</div>
            </div>
        );
    }
}

FieldTemplate.propTypes = {
    value: PropTypes.string.isRequired,
    onChangeField: PropTypes.func.isRequired,
}