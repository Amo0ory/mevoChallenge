import GeoJSON from 'geojson';

export const FETCH_HOME_ZONES_DATA = 'FETCH_HOME_ZONES_DATA';

export const fetchData = () =>{

    return async (dispatch) =>{
        const response = await fetch('https://api.mevo.co.nz/public/home-zones/all');

        const resData = await response.json();
      
    
        dispatch({type:FETCH_HOME_ZONES_DATA, zones:resData})
    }
}