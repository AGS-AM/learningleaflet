import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { AppBar, Tabs, Tab, Box } from '@material-ui/core'

//get the thingy based on station type and populate the tabs with stuff like a graph ?!? on the type R and smth
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div {...other}>
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
}
async function fetchData(){
        const result = await axios(
            // using axios and not import per future usage
            // './resource/samplegeo.geojson'
            './resource/station.json',
            // this is the one that points to TH 
            // './resource/station_full.json',
        );
        // result.data.locations.forEach(element => {
        //     // console.log(element.station_type);
        //     element.basin = element.basin || "Empty";
        // });
        //.log(result.data);
        return result.data.locations;
}
function TabsInfo() {
    // console.log(fetchData());
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [fetchedJson, setfetchedJson] = useState([]);
    useEffect(() => {
    var tempinfo = [];
    async function waitforFetch() {
        tempinfo = await fetchData();
        setfetchedJson(tempinfo)
        console.log(fetchedJson);
        // console.log(distinct(temp2));
        
    }
    waitforFetch()
}, [value]);
//We are using value which is the one controlling the onChange handleChange, so we only run the fetch once per page change 
    return (
        <>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Type R " />
                    <Tab label="Type A " />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
            {/* do the predefine row and stuff and use loop with the if case to check A R and add them to page per page  */}
            {/* fetchedJson mapped here like the markers location maps in the maps file so it technically should work fine right here Woooh 
                Next order of business is to get a working table onto tihs page and on and on and on
             */}
                123
                <h1>test</h1>
        </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
        </TabPanel>
        </>
    );
    
}

export default TabsInfo