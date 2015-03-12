
import React from 'react';
import {getFullDateString} from '../utils/date';
import {
    itemActionTypes as ACTION_TYPES,
    itemStates as ITEM_STATES,
    filterTypes as FILTER_TYPES 
} from '../constants';


// animation parameters
const WAITING_TIMEOUT = 1000,
    ANIMATION_TIMEOUT= 300;


var Item = React.createClass({

    render(){
          
        var class_name = this.props.state || '';
        var buttonsBlock = '';
        var stateBlock = '';
        var now = new Date();

        // determine buttons and state blocks
        if( this.props.state === ITEM_STATES.ACTIVE ) {
            buttonsBlock = (
              <div className="todo-buttons" ref="buttons"> 
                <div className="order" 
                     draggable="true"
                     ref="order_button">
                  {'\u21C5'}
                </div>
                <div className="done" 
                     ref="finish_button">
                  {'\u2714'}
                </div>
                <div className="removed" 
                     ref="remove_button">
                  {'\u2718'}
                </div>
              </div>
            );
//              <div className="todo-state">
//                <div className="outdated">{'\u01C3'}</div>
//              </div>
        } else if( this.props.state === ITEM_STATES.DONE ) {
            stateBlock = (
              <div className="todo-state">
                <div className="done">{'\u2714'}</div>
              </div>
            );
        } else if( this.props.state === ITEM_STATES.REMOVED ) {
            stateBlock = (
              <div className="todo-state">
                <div className="removed">{'\u2718'}</div>
              </div>
            );
        }

        return ( 
            <li className={"todo-item " + class_name} 
                key={this.props.key}
                onMouseDown={this.startWaiting}
                onMouseUp={this.stopWaiting}
                onMouseOut={this.stopWaiting}
                onDragStart={this._handle_drag_start}
                onDragEnd={this._handle_drag_end}
                ref="root">
              <div className="todo-wrapper" 
                   ref="content">
                <span className="todo-body">
                  {this.props.desc}
                </span>
                <div className="todo-footer">
                  <span className="todo-from-date">
                    from <time>{getFullDateString(this.props.from)}</time>
                  </span>
                  <span className="todo-till-date">
                    to <time>{getFullDateString(this.props.till)}</time>
                  </span>
                </div>
              </div>
              { buttonsBlock }
              { stateBlock }
            </li>
        );

    },

    startWaiting() {

        var _this = this;
        var $root = $(this.refs.root.getDOMNode());

        if( this.props.state === ITEM_STATES.ACTIVE ) {
            if( !_this._modify_mode ) {
                $root.css('cursor', 'wait');
                _this._timeout_id = window.setTimeout(function(){
                    $root.css('cursor', 'default');
                    delete _this._timeout_id;
                    _this.switchToModify();
                }, WAITING_TIMEOUT);
            }
        }
 
    },

    stopWaiting() {

        if( this.props.state === ITEM_STATES.ACTIVE ) {
            if( this._timeout_id ) {
                var $root = $(this.refs.root.getDOMNode());
                $root.css('cursor', 'pointer');
                window.clearTimeout(this._timeout_id);
                delete this._timeout_id;
                this._modify_mode = false;
            }
        }

    },

    switchToModify() {

        var _this = this;
        var $root = $(this.refs.root.getDOMNode());

        this._modify_mode = true;
        // add modify class
        if( !$root.hasClass('modify') ) {
            $root.addClass('modify');
        }

        // wait for content animation
        window.setTimeout(function(){

            // show buttons
            var $buttons = $(_this.refs.buttons.getDOMNode());
            $buttons.fadeIn(ANIMATION_TIMEOUT, function(){

                // bind click events when UI will be ready
                $(document.body).on('click', function(e){
                    var $target = $(e.target);
                    if( !$.contains($root.get(0), $target.get(0)) && !$target.is($root) ) {
                        _this.switchBack();
                    }
                });
                var $finish_button = $(_this.refs.finish_button.getDOMNode());
                var $remove_button = $(_this.refs.remove_button.getDOMNode());
                $finish_button.on('click', _this.markAsDone);
                $remove_button.on('click', _this.markAsRemoved);

            });
        }, ANIMATION_TIMEOUT);

    },

    switchBack() {

        var _this = this;
        var $root = $(this.refs.root.getDOMNode());
        var $buttons = $(_this.refs.buttons.getDOMNode());
        var $finish_button = $(_this.refs.finish_button.getDOMNode());
        var $remove_button = $(_this.refs.remove_button.getDOMNode());
        var deferred = $.Deferred();

        // remove modify class
        if( $root.hasClass('modify') ) {
            $root.removeClass('modify');
        }

        // unbind events
        $(document.body).off('click');
        $finish_button.off('click');
        $remove_button.off('click');

        //hide buttons
        $buttons.fadeOut(ANIMATION_TIMEOUT, function(){
            deferred.resolve();
        });
        deferred.done(function(){
            this.props.parent.moveItem();
            this._modify_mode = false;
        }.bind(this));

        return deferred;

    },

    markAsDone(){
        var $content = $(this.refs.content.getDOMNode());
        this.switchBack().done(function(){
            $content.off('mousedown mouseup mouseout');
            this.props.parent.markAsDone(this.props.key);
        }.bind(this));
    },

    markAsRemoved() {
        var $content = $(this.refs.content.getDOMNode());
        this.switchBack().done(function(){
            $content.off('mousedown mouseup mouseout');
            this.props.parent.markAsRemoved(this.props.key);
        }.bind(this));
    },

    _handle_drag_start(e) {
        var $item = $(e.currentTarget);
        var $control = $(e.target);
        var item_offset = $item.offset();
        var control_offset = $control.offset();
        var shift = {
           top: Math.abs(item_offset.top-control_offset.top),
           left: Math.abs(item_offset.left-control_offset.left),
        };
        e.dataTransfer.effectAllowed = 'none';
        e.dataTransfer.setData("text/html", $item[0]);
        e.dataTransfer.setDragImage($item[0], shift.left, shift.top);
    },

});


export default Item;
