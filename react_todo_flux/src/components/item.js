
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
    actionTypes as ACTION_TYPES,
    itemStates as ITEM_STATES,
    filterTypes as FILTER_TYPES,
    dragDropTypes as DND_TYPES,
} from '../constants';


// animation parameters
const WAITING_TIMEOUT = 1000;


// drag'n'drop handlers
const dragSource = {
    canDrag(component) {
        return component.props.state &&
            component.props.state === ITEM_STATES.MODIFICATION;
    },
    beginDrag(component) {
        return {
          item: {
            id: component.props.id
          }
        };
    }
};

const dropTarget = {
    over(component, item) {
        if(item.id !== component.props.id) {
            ListActions.moveItem(item.id, component.props.id);
        }
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
          
        const now = new Date(),
            state = this.props.state,
            from = this.props.from,
            till = this.props.till,
            desc = this.props.desc;

        var buttons = '';

        // buttons and state
        if( state === ITEM_STATES.MODIFICATION ) {
            buttons = (
                <div className="todoItem_buttons" ref="buttons"> 
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
                <div className="todoItem_state"> 
                    <div className="done">{'\u2714'}</div>
                </div>
            );
        } else if( state === ITEM_STATES.REMOVED ) {
            buttons = (
                <div className="todoItem_state"> 
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
                onMouseDown={this._startWaiting}
                onMouseUp={this._stopWaiting}
                onMouseOut={this._stopWaiting}
                ref="root"
                draggable="true"
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
        if(prevProps.state !== this.props.state) {
            if(this.props.state === ITEM_STATES.MODIFICATION) {
                this._bindWindowClickEvent();
            } else {
                this._unbindWindowClickEvent();
            }
        }
    },

    componentDidMount() {
        if(this.props.state === ITEM_STATES.MODIFICATION) {
            this._bindWindowClickEvent();
        }
    },

    _bindWindowClickEvent(){
        const _this = this,
            $root = $(this.refs.root.getDOMNode());

        $(document.body).on('mousedown', function(e){
            const $target = $(e.target);
            if( !$.contains($root.get(0), $target.get(0)) && !$target.is($root) ) {
                _this._markAsActive();
            }
        });
    },

    _unbindWindowClickEvent(){  
        $(document.body).off('mousedown');
    },

    _startWaiting() {
        const _this = this,
            $root = $(this.refs.root.getDOMNode());

        if( this.props.state === ITEM_STATES.ACTIVE ) {
            _this._timeout_id = window.setTimeout(function(){
                delete _this._timeout_id;
                _this._markAsInModification();
            }, WAITING_TIMEOUT);
        }
    },

    _stopWaiting() {
        const _this = this,
            $root = $(this.refs.root.getDOMNode());

        if( this.props.state === ITEM_STATES.ACTIVE ) {
            if( this._timeout_id ) {
                window.clearTimeout(this._timeout_id);
                delete this._timeout_id;
                _this._markAsActive();
            }
        }
    },

    _markAsActive(){
        ItemActions.setState(this.props.id, ITEM_STATES.ACTIVE);
    },

    _markAsInModification() {
        ItemActions.setState(this.props.id, ITEM_STATES.MODIFICATION);
    },

    _markAsDone(){
        this._unbindWindowClickEvent();
        ItemActions.setState(this.props.id, ITEM_STATES.DONE);
    },

    _markAsRemoved() {
        this._unbindWindowClickEvent();
        ItemActions.setState(this.props.id, ITEM_STATES.REMOVED);
    },

});


export default Item;
