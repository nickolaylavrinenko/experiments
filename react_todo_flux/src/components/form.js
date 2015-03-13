// styles
import './form.less';

// dependensies
import $ from 'jquery';
import React from 'react';
import {escapeHTML} from '../utils/html';
import {ISODateStringToDate} from '../utils/date';
import listActions from '../actions/listActions';


var Form = React.createClass({

    render() {

        return ( 
            <form className="todoForm" onSubmit={this._handleFormSubmit} ref="form">
              <div className="todoForm_fieldBlock">
                <label htmlFor="desc">description:</label>
                <textarea className="todoForm_body" 
                          name="desc"
                          required="required"/>
              </div>
              <div className="todoForm_fieldBlock">
                <label htmlFor="till">dead-line:</label>
                <input className="todoForm_tillDate" 
                       name="till" 
                       type="date" 
                       required="required"/>
                <button
                    className="todoForm_submitButton"
                    onMouseDown={this._handleMouseDown}
                    onMouseUp={this._handleMouseUp}>
                    Add
                </button>
              </div>
            </form>
        );

    },

    _handleMouseDown(e) {

        e.preventDefault()

        const $form = $(this.refs.form.getDOMNode());
        
        if(!$form.hasClass('pressed')) {
            $form.addClass('pressed');
        }
    },

    _handleMouseUp(e) {

        e.preventDefault()

        const $form = $(this.refs.form.getDOMNode());
        
        if($form.hasClass('pressed')) {
            $form.removeClass('pressed');
        }
    },

    _handleFormSubmit(e) {

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
