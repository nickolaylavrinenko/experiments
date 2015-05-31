
// import Flux from 'flux';
import ShortId from 'shortid';
import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';
import StorageProxy from '../utils/storage';
import {
    actionTypes as ACTION_TYPES,
    itemStates as ITEM_STATES,
    filterTypes as FILTER_TYPES 
} from '../constants';


// functions to work with storage

var getItemsFromStorage = function(){
    var items = StorageProxy.getObjectItem('items') || [];
    items.forEach((item)=>{
        item.from = new Date(item.from);
        item.till = new Date(item.till);
    });
    return items;
};

var saveItemsToStorage = function(items) {
    StorageProxy.setObjectItem('items', items);
};


// data filters 

var dataFilters = {

    [FILTER_TYPES.ALL]: function(item) {
        return true;
    },

    [FILTER_TYPES.ACTIVE]: function(item) {
        return (item &&
                (item.state === ITEM_STATES.ACTIVE ||
                item.state === ITEM_STATES.MODIFICATION)) ? true : false;
    },

    [FILTER_TYPES.OUTDATED]: function(item) {
        var now = new Date();
        return (item && 
                ((item.state === ITEM_STATES.ACTIVE) || 
                (item.state === ITEM_STATES.MODIFICATION)) && 
               (item.till && item.till instanceof Date && item.till <= now)) ? true : false;
    },

    [FILTER_TYPES.DONE]: function(item) {
        return (item && item.state === ITEM_STATES.DONE) ? true : false;
    },

    [FILTER_TYPES.REMOVED]: function(item) {
        return (item && item.state === ITEM_STATES.REMOVED) ? true : false;
    },

};


var changeEvent = 'change',
    todoItems = getItemsFromStorage();


window.todoItems = todoItems;


// flux store

var store = {

    __proto__: EventEmitter.prototype,

    // events interface

    emitChange() {
        this.emit(changeEvent);
    },

    addChangeListener(callback) {
        this.on(changeEvent, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(changeEvent, callback);
    },

    // data interface

    getAllItems() {
        return todoItems;
    },

    getFilteredItems(filterName) {
        var result = this.getAllItems();

        if(filterName &&
                typeof dataFilters[filterName] === 'function') {
            let predicate = dataFilters[filterName];
            result = result.filter(predicate);
        }

        return result;
    },

    addItem(from, till, desc) {
        if(from && till && desc) {
            const id = ShortId.generate();
            todoItems.push({'id': id,
                            'from': from,
                            'till': till,
                            'desc': desc,
                            'state': ITEM_STATES.ACTIVE});
        }
    },
 
    moveItem(fromId, afterId) {
        const from = todoItems.filter(i => i.id === fromId)[0],
            after = todoItems.filter(i => i.id === afterId)[0],
            fromIndex = todoItems.indexOf(from),
            afterIndex = todoItems.indexOf(after);

        if( fromIndex < afterIndex ) {
           todoItems.splice(afterIndex, 0, todoItems.splice(fromIndex, 1)[0]);
        } else if ( afterIndex < fromIndex ) {
           todoItems.splice(fromIndex, 0, todoItems.splice(afterIndex, 1)[0]);
        }
    },

    setItemState(id, state) {
        if(id && state){
            const item = todoItems.filter(i => i.id === id)[0];
            if(item) {
                item.state = state;
            }
        }
    },

};


// register save to storage callback
store.addChangeListener(()=>{
    saveItemsToStorage(todoItems);
});


// register store in events dispatcher
store.token = dispatcher.register((action)=>{
    if ( action ) {
        switch(action.type) {
            case ACTION_TYPES.ADD_ITEM:
                store.addItem(action.from, action.till, action.desc);
                store.emitChange();
                break;

            case ACTION_TYPES.MOVE_ITEM:
                store.moveItem(action.from, action.to);
                store.emitChange();
                break;

            case ACTION_TYPES.SET_ITEM_STATE:
                store.setItemState(action.id, action.state);
                store.emitChange();
                break;

            default:
                // noop
                break;
        }
    }
});


export default store;

