
import dispatcher from '../dispatcher';
import {
    actionTypes as ACTION_TYPES
} from '../constants';


var listActions = {

    addItem(from, till, desc) {
        dispatcher.dispatch({
            type: ACTION_TYPES.ADD_ITEM,
            from,
            till,
            desc
        });
    },
 
    moveItem(from, to) {
        dispatcher.dispatch({
            type: ACTION_TYPES.MOVE_ITEM,
            from,
            to,
        });
    },

};


export default listActions;
