// styles
import './form.less';

// dependensies
import React from 'react';
import {escapeHTML} from '../utils/html';
import {ISODateStringToDate} from '../utils/date';
import listActions from '../actions/listActions';


var Form = React.createClass({

    render() {

        return ( 
            <form className="todo-form" onSubmit={this.handleSubmit} ref="form">
              <div className="field-block">
                <label htmlFor="desc">description:</label>
                <textarea className="todo-body" 
                          name="desc"
                          required="required"/>
              </div>
              <div className="field-block">
                <label htmlFor="till">dead-line:</label>
                <input className="todo-till-date" 
                       name="till" 
                       type="date" 
                       required="required"/>
                <button className="submit-button">Add</button>
              </div>
            </form>
        );

    },

    handleSubmit(e) {

        e.preventDefault();

        var form = this.refs.form.getDOMNode();

        if( form ) {
            var desc = escapeHTML(form.desc.value),
                from = new Date(),
                till = ISODateStringToDate(form.till.value);

            if( desc && from && till &&
                    !isNaN(from.getTime()) &&
                        !isNaN(till.getTime()) ) {
                listActions.addItem(from, till, desc);
                this.clearForm();
            }
        }
    },

    clearForm() {
        var form = this.refs.form.getDOMNode();
        if(form) {
            form.desc.value = '';
            form.till.value = '';
        }
    },

});


export default Form;
