import axios from 'axios';

function loadJson() {  
const storeData = async () => {
    const result = await axios(
        // using axios and not import per future usage
        // './resource/samplegeo.geojson'
        './resource/station.json',
        // this is the one that points to TH 
        // './resource/station_full.json',
    );
    
    //Clean the data here and walla ur done with shit 
    //purge data here and send back. or after fetch data
    //console.log(result.data);
    return(result.data);
};
return storeData();
}
export default loadJson