import React, { useState, useEffect, useRef } from 'react'
import { Map as LeafletMap, TileLayer, Marker, Popup, LayersControl, LayerGroup } from 'react-leaflet';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import distinct from 'distinct';
import MarkerClusterGroup from 'react-leaflet-markercluster';

function MapFun() {
    const [controlSet, setControl] = useState(
        {
            //seperate these to editable ones and locked dead ones
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
        //Clean the data here and walla ur done with shit 
        //purge data here and send back. or after fetch data
        setMarkers(result.data);
        console.log(result.data);
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
            console.log("temp");
            console.log(distinct(temp2));
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
        //refer to charts for data manip b4 seding off to the webpage
        // see Don . . going to just jsx is a lot better for ur brain than this lol
        // var testgroup = L.layerGroup();
        // var mark = L.marker([11,11]);
        // testgroup.addLayer(mark);
        // testgroup.addTo(map);
        // //var layertest = L.control.layers().addTo(map);
        // //somewhat working but need to rework jsx to align with this method 
        // L.control.layers().addOverlay(testgroup,"testers");
    }, [mapRef]);
    const { BaseLayer, Overlay } = LayersControl;

    //better to create a JS that reads everything and then sends it to this after it's done I guess. . . one file coding sucks already
    const [option, setOption] = useState(
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

    // b4 i forget, get sort, get distinct, run it with river or what ever, create overlay based on that, use if else and add info in, remove the iff A or R and walla more stuff
    return (
        // <ul>
        //     {markers.locations.map(item => (
        //         <li key={item.id}>
        //             <a href={item.lat}>{item.lng} - {item.lat}</a>
        //         </li>
        //     ))}
        // </ul>
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
                {/* more or less make the overlay be generated based on station type ?!? sounds good though */}

                {/* code em here bois */}
                {rivers.map(river => {
                    return river === ""||river === null ? null: <Overlay name={river} key={river}>
                        <LayerGroup name={"lgroup" + river}>
                        <MarkerClusterGroup>
                            {markers.locations.map(item => {
                                return item.basin === river ? <Marker position={[item.lat, item.lng]} key={item.id} >
                                    {/* if else case in jsx which is somehow not what im used to at all coming from basically oop only works */}
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

// class Map extends React.Component {
//     render() {
//         return (
//             <LeafletMap
//                 center={[15, 100]}
//                 zoom={6}
//                 maxZoom={10}
//                 attributionControl={true}
//                 zoomControl={true}
//                 doubleClickZoom={true}
//                 scrollWheelZoom={true}
//                 dragging={true}
//                 animate={true}
//                 easeLinearity={0.35}
//             >
//                 <TileLayer
//                     url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
//                 />
//                 <Marker position={[15, 100]}>
//                     <Popup>
//                         Test
//           </Popup>
//                 </Marker>
//             </LeafletMap>
//         );
//     }
// }

export default MapFun