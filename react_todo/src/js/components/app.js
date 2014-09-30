/** @jsx React.DOM */

// dependensies
var React = require("react");
var Router = require("react-router-component");
var $ = require("jquery");
var Constants = require("../constants");
var List = require("./list");
var Form = require("./form");

var Locations = Router.Locations;
var Location = Router.Location;
var NotFound = Router.NotFound;
var Link = Router.Link;


var NotFoundPage = React.createClass({displayName: 'NotFoundPage',
    
    render : function() {

        return (
            React.DOM.div( {className:"app-wrapper"}, 
              React.DOM.div( {className:"top-container"}, 
                React.DOM.header( {className:"app-header"}, 
                  React.DOM.div( {className:"logo"}, "TODO_APP")
                ),
                React.DOM.p( {className:"not-found-message"},  
                    "Sorry, the page is not found."
                ),
                React.DOM.div( {className:"push"})
              ),
              React.DOM.div( {className:"bottom-container"}, 
                React.DOM.footer( {className:"app-footer"}, 
                    React.DOM.span( {className:"signature"}, "kolyan-molyan.com"),
                    React.DOM.span( {className:"year"}, ""+(new Date()).getFullYear())
                )
              )
            )
        );

    },

});


var Page = React.createClass({displayName: 'Page',

    getItemsFromStorage : function(){

        var items = this.props.storage.getObjectItem('items') || [];
        items.forEach(function(item){
            item.from = new Date(item.from);
            item.till = new Date(item.till);
        });
        return items;

    },

    getInitialState : function() {

        var items = this.getItemsFromStorage();
        return {'items': items};

    },

    render : function() {

 
        // interface for children
        var interface = {
            addItem : this.addItem,
            moveItem : this.moveItem ,
            markAsDone : this.markAsDone,
            markAsRemoved : this.markAsRemoved, 
        };

        // items
        var items = this.state.items;
 
        // filter
        var filter_name = this.props.filter_name;
        var filter = (filter_name && this['_'+filter_name+'_filter']) || this._all_filter;

        return (
            React.DOM.div( {className:"app-wrapper"}, 
              React.DOM.div( {className:"top-container"}, 
                React.DOM.header( {className:"app-header"}, 
                  React.DOM.div( {className:"logo"}, 
                    Link( {href:"/"}, "TODO_APP")
                  ),
                  React.DOM.div( {className:"menu"}, 
                    "filters:", 
                    Link( {href:"/"}, "all"),
                    Link( {href:"/active"}, "active"),
                    Link( {href:"/outdated"}, "outdated"),
                    Link( {href:"/done"}, "done")
                  )
                ),
                React.DOM.div( {className:"list-container"}, 
                  List( {filter:filter,
                        items:items,
                        parent:interface} )
                ),
                React.DOM.div( {className:"push"})
              ),
              React.DOM.div( {className:"bottom-container"}, 
                React.DOM.div( {className:"form-container"}, 
                  Form( {parent:interface} )
                ),
                React.DOM.footer( {className:"app-footer"}, 
                    React.DOM.span( {className:"signature"}, "kolyan-molyan.com"),
                    React.DOM.span( {className:"year"},  ""+(new Date()).getFullYear() )
                )
              )
            )
        );
    },

    addItem : function(from, till, desc) {

        var items = this.state.items;
        items.push({'from': from,
                    'till': till,
                    'desc': desc,
                    'state': Constants.ITEM_STATE.ACTIVE});
        this.props.storage.setObjectItem('items', items);
        this.setState({'items': items}); 

    },
 
    moveItem : function( from, to ) {

        console.log('>>>> move item ', from, to, this);
        var items = this.state.items;
        if( from<to ) {
           items.splice(to, 0, items.splice(from, 1)[0]);
        } else if (to<from) {
           items.splice(from, 0, items.splice(to, 1)[0]);
        }
        console.log('>>>> move item after', this.state.items, items);
        this.props.storage.setObjectItem('items', items);
        this.setState({'items': items});

    },

    markAsDone :function(index) {

        if( isFinite(index) && index >= 0 ){
            var items = this.state.items;
            if( items.length >= index+1 ) {
                items[index].state = Constants.ITEM_STATE.DONE;
                this.props.storage.setObjectItem('items', items);
                this.setState({'items': items});
            }
        }

    },

    markAsRemoved :function(index) {

        if( isFinite(index) && index >= 0 ){
            var items = this.state.items;
            if( items.length >= index+1 ) {
                items = items.filter(function(item, ind){
                    return item && ind !== index;
                });
                this.props.storage.setObjectItem('items', items);
                this.setState({'items': items});
            }
        }

    },

    // filters 

    _all_filter : function(item) {
        return (item && item.state !== Constants.ITEM_STATE.REMOVED) ? true : false; 
    },
    _active_filter : function(item) {
        var now = new Date();
        return (item && item.state === Constants.ITEM_STATE.ACTIVE) ? true : false;
    },
    _outdated_filter : function(item) {
        var now = new Date();
        return (item && (item.state === Constants.ITEM_STATE.ACTIVE) && 
               (item.till && item.till instanceof Date && item.till <= now)) ? true : false;
    },
    _done_filter : function(item) {
        var now = new Date();
        return (item && item.state === Constants.ITEM_STATE.DONE) ? true : false;
    },
  
});


var App = React.createClass({displayName: 'App',
    
    render : function(){

        return this.transferPropsTo(
            Locations( {className:"full-height"}, 
              Location( {path:"/", 
                        handler:Page, 
                        storage:this.props.storage}),
              Location( {path:"/:filter_name", 
                        handler:Page,
                        storage:this.props.storage}),
              NotFound( {handler:NotFoundPage} )
            )
        );

    },

});

module.exports = App;
