
var $ = require('jquery');
var _ = require('underscore');

require('select2/select2.css');
require('select2');


var TagsSelect = function(el, choices) {

	this.el = $(el);

	if( this.el.length ) {
		this.el.select2({
			width: 400,
      multiple: multiple,
      minimumInputLength: 2,
		});
	}

};

// TagsSelect.prototype.init = function() {

// };


module.exports = TagsSelect;