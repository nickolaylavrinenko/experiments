
// styles

import './list.less';

import $ from "jquery";
import React from "react";
import store from '../stores/todoStore';
import Item from './item';
import {
    actionTypes as ACTION_TYPES,
    itemStates as ITEM_STATES,
    filterTypes as FILTER_TYPES 
} from '../constants';


var List = React.createClass({

    // todo collection state is a store state, not component's state
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

        components = items.map(item => {
            return <Item key={item.id}
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

});


export default List;
