import React, {useEffect, useState} from 'react';
import Filter from './Filter.js';
import MultiYAxisGraph from './MultiYAxisGraph.js';
import './Adverity.css';
import {Dimmer, Header, Icon, Loader, Segment} from 'semantic-ui-react';
import moment from 'moment';
import memoizee from 'memoizee';
import 'semantic-ui-css/semantic.min.css';

const INPUT_DATE_FORMAT = "DD.MM.YYYY";
const OUTPUT_DATE_FORMAT = "MMM D YYYY";
const DATA_URL = "http://adverity-challenge.s3-website-eu-west-1.amazonaws.com/DAMKBAoDBwoDBAkOBAYFCw.csv";

const Adverity = () => {
    const [data, setData] = useState([]);
    const [datasources, setDatasources] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [datasourceFilters, setDatasourceFilters] = useState([]);
    const [campaignFilters, setCampaignFilters] = useState([]);
    const [filterString, setFilterString] = useState(composeFilterString([], []));
    const [dataToShow, setDataToShow] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [isDataLoadError, setIsDataLoadError] = useState(false);
    useEffect(() => {
        setIsDataLoading(true);
        loadData(DATA_URL)
            .then(([data, datasources, campaigns]) => {
                setData(data);
                setDataToShow(prepareDataToShow(data));
                setDatasources(datasources);
                setCampaigns(campaigns);
                setIsDataLoadError(false);
            })
            .catch(() => {
                setIsDataLoadError(true);
            })
            .finally(() => {
                setIsDataLoading(false);
            });
    }, []);
    return (
        <Segment basic className="Adverity">
            <Dimmer active={isDataLoading}>
                <Loader>Loading data</Loader>
            </Dimmer>
            <Dimmer active={isDataLoadError}>
                <Header as='h2' icon inverted>
                    <Icon name='ban'/>
                    Failed to load the data
                </Header>
            </Dimmer>
            <div className="filter">
                <Filter heading={"Filter Dimension Values"}
                        dropdowns={[
                            {
                                label: "Datasource",
                                name: "datasource",
                                options: datasources,
                                value: datasourceFilters,
                                onChange: (e, dropdownData) => {
                                    setDatasourceFilters(dropdownData.value);
                                }
                            },
                            {
                                label: "Campaign",
                                name: "campaign",
                                options: campaigns,
                                value: campaignFilters,
                                onChange: (e, dropdownData) => {
                                    setCampaignFilters(dropdownData.value);
                                }
                            }
                        ]}
                        onApply={() => {
                            setDataToShow(prepareDataToShow(filterData(data, datasourceFilters, campaignFilters)));
                            setFilterString(composeFilterString(datasourceFilters, campaignFilters));
                        }}/>
            </div>
            <div className="graph">
                {dataToShow.length > 0 ?
                    <MultiYAxisGraph heading={filterString} data={dataToShow}
                                     xMeta={{
                                         dataKey: "date",
                                         type: "number",
                                         scale: "time",
                                         formatter: (val) => moment(val).format(OUTPUT_DATE_FORMAT)
                                     }}
                                     yMetas={[
                                         {dataKey: "clicks", stroke: "#8884d8"},
                                         {dataKey: "impressions", orientation: "right", stroke: "#82ca9d"}
                                     ]}/> :
                    <Segment basic><Header size='medium'>No data to show</Header></Segment>
                }
            </div>
        </Segment>
    );

};

const composeFilterString = (datasourceFilters, campaignFilters) => {
    if (!datasourceFilters || !campaignFilters) {
        return;
    }
    let datasourceString = datasourceFilters.length > 0 ?
        ("Datasource \"" + datasourceFilters.join("\" and \"") + "\"") :
        "All Datasources";
    let campaignString = campaignFilters.length > 0 ?
        ("Campaign \"" + campaignFilters.join("\" and \"") + "\"") :
        "All Campaigns";
    return datasourceString + "; " + campaignString;
};

const filterData = (data, datasourceFilters, campaignFilters) => (
    data.filter(item =>
        (datasourceFilters.length === 0 || datasourceFilters.includes(item.datasource)) &&
        (campaignFilters.length === 0 || campaignFilters.includes(item.campaign))
    )
);

const prepareDataToShow = data => {
    let dataToShowMap = data.reduce((summedUpData, item) => {
        if (!summedUpData.has(item.date)) {
            summedUpData.set(item.date, {clicks: 0, impressions: 0});
        }
        summedUpData.set(item.date, {
            clicks: summedUpData.get(item.date).clicks + item.clicks,
            impressions: summedUpData.get(item.date).impressions + item.impressions
        });
        return summedUpData;
    }, new Map());
    const dataToShowArr = [];
    dataToShowMap.forEach((values, date) => {
        dataToShowArr.push({date, ...values});
    });
    return dataToShowArr;

};
const loadData = async (dataUrl) => {
    const response = await fetch(dataUrl);
    if (!response.ok) {
        throw new Error("Failed to load file")
    }
    //memoize to skip calculations for the same dataset
    //Not working properly at the moment, need to add Access-Control-Allow-Origin to the server response.
    return await memoizedDataRead(response.headers.get('ETag'), response);
};

const dataRead = async (hash, response) => {
    const csv = await response.text();
    const [header, ...lines] = csv.split("\n");
    const headerArr = header.split(",").map(headerItem => headerItem.toLowerCase());
    const datasourceSet = new Set();
    const campaignSet = new Set();
    const parsedData = lines
        .filter(line => line.trim().length > 0)
        .map((line) => {
            const lineObj = parseline(line, headerArr);
            datasourceSet.add(lineObj.datasource);
            campaignSet.add(lineObj.campaign);
            return lineObj;
        });
    return [parsedData, [...datasourceSet], [...campaignSet]];
};

const memoizedDataRead = memoizee(dataRead, {primitive: true, length: 1});

const parseline = (line, headerArr) =>
    line.split(",").reduce(arrayToObjectReducer.bind(null, headerArr), {});

const arrayToObjectReducer = (headerArr, object, value, index) => ({
    ...object,
    [headerArr[index]]: parseValueWithType(value, headerArr[index])
});
const parseValueWithType = (value, type) => {
    switch (type) {
        case "date":
            return moment(value, INPUT_DATE_FORMAT).valueOf();
        case "clicks":
        case "impressions":
            return Number(value);
        default:
            return value;
    }
};

export default Adverity;