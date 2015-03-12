
import Flux from 'flux';
import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';
import StorageProxy from '../utils/storage';
import {
    itemActionTypes as ACTION_TYPES,
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
        return (item && item.state !== ITEM_STATES.REMOVED) ? true : false; 
    },

    [FILTER_TYPES.ACTIVE]: function(item) {
        var now = new Date();
        return (item && item.state === ITEM_STATES.ACTIVE) ? true : false;
    },

    [FILTER_TYPES.OUTDATED]: function(item) {
        var now = new Date();
        return (item && (item.state === ITEM_STATES.ACTIVE) && 
               (item.till && item.till instanceof Date && item.till <= now)) ? true : false;
    },

    [FILTER_TYPES.DONE]: function(item) {
        var now = new Date();
        return (item && item.state === ITEM_STATES.DONE) ? true : false;
    },

};


var changeEvent = 'change',
    todoItems = getItemsFromStorage();


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

    addItem( from, till, desc ) {
        if( from && till && desc ) {
            todoItems.push({'from': from,
                            'till': till,
                            'desc': desc,
                            'state': ITEM_STATES.ACTIVE});
        }
    },
 
    moveItem( from, to ) {
        if ( isFinite(from) && isFinite(to) ) {
            if( from < to ) {
               todoItems.splice(to, 0, todoItems.splice(from, 1)[0]);
            } else if ( to < from ) {
               todoItems.splice(from, 0, todoItems.splice(to, 1)[0]);
            }
        }
    },

    markAsDone( index ) {
        if( isFinite(index) && index >= 0 ){
            if( todoItems.length >= index+1 ) {
                todoItems[index].state = ITEM_STATES.DONE;
            }
        }
    },

    markAsRemoved( index ) {
        if( isFinite(index) && index >= 0 ){
            if( todoItems.length >= index+1 ) {
                todoItems[index].state = ITEM_STATES.REMOVED;
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

            case ACTION_TYPES.ADD:
                store.addItem(action.from, action.till, action.desc);
                store.emitChange();
                break;

            case ACTION_TYPES.MOVE:
                store.moveItem(action.from, action.to);
                store.emitChange();
                break;

            case ACTION_TYPES.DONE:
                store.markAsDone(action.index);
                store.emitChange();
                break;

            case ACTION_TYPES.REMOVED:
                store.markAsRemoved(action.index);
                store.emitChange();
                break;

            default:
                // noop
                break;

        }
    }
});


export default store;

