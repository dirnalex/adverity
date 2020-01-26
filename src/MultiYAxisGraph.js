import React from 'react';
import PropTypes from 'prop-types';
import './MultiYAxisGraph.css';
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {Header, Segment} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const MultiYAxisGraph = ({heading, data, xMeta, yMetas}) => {
    return (
        <Segment basic className="Graph">
            {heading &&
            <Header size='medium' className="heading">{heading}</Header>
            }
            <Segment basic className="graph-box">
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <CartesianGrid/>
                        <XAxis dataKey={xMeta.dataKey} type={xMeta.type} scale={xMeta.scale}
                               orientation={xMeta.orientation}
                               domain={['dataMin', 'dataMax']}
                               tickFormatter={xMeta.formatter}/>
                        {yMetas.map(yMeta => (
                            <YAxis key={yMeta.dataKey} yAxisId={yMeta.dataKey} type={yMeta.type} scale={yMeta.scale}
                                   orientation={yMeta.orientation}
                                   domain={['dataMin', 'dataMax']}
                                   tickFormatter={yMeta.formatter}/>
                        ))}
                        {yMetas.map(yMeta => (
                            <Line key={yMeta.dataKey} yAxisId={yMeta.dataKey} dataKey={yMeta.dataKey} dot={false}
                                  stroke={yMeta.stroke}/>
                        ))}
                        <Tooltip labelFormatter={xMeta.formatter}/>
                    </LineChart>
                </ResponsiveContainer>
            </Segment>
        </Segment>
    );
};

MultiYAxisGraph.propTypes = {
    heading: PropTypes.string,
    data: PropTypes.arrayOf(
        PropTypes.object
    ).isRequired,
    xMeta: PropTypes.shape({
        dataKey: PropTypes.string.isRequired,
        type: PropTypes.oneOf(["number", "category"]),
        scale: PropTypes.string,
        orientation: PropTypes.oneOf(["top", "bottom"]),
        formatter: PropTypes.func
    }).isRequired,
    yMetas: PropTypes.arrayOf(
        PropTypes.shape({
            dataKey: PropTypes.string.isRequired,
            type: PropTypes.oneOf(["number", "category"]),
            scale: PropTypes.string,
            orientation: PropTypes.oneOf(["left", "right"]),
            formatter: PropTypes.func,
            stroke: PropTypes.string
        }).isRequired
    ).isRequired
};

export default MultiYAxisGraph;