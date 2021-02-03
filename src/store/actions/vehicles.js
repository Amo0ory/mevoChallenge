export const FETCH_VEHICLES_DATA = 'FETCH_VEHICLES_DATA';

export const fetchData = () =>{

    return async (dispatch) =>{
        const response = await fetch('https://api.mevo.co.nz/public/vehicles/all');
        const resData = await response.json();
        const vehiclesPositions = [];
        
        for(const vehicle in resData){
            vehiclesPositions.push(resData[vehicle])
        }
        console.log('vehicel length: '+ vehiclesPositions.length);

        dispatch({type:FETCH_VEHICLES_DATA, vehiclesData:vehiclesPositions, length: vehiclesPositions.length})
    }
}