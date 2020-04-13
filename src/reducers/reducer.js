import {combineReducers} from 'redux'

function groupIdSelectedVal(state="",action){
    switch(action.type){
      case 'SET':
        return action.GroupIdSelectedINFO;
      default:
        return state
    }
}



const rootReducer=combineReducers({groupIdSelectedVal})

export default rootReducer
