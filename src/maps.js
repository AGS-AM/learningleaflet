import React, { useState, useEffect, useRef } from 'react'
import { Map as LeafletMap, TileLayer, Marker, Popup, LayersControl, LayerGroup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';

function MapFun() {
    const [controlSet, setControl] = useState(
        {
            //seperate these to editable ones and locked dead ones
            center: [1, 10],//Start Location
            zoom: 6,
            maxZoom: 8, //changed to 8 to be same with nasa
            attributionControl: true,
            zoomControl: true,
            doubleClickZoom: false,
            scrollWheelZoom: true,
            dragging: true,
            animate: true,
            easeLinearity: 0.35,
        }
    );
    const [markers, setMarkers] = useState({ locations: [] });
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                //using axios and not import per future usage
                './resource/station.json',
                // './resource/station_full.json',
            );
            setMarkers(result.data);
            console.log(result.data);
        };
        fetchData();
    }, []);
    const mapRef = useRef();
    useEffect(() => {
        const { current = {} } = mapRef;
        const { leafletElement: map } = current;
        console.log(map);
        setTimeout(() => {
            map.flyTo([15, 100], 6, { duration: 3 })
        }, 1000);
        var testgroup = L.layerGroup();
        var mark = L.marker([11,11]);
        testgroup.addLayer(mark);
        testgroup.addTo(map);
        //var layertest = L.control.layers().addTo(map);
        //somewhat working but need to rework jsx to align with this method 
        L.control.layers().addOverlay(testgroup,"testers");
    }, [mapRef]);
    const { BaseLayer, Overlay } = LayersControl;



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

                <Overlay name="bob">
                    <LayerGroup name="test">
                        {markers.locations.map(item => (
                            <Marker position={[item.lat, item.lng]} key={item.id}>

                                <Popup>
                                    {item.name}
                                </Popup>
                            </Marker>
                        ))}
                    </LayerGroup>
                    </Overlay>
                    <Overlay name="bob2">
                    <layerGroup name="test2">
                        <Marker position={[1,1]}>

                            <Popup>
                                LOL
                            </Popup>
                        </Marker>
                    </layerGroup>
                </Overlay>
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