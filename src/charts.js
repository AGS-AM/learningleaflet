import React, { useState, useEffect, useRef } from 'react'
import { render } from 'react-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

function Charts() {
    const [option, setOption] = useState(
        {
            chart: {
                type: 'spline'
            },
            title: {
                text: 'Test'
            },
            series: [
                {
                    data: [1, 2, 3, 4, 5, 6, 2, 3, 4, 2, 4, 5, 1, 2, 5, 3, 5, 6, 6, 7, 2]
                }
            ]
        }
    )
    const fetchData = async () => {
        const result = await axios(
            // using axios and not import per future usage
            // './resource/samplegeo.geojson'
            './resource/station.json',
            // this is the one that points to TH 
            // './resource/station_full.json',
        );
        //Clean the data here and walla ur done with shit 
        //purge data here and send back. or after fetch data
        console.log("lel");
        console.log(result.data);
        return (result.data);
    };
    useEffect(() => {
        waitforfetch();
        async function waitforfetch() {
            const waitingbruh = await fetchData();            
            const temp = {
                chart: {
                    type: 'spline'
                },
                title: {
                    text: 'BOB'
                },
                series: [
                    {
                        data: [1, 2, 3, 4, 5, 6, 2, 3, 4, 2, 4, 5, 1, 2, 5, 3, 5, 6, 6, 7, 2]
                    },
                    {
                        data: [1,2,3]
                    }
                ]
            }
            // console.log("lol");
            // console.log(waitingbruh);
            setOption(temp);
            console.log(option);
        }
    }, [])


    return (
        <div hidden={false}>
            <HighchartsReact highcharts={Highcharts} options={option} />
        </div>
    )
}

export default Charts