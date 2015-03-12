
import dispatcher from '../dispatcher';
import {
    itemActionTypes as ACTION_TYPES
} from '../constants';


var listActions = {

    addItem(from, till, desc) {
        dispatcher.dispatch({
            type: ACTION_TYPES.ADD,
            from,
            till,
            desc
        });
    },
 
    moveItem(from, to) {
        dispatcher.dispatch({
            type: ACTION_TYPES.MOVE,
            from,
            to,
        });
    },

};


export default listActions;
