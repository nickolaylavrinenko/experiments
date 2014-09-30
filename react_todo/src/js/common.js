
// escape HTML utility

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

var escapeHTML = function(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
};


// ISO date utilities (YYYY-MM-DD format)

var ISODateRegExp = /^([0-9]{4})\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/;

var matchISODate = function(string){
    return ISODateRegExp.test(string);
};

var ISODateStringToDate = function(string){

    var parts, result;
    if( matchISODate(string) ) {
        parts = string.split('-');
        if( parts && parts.length===3 ) {
            parts = parts.map(function(part){
                part = part && parseInt(part);
                return (typeof part === 'number' && !isNaN(part)) ? part : -1;
            });
            result = new Date(parts[0], parts[1]-1, parts[2], 23, 59, 59);
        }
    }
    return result;
};

var _month_bindings = [
    'January', 
    'February', 
    'March', 
    'April', 
    'May', 
    'June', 
    'July',
    'August', 
    'September',
    'October',
    'November',
    'December',
];

var getFullDateString = function(date){
    if( date && date instanceof Date && !isNaN(date.getTime()) ) {
        var result = ''+date.getDate()+' '+_month_bindings[date.getMonth()];
        return result + 
                  ((date.getFullYear()===(new Date()).getFullYear()) ? 
                             '' : ' '+date.getFullYear());
    } else {
        return 'Invalid date';
    }
};


// Storage

var storageAPI = {

    /* setters */

    setStringItem : function(key, value){
        
        if( key && typeof value === 'string' ){
                this._storage.setItem(key, value);
        }

    },

    setDateItem : function(key, value){

        if( key && value instanceof Date){
            this._storage.setItem(key, value.toJSON());
        }

    },

    setIntItem : function(key, value){

        if( key && typeof value === 'number' && !isNaN(value) ){
            this._storage.setItem(key, value.toString());
        }

    },

    setObjectItem : function(key, value){

        if( key && value instanceof Object ){
            this._storage.setItem(key, JSON.stringify(value));
        }

    },

    /* getters */

    getStringItem : function(key){

        if( key ){
            return this._storage.getItem(key);
        }

    },

    getDateItem : function(key){

        if( key ){
            return Date.parse(this._storage.getItem(key));
        }

    },

    getIntItem : function(key){

        if( key ){
            return parseInt(this._storage.getItem(key));
        }

    },

    getObjectItem : function(key) {

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

var Storage = function(){

        if( window.localStorage ){
            this._storage = window.localStorage;
        } else {
            this._storage = { 
                'black_list' : ['setItem', 'getItem', 'removeItem', 'black_list'],
                'setItem' : function(key, value){
                    if(key && this.black_list.indexOf(key) < 0){
                        this[key] = value;
                    }
                },
                'getItem' : function(key){
                    if(key && this.black_list.indexOf(key) < 0){
                        return this[key];
                    }
                },
                'removeItem' : function(key){
                    if(key && this.black_list.indexOf(key) < 0){
                        delete this[key];
                    }
                },
            };
        }

};
Storage.prototype = storageAPI;


exports.escapeHTML = escapeHTML;
exports.matchISODate = matchISODate;
exports.ISODateStringToDate = ISODateStringToDate;
exports.getFullDateString = getFullDateString;
exports.Storage = Storage;
