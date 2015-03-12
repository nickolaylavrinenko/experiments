
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


export {
    matchISODate,
    ISODateStringToDate,
    getFullDateString,
};
