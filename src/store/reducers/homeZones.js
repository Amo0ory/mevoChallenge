import {FETCH_HOME_ZONES_DATA} from '../actions/homeZones';

const initalState ={
    zones:[]
}

export default (state = initalState, action)=>{
    switch(action.type){
        case FETCH_HOME_ZONES_DATA:
            return {
                zones: action.zones
            }
        
        }
        return state
}