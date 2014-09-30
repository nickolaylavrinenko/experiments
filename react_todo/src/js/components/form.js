/** @jsx React.DOM */

// dependensies
var React = require("react");
var Common = require("../common");


var Form = React.createClass({displayName: 'Form',

    render : function() {

        return ( 
            React.DOM.form( {className:"todo-form", onSubmit:this.handleSubmit, ref:"form"}, 
              React.DOM.div( {className:"field-block"}, 
                React.DOM.label( {htmlFor:"input-description"}, "description:"),
                React.DOM.textarea( {className:"todo-body", 
                          id:"input-description", 
                          name:"desc",
                          required:"required"})
              ),
              React.DOM.div( {className:"field-block"}, 
                React.DOM.label( {htmlFor:"input-till-date"}, "dead-line:"),
                React.DOM.input( {className:"todo-till-date", 
                       id:"input-till-date", 
                       name:"till", 
                       type:"date", 
                       required:"required"}),
                React.DOM.button( {className:"submit-button"}, "Add")
              )
            )
        );

    },

    handleSubmit : function(e) {

        e.preventDefault();

        var form = this.refs.form.getDOMNode();
        if( form ) {
            // get values
            var desc = form.desc.value;
            var from_date = new Date();
            var till_string = form.till.value,
                till_date;
            if( desc && from_date && till_string ) {
                // prepare values
                desc = Common.escapeHTML(desc);
                till_date = Common.ISODateStringToDate(till_string);
                if( !till_date ) {
                    till_date = new Date(till_string);
                }
                // pass values to parent component
                if( desc && !isNaN(from_date.getTime()) && !isNaN(till_date.getTime()) ) {
                    if( typeof this.props.parent.addItem === 'function' ) {
                        this.props.parent.addItem(from_date, till_date, desc);
                        // clean form values
                        form.desc.value = '';
                        form.till.value = '';
                    }
                }
            }
        }

    },

});


module.exports = Form;
