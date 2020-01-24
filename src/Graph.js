import React from 'react';
import './Graph.css';
import {ResponsiveLine} from "@nivo/line";

const Graph = () => {
    return (
        <div className="Graph">
            <h1>Graph</h1>
            <div>
                <ResponsiveLine data={[
                    {
                        id: "datasource",
                        color: "red",
                        data: [
                            {
                                x: 0,
                                y: 0
                            },
                            {
                                x: 100,
                                y: 100
                            }
                        ]
                    },
                    {
                        id: "campain",
                        color: "blue",
                        data: [
                            {
                                x: 0,
                                y: 100
                            },
                            {
                                x: 100,
                                y: 0
                            }
                        ]
                    }
                ]}/>
            </div>
        </div>
    );
};

export default Graph;