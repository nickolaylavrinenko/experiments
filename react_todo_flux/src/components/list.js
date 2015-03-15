
// styles
import './list.less';


// dependensies
import $ from "jquery";
import React from "react";
import store from '../stores/todoStore';
import Item from './item';
import {
    itemActionTypes as ACTION_TYPES,
    itemStates as ITEM_STATES,
    filterTypes as FILTER_TYPES 
} from '../constants';


var List = React.createClass({

    // to not to store todos collection state a a component state
    // todo collection state is a store state

    componentDidMount() {
        store.addChangeListener(this._dataChangedCallback.bind(this));
    },

    componentWillUnmount() {
        store.removeChangeListener(this._dataChangedCallback);
    },

    _dataChangedCallback() {
        this.forceUpdate();
    },

    // end of block

    render(){
        var filterName = this.props.params.filter || 'all',
            items = store.getFilteredItems(filterName),
            components = [];

        components = items.map((item, id)=>{
            return <Item key={id}
                         id={item.id}
                         desc={item.desc}
                         state={item.state}
                         from={item.from} 
                         till={item.till} />;
        });

        return (
            <ul className="todoList"
                ref="list">
                {components}
            </ul>
        );

    },

//    moveItem() {
//        var list = $(this.refs.list.getDOMNode());
//        // update list if ordering occured
//        if( this._draggable && this._over ) {
//            // obtain indexes for replace
//            var from_ind = Number(this._draggable.data('id'));
//            var to_ind = Number(this._over.data('id')); 
//            // move elements back to its home position
//            this._draggable.detach().insertBefore(list.children().get(from_ind));
//            // update list items collection
//            if( isFinite(from_ind) && isFinite(to_ind) ) {
//                this.props.parent.moveItem(from_ind, to_ind);
//            }
//            this._draggable = null;
//            this._over= null;
//        }
//    },
//
//    _handle_drag_start(e) {
//        var $control = $(e.target);
//        // remember item that is draggable for later comparing
//        var $item = $control.closest('.todo-item').first();
//        if( $item && $item.length ) {
//            this._draggable = $item;
//        }
//    },
//
//    _handle_drag_over(e) {
//        var $control = $(e.target);
//        var $item = $control.closest('.todo-item').first();
//        if( $item && $item.length ) {
//            if( this._draggable && !$item.is(this._draggable) ) {
//                // remember element
//                this._over = $item;
//                // replace elements
//                if( $item.prev().is(this._draggable) ) {
//                    this._draggable.detach();
//                    this._draggable.insertAfter($item);
//                } else if( $item.next().is(this._draggable) ) {
//                    this._draggable.detach();
//                    this._draggable.insertBefore($item);
//                }
//            }
//        }
//    },

});


export default List;
