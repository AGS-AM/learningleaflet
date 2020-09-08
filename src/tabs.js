import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { AppBar, Tabs, Tab, Box } from '@material-ui/core'

//get the thingy based on station type and populate the tabs with stuff like a graph ?!? on the type R and smth
function TabsInfo() {
    return (

            <AppBar position="static">
                <Tabs  aria-label="simple tabs example">
                    <Tab label="Item One"  />
                    <Tab label="Item Two"  />
                    <Tab label="Item Three"  />
                </Tabs>
            </AppBar>
            

    )
}

export default TabsInfo