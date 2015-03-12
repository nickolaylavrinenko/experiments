
import dispatcher from '../dispatcher';
import const {itemActionTypes: ACTION_TYPES} from '../constants';


var itemActions = {

    addItem( from, till, desc ) {
        dispatcher.dispatch({
            type: ACTION_TYPES.ADD,
            from,
            till,
            desc
        });
    },
 
    moveItem( from, to ) {
        dispatcher.dispatch({
            type: ACTION_TYPES.MOVE,
            from,
            to,
        });
    },

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
