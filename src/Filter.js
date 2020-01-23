import React from 'react';
import {Button, Dropdown} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import './Filter.css';

const Filter = () => {
    return (
        <div className="Filter">
            <h1>Filter dimension values</h1>
            <label>Datasource</label>
            <Dropdown fluid
                      multiple
                      search
                      selection
                      options={[{key: "DS1key", text: "DS1text", value: "DS1value"}, {
                          key: "DS2key",
                          text: "DS2text",
                          value: "DS2value"
                      }]}/>
            <label>Campain</label>
            <Dropdown fluid
                      multiple
                      search
                      selection
                      options={[{key: "C1key", text: "C1text", value: "C1value"}, {
                          key: "C2key",
                          text: "C2text",
                          value: "C2value"
                      }]}/>
            <Button>Apply</Button>
        </div>
    );
};

export default Filter;