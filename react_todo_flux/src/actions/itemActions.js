
import dispatcher from '../dispatcher';
import {
    actionTypes as ACTION_TYPES
} from '../constants';


var itemActions = {

    setState(id, state) {
        dispatcher.dispatch({
            type: ACTION_TYPES.SET_ITEM_STATE,
            id,
            state
        });
    },

};


export default itemActions;
