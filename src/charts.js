import React, { useState, useEffect} from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';


function Charts() {
    const [option, setOption] = useState(
        {
            chart: {
                height: 400,
                width: 260,
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
        return (result.data);
    };
    useEffect(() => {
        waitforfetch();
        async function waitforfetch() {
            const waitingbruh = await fetchData();            
            const temp = {
                chart: {
                    height: 400,
                width: 260,
                    type: 'pie'
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
            setOption(temp);
            var {locations} = waitingbruh;
            var reallytemp = [];
            // console.log(locations);
            locations.forEach(element => {
                reallytemp.push(element.basin)
            });

        }
    }, [])

    //resize the div to acutally place it to the right side instead of the btm
    return (
        <div height = "100 px" width="100 px" hidden={false}>
            <HighchartsReact highcharts={Highcharts} options={option}  />
        </div>
    )
}

export default Charts