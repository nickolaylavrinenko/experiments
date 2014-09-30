/** @jsx React.DOM */

// dependensies
var React = require("react");
var $ = require("jquery");
var Constants = require("../constants");
var Common = require("../common");


var Item = React.createClass({displayName: 'Item',

    WAITING_TIMEOUT: 1000,
    ANIMATION_TIMEOUT: 300,

    render: function(){
          
        var class_name = this.props.state;
        var buttons = '';
        var state = '';
        var now = new Date();

        if( this.props.state === Constants.ITEM_STATE.ACTIVE ) {
            buttons = (
              React.DOM.div( {className:"todo-buttons", ref:"buttons"},  
                React.DOM.div( {className:"order", 
                     draggable:"true",
                     ref:"order_button"}, 
                  '\u21C5'
                ),
                React.DOM.div( {className:"done", 
                     ref:"finish_button"}, 
                  '\u2714'
                ),
                React.DOM.div( {className:"removed", 
                     ref:"remove_button"}, 
                  '\u2718'
                )
              )
            );
//              <div className="todo-state">
//                <div className="outdated">{'\u01C3'}</div>
//              </div>
        } else if( this.props.state === Constants.ITEM_STATE.DONE ) {
            state = (
              React.DOM.div( {className:"todo-state"}, 
                React.DOM.div( {className:"done"}, '\u2714')
              )
            );
        } else if( this.props.state === Constants.ITEM_STATE.REMOVED ) {
            state = (
              React.DOM.div( {className:"todo-state"}, 
                React.DOM.div( {className:"removed"}, '\u2718')
              )
            );
        }

        return ( 
            React.DOM.li( {className:"todo-item " + class_name, 
                onMouseDown:this.startWaiting,
                onMouseUp:this.stopWaiting,
                onMouseOut:this.stopWaiting,
                onDragStart:this._handle_drag_start,
                onDragEnd:this._handle_drag_end,
                'data-id':this.props.key,
                ref:"root"}, 
              React.DOM.div( {className:"todo-wrapper", 
                   ref:"content"}, 
                React.DOM.span( {className:"todo-body"}, 
                  this.props.desc
                ),
                React.DOM.div( {className:"todo-footer"}, 
                  React.DOM.span( {className:"todo-from-date"}, 
                    "from ", React.DOM.time(null, Common.getFullDateString(this.props.from))
                  ),
                  React.DOM.span( {className:"todo-till-date"}, 
                    "to ", React.DOM.time(null, Common.getFullDateString(this.props.till))
                  )
                )
              ),
               buttons, 
               state 
            )
        );

    },

/*
    componentDidMount : function() {

        var $content = $(this.refs.content.getDOMNode());
        if( this.props.state === Constants.ITEM_STATE.ACTIVE ) {
            $content.on('mousedown', function(){
                this.startWaiting();
            }.bind(this));
            $content.on('mouseup mouseout', function(){
                this.stopWaiting();
            }.bind(this));
        } 

    },
*/
/*
    componentWillUnmount : function() {

        var $content = $(this.refs.content.getDOMNode());
        $content.off('mousedown mouseup mouseout');

    },
*/
    startWaiting : function() {

        var _this = this;
        var $root = $(this.refs.root.getDOMNode());

        if( this.props.state === Constants.ITEM_STATE.ACTIVE ) {
            if( !_this._modify_mode ) {
                $root.css('cursor', 'wait');
                _this._timeout_id = window.setTimeout(function(){
                    $root.css('cursor', 'default');
                    delete _this._timeout_id;
                    _this.switchToModify();
                }, _this.WAITING_TIMEOUT);
            }
        }
 
    },

    stopWaiting : function() {

        if( this.props.state === Constants.ITEM_STATE.ACTIVE ) {
            if( this._timeout_id ) {
                var $root = $(this.refs.root.getDOMNode());
                $root.css('cursor', 'pointer');
                window.clearTimeout(this._timeout_id);
                delete this._timeout_id;
                this._modify_mode = false;
            }
        }

    },

    switchToModify : function() {

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
            $buttons.fadeIn(_this.ANIMATION_TIMEOUT, function(){

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
        }, _this.ANIMATION_TIMEOUT);

    },

    switchBack : function() {

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
        $buttons.fadeOut(_this.ANIMATION_TIMEOUT, function(){
            deferred.resolve();
        });
        deferred.done(function(){
            this.props.parent.moveItem();
            this._modify_mode = false;
        }.bind(this));

        return deferred;

    },

    markAsDone : function(){
        var $content = $(this.refs.content.getDOMNode());
        this.switchBack().done(function(){
            $content.off('mousedown mouseup mouseout');
            this.props.parent.markAsDone(this.props.key);
        }.bind(this));
    },

    markAsRemoved : function() {
        var $content = $(this.refs.content.getDOMNode());
        this.switchBack().done(function(){
            $content.off('mousedown mouseup mouseout');
            this.props.parent.markAsRemoved(this.props.key);
        }.bind(this));
    },

    _handle_drag_start : function(e) {
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


var List = React.createClass({displayName: 'List',

    render: function(){

        var _this = this;
        var components = [];
        var items = this.props.items;
        var filter = this.props.filter;

        var interface = {
            markAsDone : this.markAsDone,
            markAsRemoved : this.markAsRemoved,
            moveItem : this.moveItem,
        };

        if( typeof filter === 'function' ) {
            items = items.filter(filter);
        }

        items.forEach(function(item, ind){
            components.push(Item( {key:ind,
                                  desc:item.desc,
                                  state:item.state,
                                  from:item.from, 
                                  till:item.till,
                                  parent:interface})); 
        });

        return (
            React.DOM.ul( {className:"todo-list",
                ref:"list",
                onDragStart:this._handle_drag_start,
                onDragOver:this._handle_drag_over}, 
                components
            )
        );

    },

    markAsDone :function(index) {
        this.props.parent.markAsDone(index);
    },

    markAsRemoved :function(index) {
        this.props.parent.markAsRemoved(index);
    },

    moveItem : function() {
        var list = $(this.refs.list.getDOMNode());
        // update list if ordering occured
        if( this._draggable && this._over ) {
            // obtain indexes for replace
            var from_ind = Number(this._draggable.data('id'));
            var to_ind = Number(this._over.data('id')); 
            // move elements back to its home position
            this._draggable.detach().insertBefore(list.children().get(from_ind));
            // update list items collection
            if( isFinite(from_ind) && isFinite(to_ind) ) {
                this.props.parent.moveItem(from_ind, to_ind);
            }
            this._draggable = null;
            this._over= null;
        }
    },

    _handle_drag_start : function(e) {
        var $control = $(e.target);
        // remember item that is draggable for later comparing
        var $item = $control.closest('.todo-item').first();
        if( $item && $item.length ) {
            this._draggable = $item;
        }
    },

    _handle_drag_over : function(e) {
        var $control = $(e.target);
        var $item = $control.closest('.todo-item').first();
        if( $item && $item.length ) {
            if( this._draggable && !$item.is(this._draggable) ) {
                // remember element
                this._over = $item;
                // replace elements
                if( $item.prev().is(this._draggable) ) {
                    this._draggable.detach();
                    this._draggable.insertAfter($item);
                } else if( $item.next().is(this._draggable) ) {
                    this._draggable.detach();
                    this._draggable.insertBefore($item);
                }
            }
        }
    },


});

module.exports = List;
