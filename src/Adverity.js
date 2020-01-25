import React, {Component} from 'react';
import Filter from './Filter.js';
import Graph from './Graph.js';
import './Adverity.css';

export default class Adverity extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Adverity">
                <Filter heading={"Filter Dimension Values"}
                        datasources={["DS1", "DS2"]} campains={["C1", "C2"]}
                        onApply={(data) => {
                        }}/>
                <Graph/>
            </div>
        );
    }
}