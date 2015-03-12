
import dispatcher from '../dispatcher';
import {
    itemActionTypes as ACTION_TYPES
} from '../constants';


var itemActions = {

    markAsDone( index ) {
        dispatcher.dispatch({
            type: ACTION_TYPES.DONE,
            index,
        });
    },

    markAsRemoved( index ) {
        dispatcher.dispatch({
            type: ACTION_TYPES.REMOVED,
            index,
        });
    },

};


export default itemActions;
