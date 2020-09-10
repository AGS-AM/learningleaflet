import React, { useState, useEffect, useRef, useContext } from 'react'
import { Map as LeafletMap, TileLayer, Marker, Popup, LayersControl, LayerGroup } from 'react-leaflet';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import distinct from 'distinct';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Button } from '@material-ui/core';
import { AppContext } from './App'

//could potentially create a func to make the graph here based each marker
//potentially is uncertain LOL

function MapFun() {

    const { state, dispatch } = useContext(AppContext);
    //console.log("Maps");
    //console.log(state);
    const [controlSet] = useState(
        {
            center: [100, 100],//Start Location
            zoom: 6,
            maxZoom: 16, 
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
        result.data.locations.forEach(element => {
            element.basin = element.basin || "Empty";
        });
        setMarkers(result.data);
        return result.data.locations;
    };
    const [markers, setMarkers] = useState({ locations: [] });
    const [rivers, setRivers] = useState([])
    useEffect(() => {
        console.log("Useeffect to distinct happens ONCE");
        waitforFetch();
        var tempinfo = [];
        var temp2 = [];
        async function waitforFetch() {
            tempinfo = await fetchData();
            tempinfo.forEach(element => {
                temp2.push(element.basin)
                
            });

            setRivers(distinct(temp2).sort().reverse());
            
        }
    }, []);
    const mapRef = useRef();
    useEffect(() => {
        console.log("useEffect on flying happens ONLY ON FLYTO");
        const { current = {} } = mapRef;
        const { leafletElement: map } = current;
        setTimeout(() => {
            map.flyTo([state.inputFly[0], state.inputFly[1]], state.inputFly[2], { duration: 3 })
        }, 500);

    }, [state.inputFly]);
    const { BaseLayer, Overlay } = LayersControl;
    var tobepushed = [];
    useEffect(() => {
        console.log("dispatch ONCE");
        const { current = {} } = mapRef;
        const { leafletElement: map } = current;
        map.on("overlayadd", e => {
            tobepushed.push(e.name);
            dispatch({ type: 'UPDATE_INPUT', layer: tobepushed, fly: state.inputFly });

            
        })
        map.on("overlayremove", e => {
            for (var i = 0; i < tobepushed.length; i++) { if (tobepushed[i] === e.name) { tobepushed.splice(i, 1) } }
            dispatch({ type: 'UPDATE_INPUT', layer: tobepushed, fly: state.inputFly });

        })

    },[dispatch]);


    const [option, setOptions] = useState(
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

    function markerOnClick(e) {

        setflip(false)
        var somuchtemp = e.geocode.split('').map(function (item) {
            return parseInt(item, 10);
        });

        setOptions({
            chart: {
                height: 400,
                width: 250,
            },
            title: {
                text: e.name
            },
            series: [
                {
                    name: "random stuff",
                    data: somuchtemp
                },
                {
                    name: "one two three",
                    data: [0,0.5,1, 1.5, 2, 2.5, 3, 3.5]
                }
            ]
        })

    }

    const [flipflop, setflip] = useState(false);
    const clicked = () => setflip(!flipflop);
    var hiRef = useRef();
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
                    return <Overlay name={river} key={river}>
                        <LayerGroup name={"lgroup" + river}>
                            <MarkerClusterGroup>
                                {markers.locations.map(item => {
                                    return item.basin === river ? <Marker position={[item.lat, item.lng]} key={item.id} onclick={e => markerOnClick(item)} >
                                        <Popup>
                                            {flipflop === true ? <HighchartsReact highcharts={Highcharts} options={option} ref={hiRef} /> : null}
                                            <div id={item.id + "_test"}>
                                                <h4>ID: {item.id}</h4>
                                                {item.name}
                                                <br />
                                    Lat : {item.lat}
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    Long : {item.lng}
                                                <br />
                                    Basin Name : {item.basin}
                                                <br />
                                    Type : {item.station_type}
                                            </div>
                                            <Button variant="contained" color={flipflop === false ? "primary" : "secondary"} onClick={clicked}>BOB</Button>
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