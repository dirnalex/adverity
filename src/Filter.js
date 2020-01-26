import React, {Fragment} from 'react';
import {Button, Divider, Dropdown, Header, Segment} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import './Filter.css';
import PropTypes from "prop-types";

const Filter = ({heading, dropdowns, onApply}) => {
    return (
        <Segment basic className="Filter">
            {heading &&
            <Header size='medium'>{heading}</Header>
            }
            {dropdowns.map(dropdown => {
                const preparedOptions = dropdown.options.map(option => ({
                    key: option,
                    text: option,
                    value: option
                }));
                return (
                    <Fragment key={dropdown.name}>
                        {dropdown.label &&
                        <Header size='small'>{dropdown.label}</Header>
                        }
                        <Dropdown fluid
                                  multiple
                                  search
                                  selection
                                  clearable
                                  options={preparedOptions}
                                  value={dropdown.value}
                                  onChange={dropdown.onChange}
                        />
                    </Fragment>
                );
            })}
            <Divider/>
            <Button onClick={onApply}>Apply</Button>
        </Segment>
    );
};

Filter.propTypes = {
    heading: PropTypes.string,
    dropdowns: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            label: PropTypes.string,
            options: PropTypes.arrayOf(PropTypes.string),
            value: PropTypes.arrayOf(PropTypes.string),
            onChange: PropTypes.func
        })
    ).isRequired,
    onApply: PropTypes.func
};

export default Filter;