import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { AppBar, Tabs, Tab, Box } from '@material-ui/core'
import { AppContext } from './App'
import { Button } from '@material-ui/core';
import MaterialTable from 'material-table';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div {...other}>
            {value === index && <Box p={1}>{children}</Box>}
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
}
function TabsInfo() {
    const { state, dispatch } = useContext(AppContext);
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [pre, setPre] = useState([]);
    useEffect(()=>{
        console.log("once only you shall see");
        async function wpre(){
            setPre(await fetchData());
        }
        wpre();
    },[])
    const [purgeA, setpurgeA] = useState([]);
    const [purgeR, setpurgeR] = useState([]);
    useEffect(() => {
        console.log("Only seen when a change happens in the overlay");
        var tempA =[];
        var tempR =[];
        async function waitforFetch() {
            pre.map((row) => (row.station_type === "A" ? state.inputArray.indexOf(row.basin) !== -1 ? tempA.push(row) :null:null))
            setpurgeA(tempA)
            pre.map((row) => (row.station_type === "R" ? state.inputArray.indexOf(row.basin) !== -1 ? tempR.push(row) :null:null))
            setpurgeR(tempR)
        }
        waitforFetch()
    }, [state.inputArray.length]);

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
                                field: "id"
                            },
                            {
                                title: "Name",
                                field: "name"
                            },
                            {
                                title: "Lat",
                                field: "lat"
                            },
                            {
                                title: "Long",
                                field: "lng"
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
                        components={{
                            Action: (props) => (
                                <Button disabled={props.data.id%2===0?false:true}
                                    onClick={(event) => props.action.onClick(event, props.data)}
                                    color="primary"
                                    variant="contained"
                                    style={{ textTransform: "none" }}
                                    size="small"
                                >
                                    Fly To
                                </Button>
                            )
                        }}
                        options={{
                            actionsColumnIndex: -1
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
                                field: "lat"
                            },
                            {
                                title: "Long",
                                field: "lng"
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
                        components={{
                            Action: (props) => (
                                <Button disabled={props.data.id%2===0?true:false}
                                    onClick={(event) => props.action.onClick(event, props.data)}
                                    color="primary"
                                    variant="contained"
                                    style={{ textTransform: "none" }}
                                    size="small"
                                >
                                    Fly To
                                </Button>
                            )
                        }}
                        options={{
                            actionsColumnIndex: -1
                        }}
                    />
                }
            </TabPanel>
        </>
    );

}


export default TabsInfo