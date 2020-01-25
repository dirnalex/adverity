import React, {useState} from 'react';
import {Button, Dropdown} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import './Filter.css';

const Filter = ({
                    heading = "", datasources = [], campaigns = [], onApply = () => {
    }
                }) => {
    let [datasourcesSelected, setDatasourcesSelected] = useState([]);
    let [campaignsSelected, setCampaignsSelected] = useState([]);

    let datasourceOptions = datasources.map(datasource => ({
        key: datasource,
        text: datasource,
        value: datasource
    }));
    let campaignOptions = campaigns.map(campaign => ({
        key: campaign,
        text: campaign,
        value: campaign
    }));

    return (
        <div className="Filter">
            <h1>{heading}</h1>
            <label>Datasource</label>
            <Dropdown fluid
                      multiple
                      search
                      selection
                      options={datasourceOptions}
                      value={datasourcesSelected}
                      onChange={(e, data) => {
                          setDatasourcesSelected(data.value);
                      }}
            />
            <label>Campain</label>
            <Dropdown fluid
                      multiple
                      search
                      selection
                      options={campaignOptions}
                      value={campaignsSelected}
                      onChange={(e, data) => {
                          setCampaignsSelected(data.value);
                      }}
            />
            <Button onClick={() => {
                onApply({datasources: datasourcesSelected, campaigns: campaignsSelected});
            }}>Apply</Button>
        </div>
    );
};

export default Filter;