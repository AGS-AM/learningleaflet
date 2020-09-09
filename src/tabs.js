import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { AppBar, Tabs, Tab, Box } from '@material-ui/core'
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@material-ui/core'
// import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from './App'
import { Button } from '@material-ui/core';
// import { Icon } from '@material-ui/core';
import MaterialTable from 'material-table';
//paper is used to make it look like a piece of paper

//get the thingy based on station type and populate the tabs with stuff like a graph ?!? on the type R and smth
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div {...other}>
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
}
async function fetchData() {
    const result = await axios(
        // using axios and not import per future usage
        // './resource/samplegeo.geojson'
        './resource/station.json',
        // this is the one that points to TH 
        // './resource/station_full.json',
    );
    result.data.locations.forEach(element => {
        //console.log(element.station_type);
        element.basin = element.basin || "Empty";
    });
    //console.log(result.data);
    return result.data.locations;
}

// function tableMaker(rows, lookat, inputBasin) {
//     const useStyles = makeStyles({
//         table: {
//             minWidth: 650,
//         },
//     });
//     const classes = useStyles;

//     return (
//         <TableContainer component={Paper}>
//             <Table className={classes.table} aria-label="simple table">
//                 <TableHead>
//                     <TableRow>
//                         <TableCell align="center">ID</TableCell>
//                         <TableCell align="center">Name</TableCell>
//                         <TableCell align="center">Lat</TableCell>
//                         <TableCell align="center">Long</TableCell>
//                         <TableCell align="center">Basin</TableCell>

//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {/* bring in the filter from somewhere else would be better */}
//                     {rows.map((row) => (row.station_type === lookat
//                         ? inputBasin.indexOf(row.basin) !== -1 ?
//                             <TableRow key={row.id}>
//                                 <TableCell component="th" scope="row" align="center">
//                                     {row.id}
//                                 </TableCell>
//                                 <TableCell align="center">{row.name}</TableCell>
//                                 <TableCell align="center">{row.lat}</TableCell>
//                                 <TableCell align="center">{row.lng}</TableCell>
//                                 <TableCell align="center"><Button variant="contained" color="primary" onClick={e => //console.log(row.location)}>BOB</Button></TableCell>
//                             </TableRow>
//                             : null
//                         : null
//                     ))}
//                 </TableBody>
//             </Table>
//         </TableContainer>
//     );
// }
function TabsInfo() {
    const { state, dispatch } = useContext(AppContext);
    //console.log("Tabs");
    //console.log(state.inputArray);
    //console.log(fetchData());
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [purgeA, setpurgeA] = useState([]);
    const [purgeR, setpurgeR] = useState([]);
    useEffect(() => {
        var tempinfo = [];
        var tempA =[];
        var tempR =[];
        async function waitforFetch() {
            tempinfo = await fetchData();
            tempinfo.map((row) => (row.station_type === "A" ? state.inputArray.indexOf(row.basin) !== -1 ? tempA.push(row) :null:null))
            setpurgeA(tempA)
            tempinfo.map((row) => (row.station_type === "R" ? state.inputArray.indexOf(row.basin) !== -1 ? tempR.push(row) :null:null))
            setpurgeR(tempR)
        }
        waitforFetch()
    }, [state]);
//need to create a new effect so this aint pulling every damn time something happens
    const useStyles = makeStyles({
        table: {
            minWidth: 650,
        },
    });
    const classes = useStyles;

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
                        data={purgeR}
                        //create a func above doing the same thing eg. purgeA = fetchedJson.map ? : null and so on
                        actions={[
                            {
                                tooltip: "Fly to in MAP",
                                onClick: (event, rowData) => dispatch({ type: 'UPDATE_INPUT', layer: state.inputArray, fly: [rowData.lat, rowData.lng, 15] })
                            }
                        ]}
                        components={{
                            Action: (props) => (
                                <Button
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
                        data={purgeA}
                        //create a func above doing the same thing eg. purgeA = fetchedJson.map ? : null and so on
                        actions={[
                            {
                                tooltip: "Fly to in MAP",
                                onClick: (event, rowData) => dispatch({ type: 'UPDATE_INPUT', layer: state.inputArray, fly: [rowData.lat, rowData.lng, 15] })
                            }
                        ]}
                        components={{
                            Action: (props) => (
                                <Button
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