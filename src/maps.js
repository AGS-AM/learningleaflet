import React, { useState, useEffect, useRef } from 'react'
import { Map as LeafletMap, TileLayer, Marker, Popup, LayersControl, LayerGroup } from 'react-leaflet';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import distinct from 'distinct';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import {Button} from '@material-ui/core';

function MapFun() {
    const [controlSet] = useState(
        {

            center: [10, 100],//Start Location
            zoom: 6,
            maxZoom: 16, //changed to 8 to be same with nasa
            attributionControl: true,
            zoomControl: true,
            doubleClickZoom: false,
            scrollWheelZoom: true,
            dragging: true,
            animate: true,
            easeLinearity: 0.35,
        }
    );
    const fetchData = async () => {
        const result = await axios(
            // using axios and not import per future usage
            // './resource/samplegeo.geojson'
            './resource/station.json',
            // this is the one that points to TH 
            // './resource/station_full.json',
        );
        setMarkers(result.data);
        return result.data.locations;
    };
    const [markers, setMarkers] = useState({ locations: [] });
    const [rivers, setRivers] = useState([])
    useEffect(() => {
        waitforFetch();
        var tempinfo = [];
        var temp2 = [];
        async function waitforFetch() {
            tempinfo = await fetchData();

            tempinfo.forEach(element => {
                temp2.push(element.basin)
            });
            // console.log("temp");
            // console.log(distinct(temp2));
            setRivers(distinct(temp2));
            return distinct(temp2);
        }

    }, []);
    const mapRef = useRef();
    useEffect(() => {
        const { current = {} } = mapRef;
        const { leafletElement: map } = current;
        // console.log(map);
        setTimeout(() => {
            map.flyTo([10, 100], 6, { duration: 3 })
        }, 1000);
    }, [mapRef]);
    const { BaseLayer, Overlay } = LayersControl;

    const [option] = useState(
        {
            
            chart: {
                height: 400,
                width: 260,
                type: 'pie'
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

    return (
        <LeafletMap ref={mapRef}
            center={controlSet.center}
            zoom={controlSet.zoom}
            maxZoom={controlSet.maxZoom}
            attributionControl={controlSet.attributionControl}
            zoomControl={controlSet.zoomControl}
            doubleClickZoom={controlSet.doubleClickZoom}
            scrollWheelZoom={controlSet.scrollWheelZoom}
            dragging={controlSet.dragging}
            animate={controlSet.animate}
            easeLinearity={controlSet.easeLinearity}
            worldCopyJump={true}
        >
            <LayersControl>
                <BaseLayer checked name="street">
                    <TileLayer
                        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    />
                </BaseLayer>
                <BaseLayer name="nasa">
                    <TileLayer
                        url='https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg'
                        maxNativeZoom={8}
                    />
                </BaseLayer>
                {rivers.map(river => {
                    return river === "" || river === null ?
                        /*<Overlay name="Unknown" key="Unknown">
                            <LayerGroup name={"lgroup" + "Unknown"}>
                                <MarkerClusterGroup>
                                    {markers.locations.map(item => {
                                        return item.basin === river ? <Marker position={[item.lat, item.lng]} key={item.id} >
                                            
                                            <Popup>
                                                <HighchartsReact highcharts={Highcharts} options={option} />
                                                <div id={item.id + "_test"}>
                                                    <h4>ID: {item.id}</h4>
                                                    {item.name}
                                                    <br></br>
                                    Lat : {item.lat}
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    Long : {item.lng}
                                                    <br></br>
                                    Basin Name : {item.basin}
                                                </div>
                                            </Popup>
                                        </Marker> : null
                                    })}
                                </MarkerClusterGroup>
                            </LayerGroup>
                        </Overlay>*/
                        //Nulled due to the fact that "" and null was not merged
                        null
                        :
                        <Overlay name={river} key={river}>
                            <LayerGroup name={"lgroup" + river}>
                                <MarkerClusterGroup>
                                    {markers.locations.map(item => {
                                        return item.basin === river ? <Marker position={[item.lat, item.lng]} key={item.id} >
                                            <Popup>
                                                <HighchartsReact highcharts={Highcharts} options={option} />
                                                <div id={item.id + "_test"}>
                                                    <h4>ID: {item.id}</h4>
                                                    {item.name}
                                                    <br></br>
                                    Lat : {item.lat}
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    Long : {item.lng}
                                                    <br></br>
                                    Basin Name : {item.basin}
                                                </div>
                                            <Button variant="contained" color="primary" >BOB</Button>
                                            </Popup>
                                        </Marker> : null
                                    }
                                    )
                                    }
                                </MarkerClusterGroup>
                            </LayerGroup>
                        </Overlay>

                })}

            </LayersControl>
        </LeafletMap>
    );

}
export default MapFun