import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { AppBar, Tabs, Tab, Box } from '@material-ui/core'
import { AppContext } from './App'
import { Button } from '@material-ui/core';
import MaterialTable from 'material-table';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function TabPanel(props) {
    //draws the data inside the tabs 
    const { children, value, index, ...other } = props;
    return (
        <div {...other}>
            {value === index && <Box p={0.5}>{children}</Box>}
        </div>
    );
}

async function fetchData() {
    const result = await axios(
        './resource/station.json',
    );
    result.data.locations.forEach(element => {
        element.basin = element.basin || "Empty";
    });
    return result.data.locations;
} //getches the data using axios oh and it changes dem nulls and "" to empty


function TabsInfo() {
    const { state, dispatch } = useContext(AppContext);
    //context for communicating with maps
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
        console.log(newValue);
    };
    const [pre, setPre] = useState([]);
    const [preA, setPreA] = useState([]);
    const [preR, setPreR] = useState([]);
    useEffect(() => {
        //calls the fetched data to be used
        console.log("once only you shall see");
        async function wpre() {
            setPre(await fetchData());
        }
        wpre();
    }, [])
    const [purgeA, setpurgeA] = useState([]);
    const [purgeR, setpurgeR] = useState([]);
    useEffect(() => {
        async function onceuponawait() {
            //to use filter LOL
            setPreA(pre.filter(p => p.station_type === "A"))
            setPreR(pre.filter(p => p.station_type === "R"))
        }
        onceuponawait()
    }, [pre])
    useEffect(() => {
        console.log("Only seen when a change happens in the overlay");
        
        var tempA = [];
        var tempR = [];
        // async function waitforFetch() {
            //purges A and R, there was a plan to make it more stable and optimized but I just threw it out the window. . . .
            if(value === 1)
            {preA.map((row) => ( state.inputArray.indexOf(row.basin) !== -1 ? tempA.push(row) : null));
            setpurgeA(tempA);}
            else
            {preR.map((row) => ( state.inputArray.indexOf(row.basin) !== -1 ? tempR.push(row) : null));
            setpurgeR(tempR);}
        // }
        // waitforFetch()
        //using length as we only want this to run when either there is a new added overlay or an overlay is unselected
    }, [state.inputArray.length,value]);

    return (
        <>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Type R " />
                    <Tab label="Type A " />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                {
                    <MaterialTable
                        columns={[
                            {
                                title: "ID",
                                field: "id",
                                align: "left"
                            },
                            {
                                title: "Name",
                                field: "name",
                                align: "left"
                            },
                            {
                                title: "Lat",
                                field: "lat",
                                align: "left",
                                searchable: false
                            },
                            {
                                title: "Long",
                                field: "lng",
                                align: "left",
                                searchable: false
                            },
                        ]}
                        title="Table of Stuff"
                        data={purgeR}
                        actions={[
                            {
                                tooltip: "Fly to in MAP",
                                onClick: (event, rowData) => dispatch({ type: 'UPDATE_INPUT', layer: state.inputArray, fly: [rowData.lat, rowData.lng, 15] })
                            }
                        ]}
                        detailPanel={rowData => {
                            return (
                                <div>
                                    <HighchartsReact highcharts={Highcharts} options={({
                                        chart: {
                                            height: 300,
                                            width: 500,

                                        },
                                        title: {
                                            text: rowData.name
                                        },
                                        series: [
                                            {
                                                name: "random stuff",
                                                data: rowData.geocode.split('').map(function (item) {
                                                    return parseInt(item, 10);
                                                })
                                            },
                                            {
                                                name: "one two three",
                                                data: [0, 1, 2, 3, 4, 5]
                                            }
                                        ]
                                    })} />
                                </div>
                            )
                        }}
                        components={{
                            Action: (props) => (
                                <Button
                                    disabled={props.data.id % 2 === 0 ? false : true}
                                    onClick={(event) => props.action.onClick(event, props.data)}
                                    color="primary"
                                    variant="outlined"
                                    style={{ textTransform: "none" }}
                                    size="small"
                                    align="left"
                                >
                                    Fly To
                                </Button>
                            )
                        }}
                        options={{
                            actionsColumnIndex: -1,
                            pageSize: 5,
                            pageSizeOptions: []
                        }}
                    />
                }
            </TabPanel>
            <TabPanel value={value} index={1}>
                {
                    <MaterialTable
                        columns={[
                            {
                                title: "ID",
                                field: "id"
                            },
                            {
                                title: "Name",
                                field: "name"
                            },
                            {
                                title: "Lat",
                                field: "lat",
                                searchable: false
                            },
                            {
                                title: "Long",
                                field: "lng",
                                searchable: false
                            },
                        ]}
                        title="Table of Stuff"
                        data={purgeA}
                        actions={[
                            {
                                tooltip: "Fly to in MAP",
                                onClick: (event, rowData) => dispatch({ type: 'UPDATE_INPUT', layer: state.inputArray, fly: [rowData.lat, rowData.lng, 15] })
                            }
                        ]}
                        detailPanel={rowData => {
                            return (
                                <div>
                                    <HighchartsReact highcharts={Highcharts} options={({
                                        chart: {
                                            height: 300,
                                            width: 500,
                                        },
                                        title: {
                                            text: rowData.name
                                        },
                                        series: [
                                            {
                                                name: "random stuff",
                                                data: rowData.geocode.split('').map(function (item) {
                                                    return parseInt(item, 10);
                                                })
                                            },
                                            {
                                                name: "one two three",
                                                data: [0, 1, 2, 3, 4, 5]
                                            }
                                        ]
                                    })} />
                                </div>
                            )
                        }}
                        components={{
                            Action: (props) => (
                                <Button
                                    disabled={props.data.id % 2 === 0 ? false : true}
                                    onClick={(event) => props.action.onClick(event, props.data)}
                                    color="primary"
                                    variant="outlined"
                                    style={{ textTransform: "none" }}
                                    size="small"
                                    align="left"
                                >
                                    Fly To
                                </Button>
                            )
                        }}
                        options={{
                            actionsColumnIndex: -1,
                            pageSize: 5,
                            pageSizeOptions: []
                        }}
                    />
                }
            </TabPanel>
        </>
    );

}


export default TabsInfo