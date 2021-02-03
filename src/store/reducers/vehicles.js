import {FETCH_VEHICLES_DATA} from '../actions/vehicles';

const initalState ={
    vehiclesData:[],
    length: 0
}

export default (state = initalState, action)=>{
    switch(action.type){
        case FETCH_VEHICLES_DATA:
            return {
                vehiclesData:action.vehiclesData,
                length: action.length
            }
        
        }
        return state
}