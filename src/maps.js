import React, { useState, useEffect, useRef, useContext } from 'react'
import { Map as LeafletMap, TileLayer, Marker, Popup, LayersControl, LayerGroup, Polygon } from 'react-leaflet';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import distinct from 'distinct';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Button } from '@material-ui/core';
import { AppContext } from './App'
import Chip from '@material-ui/core/Chip';


//could potentially create a func to make the graph here based each marker
//potentially is uncertain LOL
async function thPoly() {
    var temp = []
    var tempret= []
    const fetchData = async () => {
        const result = await axios(
            './resource/thnew.json',
        );
        temp = result.data.features

    
        return temp;
    };
    tempret = await fetchData()
    return tempret
}
function MapFun() {
    
    const { state, dispatch } = useContext(AppContext);
    //context to communicate with other components
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
    //init of Map controls 
    const fetchData = async () => {
        const result = await axios(
            './resource/station.json',
        );
        result.data.locations.forEach(element => {
            element.basin = element.basin || "Empty";
        });
        setMarkers(result.data);
        //Thaimapped polygons here
        var tester = await thPoly();
        console.log(tester);
        return result.data.locations;
    };
    //getches the data from a downloaded json
    const [markers, setMarkers] = useState({ locations: [] });
    const [rivers, setRivers] = useState([]);
    //states to be used
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
            //sorts the distinct basins ONCE 
            setRivers(distinct(temp2).sort().reverse());

        }
    }, []);
    const mapRef = useRef();
    useEffect(() => {
        console.log("useEffect on flying happens ONLY ON FLYTO");
        const { current = {} } = mapRef;
        const { leafletElement: map } = current;
        map.flyTo([state.inputFly[0], state.inputFly[1]], state.inputFly[2], { duration: 1 })
        //as stated in log this allows the users to choose how the map flies around
    }, [state.inputFly]);
    const { BaseLayer, Overlay } = LayersControl;
    var tobepushed = [];
    useEffect(() => {
        console.log("dispatch ONCE");
        const { current = {} } = mapRef;
        const { leafletElement: map } = current;
        map.on("overlayadd", e => {
            setflip(false)
            tobepushed.push(e.name);
            dispatch({ type: 'UPDATE_INPUT', layer: tobepushed, fly: state.inputFly });
            //when a new layer is selected it will be sent to the tabs component

        })
        map.on("overlayremove", e => {
            setflip(false)
            for (var i = 0; i < tobepushed.length; i++) { if (tobepushed[i] === e.name) { tobepushed.splice(i, 1) } }
            dispatch({ type: 'UPDATE_INPUT', layer: tobepushed, fly: state.inputFly });
            //vice versa as a removal would also trigger a change these two parts are the major cause for lag
        })

    }, []);


    const [option, setOptions] = useState(
        {
            //inital state of the Hichart options 
            chart: {
                height: 300,
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
        // setflip(false)
        var somuchtemp = e.geocode.split('').map(function (item) {
            return parseInt(item, 10);
        });
        //no good data was provided so the geo code is plotted into the hichart
        setOptions({
            chart: {
                height: 300,
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
                    data: [0, 1, 2, 3, 4, 5]
                }
            ]
        })
    }
    const [flipflop, setflip] = useState(false);
    //a flipflop state between true and false for a button 
    const clicked = () => setflip(!flipflop);
    var hiRef = useRef();
    //I presume this part is unused but lets keep it here for safe keeps
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
            closePopupOnClick={true} //changable
            worldCopyJump={true}
        >
            
            <Chip
                className="chip"
                label={flipflop === false ? "Show Chart: Off" : "Show Chart: On"}
                color={flipflop === false ? "default" : "primary"}
            />
            <LayersControl>
                <BaseLayer checked name="Tile osm">
                    <TileLayer
                        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                        attribution="BOB"
                    />
                </BaseLayer>
                <BaseLayer name="Stadiamaps">
                    <TileLayer
                        url='https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png'
                        maxNativeZoom={20}
                        attribution={'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'}
                    />
                </BaseLayer>
                {/* testing polygon with maps */}
                {<Polygon positions={[[[100.4697875976563, 14.71473026275629], [100.4965286254884, 14.6971693038941], [100.510971069336, 14.672991752624625], [100.4935913085938, 14.61084270477295], [100.49265289306663, 14.547979354858398], [100.50138854980469, 14.501179695129508], [100.49282836914068, 14.45790100097662], [100.46128082275408, 14.437748908996582], [100.41893005371088, 14.44324016571045], [100.414115905762, 14.504490852355957], [100.31771850585943, 14.488221168518123], [100.28720092773443, 14.496430397033748], [100.25382995605474, 14.481008529663029], [100.2326431274414, 14.48876094818121], [100.20761108398455, 14.52184009552002], [100.19719696044945, 14.555229187011832], [100.21118164062528, 14.577770233154354], [100.19599151611345, 14.607510566711426], [100.2316284179687, 14.650389671325797], [100.21610260009771, 14.690299987792912], [100.20681762695324, 14.740090370178166], [100.21141815185564, 14.776480674743596], [100.22853851318388, 14.789620399475154], [100.24691009521501, 14.796950340270996], [100.29199981689476, 14.78390026092535], [100.33238983154297, 14.799441337585563], [100.34213256835943, 14.77313137054449], [100.3701782226563, 14.763200759887638], [100.38214111328142, 14.74120044708252], [100.40812683105474, 14.754261970520133], [100.41617584228521, 14.726392745971737], [100.4697875976563, 14.71473026275629]]]}></Polygon>}
                {rivers.map(river => {
                    return <Overlay name={river} key={river}>
                        <LayerGroup name={"lgroup" + river}>
                            <MarkerClusterGroup showCoverageOnHover={false} zoomToBoundsOnClick={false}>
                                {/* this has been set to false, now we just create a polygon on each province and zoom on that insteado f this */}
                                {markers.locations.map(item => {
                                    return item.basin === river ? <Marker position={[item.lat, item.lng]} key={item.id} onclick={e => markerOnClick(item)} >
                                        <Popup >
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
                                            <Button variant="contained" color={flipflop === false ? "" : "primary"} onClick={clicked}>BOB</Button>
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