
// styles
import './app.less';

// dependensies
import React from "react";
import Router,{Link} from "react-router";
import Constants from "./common/constants";
import List from "./list";
import Form from "./form";
import {Storage} from './common/common';


var Link = Router.Link,
    RouteHandler = Router.RouteHandler;


var NotFoundPage = React.createClass({

    render : function() {
        return (
            <div className="app-wrapper">
              <div className="top-container">
                <header className="app-header">
                  <div className="logo">TODO_APP</div>
                </header>
                <p className="not-found-message"> 
                    Sorry, the page is not found.
                </p>
                <div className="push"></div>
              </div>
              <div className="bottom-container">
                <footer className="app-footer">
                    <span className="signature">kolyan-molyan.com</span>
                    <span className="year">{""+(new Date()).getFullYear()}</span>
                </footer>
              </div>
            </div>
        );
    },

});


var Page = React.createClass({

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
        var _interface = {
            addItem : this.addItem,
            moveItem : this.moveItem ,
            markAsDone : this.markAsDone,
            markAsRemoved : this.markAsRemoved, 
        };

        // items
        var items = this.state.items;
 
        // filter
        var filter_name = this.props.params.filter;
        var filter = (filter_name && this['_'+filter_name+'_filter']) || this._all_filter;

        return (
            <div className="app-wrapper">
              <div className="top-container">
                <header className="app-header">
                  <div className="logo">
                    <Link to="index">TODO_APP</Link>
                  </div>
                  <div className="menu">
                    filters: 
                    <Link to="index">all</Link>
                    <Link to="active">active</Link>
                    <Link to="outdated">outdated</Link>
                    <Link to="done">done</Link>
                  </div>
                </header>
                <div className="list-container">
                  <RouteHandler
                        filter={filter}
                        items={items}
                        parent={_interface} />
                </div>
                <div className="push"></div>
              </div>
              <div className="bottom-container">
                <div className="form-container">
                  <Form parent={_interface} />
                </div>
                <footer className="app-footer">
                    <span className="signature">kolyan-molyan.com</span>
                    <span className="year">{ ""+(new Date()).getFullYear() }</span>
                </footer>
              </div>
            </div>
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
        var items = this.state.items;
        if( from<to ) {
           items.splice(to, 0, items.splice(from, 1)[0]);
        } else if (to<from) {
           items.splice(from, 0, items.splice(to, 1)[0]);
        }
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


export {Page, NotFoundPage};

