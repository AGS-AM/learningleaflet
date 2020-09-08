import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { AppBar, Tabs, Tab, Box } from '@material-ui/core'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@material-ui/core'
import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
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
    // result.data.locations.forEach(element => {
    //     // console.log(element.station_type);
    //     element.basin = element.basin || "Empty";
    // });
    console.log(result.data);
    return result.data.locations;
}
function tableMaker(rows,lookat) {

    const useStyles = makeStyles({
        table: {
            minWidth: 650,
        },
    });
    const classes = useStyles;
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">ID</TableCell>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Lat</TableCell>
                        <TableCell align="center">Long</TableCell>
                        <TableCell align="center">Basin</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (row.station_type === lookat ?
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row" align="center">
                                {row.id}
                            </TableCell>
                            <TableCell align="center">{row.name}</TableCell>
                            <TableCell align="center">{row.lat}</TableCell>
                            <TableCell align="center">{row.lng}</TableCell>
                            <TableCell align="center">{row.basin}</TableCell>
                        </TableRow>:null
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
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
        }
        waitforFetch()
    }, []);
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
                    tableMaker(fetchedJson,"R")
                }
            </TabPanel>
            <TabPanel value={value} index={1}>
                {
                    tableMaker(fetchedJson,"A")
                }
            </TabPanel>
        </>
    );

}

export default TabsInfo