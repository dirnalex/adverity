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
                <Filter/>
                <Graph/>
            </div>
        );
    }
}