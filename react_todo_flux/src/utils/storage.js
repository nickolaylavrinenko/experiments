
var storageAPI = {

    /* setters */

    setStringItem(key, value){
        if( key && typeof value === 'string' ){
                this._storage.setItem(key, value);
        }
    },

    setDateItem(key, value){
        if( key && value instanceof Date){
            this._storage.setItem(key, value.toJSON());
        }
    },

    setIntItem(key, value){
        if( key && typeof value === 'number' && !isNaN(value) ){
            this._storage.setItem(key, value.toString());
        }
    },

    setObjectItem(key, value){
        if( key && value instanceof Object ){
            this._storage.setItem(key, JSON.stringify(value));
        }
    },

    /* getters */

    getStringItem(key){
        if( key ){
            return this._storage.getItem(key);
        }
    },

    getDateItem(key){
        if( key ){
            return Date.parse(this._storage.getItem(key));
        }
    },

    getIntItem(key){
        if( key ){
            return parseInt(this._storage.getItem(key));
        }
    },

    getObjectItem(key) {
        if( key ){
            var value = this._storage.getItem(key);
            if( value ) {
                return JSON.parse(value);
            } else {
                return void(0);
            }
        }
    },

};


var storage;

if( window.localStorage ){
    storage = window.localStorage;
} else {
    storage = { 
        __storage: {},
        'setItem' : function(key, value){
            if(key){
                this.__storage[key] = value;
            }
        },
        'getItem' : function(key){
            if(key){
                return this.__storage[key];
            }
        },
        'removeItem' : function(key){
            if(key){
                delete this.__storage[key];
            }
        },
    };
}

var StorageProxy  {
    __proto__: storageAPI,
    _storage: storage
};


export {
    StorageProxy
};
