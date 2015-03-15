
// styles
import './item.less';


// dependencies
import $ from "jquery";
import React from 'react';
import {DragDropMixin} from 'react-dnd';
import ItemActions from '../actions/itemActions';
import ListActions from '../actions/listActions';
import {getFullDateString} from '../utils/date';
import {
    itemActionTypes as ACTION_TYPES,
    itemStates as ITEM_STATES,
    filterTypes as FILTER_TYPES,
    dragDropTypes as DND_TYPES,
} from '../constants';


// animation parameters
const WAITING_TIMEOUT = 1000;


// drag'n'drop handlers
const dragSource = {
    canDrag(component) {
        return component.state.state &&
            component.state.state === ITEM_STATES.MODIFICATION;
    },
    beginDrag(component) {
        console.log('>>> Begin drag', component);
        return {
          item: {
            id: component.props.id
          }
        };
    }
};

const dropTarget = {
    over(component, item) {
        console.log('>>> Move', item.id, component.props.id);
        ListActions.moveItem(item.id, component.props.id);
    }
};


const Item = React.createClass({

    mixins: [DragDropMixin],

    statics: {
        configureDragDrop(register) {
            register(DND_TYPES.ITEM, {
                dragSource,
                dropTarget
            });
        },
    },

    getInitialState() {
        return {state: this.props.state};
    },

    render(){
          
        const state = this.state.state || '',
            now = new Date(),
            from = this.props.from,
            till = this.props.till,
            desc = this.props.desc;

        var buttons = '';

        // determine buttons
        if( state === ITEM_STATES.MODIFICATION ) {
            buttons = (
                <div className="todoItem_buttons" ref="buttons"> 
                    <div className="order" 
                         draggable="true">
                        {'\u21C5'}
                    </div>
                    <div className="done" 
                         onClick={this._markAsDone}>
                        {'\u2714'}
                    </div>
                    <div className="removed" 
                         onClick={this._markAsRemoved}>
                        {'\u2718'}
                    </div>
                </div>
            );
        } else if( state === ITEM_STATES.ACTIVE ) {
            if(till && till instanceof Date && till <= now) {
                buttons = (
                    <div className="todoItem_state"> 
                        <div className="outdated">{'\u01C3'}</div>
                    </div>
                );
            }
        } else if( state === ITEM_STATES.DONE ) {
            buttons = (
                <div className="todoItem_buttons" ref="buttons"> 
                    <div className="done">{'\u2714'}</div>
                </div>
            );
        } else if( state === ITEM_STATES.REMOVED ) {
            buttons = (
                <div className="todoItem_buttons" ref="buttons"> 
                    <div className="removed">{'\u2718'}</div>
                </div>
            );
        }

        const { isDragging } = this.getDragState(DND_TYPES.ITEM),
            opacity = isDragging ? 0: 1;

        return ( 
            <li {...this.dragSourceFor(DND_TYPES.ITEM)}
                {...this.dropTargetFor(DND_TYPES.ITEM)}
                className={"todoItem " + state} 
                key={this.props.key}
                onMouseDown={this._startWaiting}
                onMouseUp={this._stopWaiting}
                onMouseOut={this._stopWaiting}
                draggable="true"
                ref="root"
                style={{opacity}}>
                <div className="todoItem_contentWrapper" 
                     ref="content">
                    <span className="todoItem_body">
                        {desc}
                    </span>
                    <div className="todoItem_footer">
                        <span className="todoItem_footer_fromDate">
                            from <time>{getFullDateString(from)}</time>
                        </span>
                        <span className="todoItem_footer_tillDate">
                            to <time>{getFullDateString(till)}</time>
                        </span>
                    </div>
                </div>
                { buttons }
            </li>
        );

    },

    componentDidUpdate(prevProps, prevState) {
        const state = this.state.state;

        // bind window click event while modification
        if(state &&
                state === ITEM_STATES.MODIFICATION) {
            this._bindWindowClickEvent();
        } else {
            this._unbindWindowClickEvent();
        }
    },

    _bindWindowClickEvent(){
        const _this = this,
            $root = $(this.refs.root.getDOMNode());

        $(document.body).on('click', function(e){
            const $target = $(e.target);
            if( !$.contains($root.get(0), $target.get(0)) && !$target.is($root) ) {
                _this._switchBack();
            }
        });
    },

    _unbindWindowClickEvent(){
        $(document.body).off('click');
    },

    _startWaiting() {
        const _this = this,
            $root = $(this.refs.root.getDOMNode());

        if( this.state.state === ITEM_STATES.ACTIVE ) {
            $(document.body).trigger('click');
            _this._timeout_id = window.setTimeout(function(){
                delete _this._timeout_id;
                _this._switchToModification();
            }, WAITING_TIMEOUT);
        }
    },

    _stopWaiting() {
        const _this = this,
            $root = $(this.refs.root.getDOMNode());

        if( this.state.state === ITEM_STATES.ACTIVE ) {
            if( this._timeout_id ) {
                window.clearTimeout(this._timeout_id);
                delete this._timeout_id;
                _this._switchBack();
            }
        }
    },

    _switchToModification() {
        this.setState({state: ITEM_STATES.MODIFICATION});
    },

    _switchBack() {
        this.setState({state: ITEM_STATES.ACTIVE});
    },

    _markAsDone(){
        ItemActions.markAsDone(this.props.key);
    },

    _markAsRemoved() {
        ItemActions.markAsRemoved(this.props.key);
    },

//    _handleDragStart(e) {
//        var $item = $(e.currentTarget);
//        var $control = $(e.target);
//        var item_offset = $item.offset();
//        var control_offset = $control.offset();
//        var shift = {
//           top: Math.abs(item_offset.top-control_offset.top),
//           left: Math.abs(item_offset.left-control_offset.left),
//        };
//        e.dataTransfer.effectAllowed = 'none';
//        e.dataTransfer.setData("text/html", $item[0]);
//        e.dataTransfer.setDragImage($item[0], shift.left, shift.top);
//    },

});


export default Item;
