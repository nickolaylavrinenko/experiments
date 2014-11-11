
var $ = require('jquery');
var _ = require('underscore');

require('select2/select2.css');
require('select2');


var TagsSelect = function(el, options) {

	this.el = $(el);
	options = options || {};
	data = options.data || [];
	// init control
	if( this.el.length ) {
		this.el.select2({
      multiple: true,
      data: data,
      //minimumInputLength: 2,
		});
	}
  // mark selected values
	if( 'values' in options ) {
		this.chooseValues(options['values']);
	}

};

TagsSelect.prototype.initWithData = function(data) {

	if( data && this.el.length ) {
		this.el.select2('data', data);
	}

};

TagsSelect.prototype.chooseValues = function(values) {

	if( values && this.el.length ) {
		if( !_.isArray(values) ) {
			values = [values,];
		}
		this.el.select2('val', values);
	}

};


module.exports = TagsSelect;