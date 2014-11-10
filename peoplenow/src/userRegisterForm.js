
require('./styles/style.css');

var $ = require('jquery');
var _ = require('underscore');
var errors = require('./errors');


var UserRegisterForm = function(el){
	this.form = $(el);
	this.initForm();
};

UserRegisterForm.prototype.initForm = function() {
	var that = this;
	if( this.form ) {
		this.form.find('.submit-button')
					   .on('click', function(ev){
					   	 ev.preventDefault();
						 	 that._handle_submit(ev);
						 });
	}
};

UserRegisterForm.prototype._handle_submit = function(ev) {
	var name = this.form[0].name.value;
	var password = this.form[0].password.value;
	var email = this.form[0].email.value;
	var tags = [];
	_(this.form[0].tags.options).each(function(option){
		option && option.selected && tags.push(option.value.toLowerCase());
	});
	if( name && password && tags) {
		this.registerUser(name, password, email, tags);
	}
	
};

UserRegisterForm.prototype.registerUser = function(name, password, email, tags) {
	if( tags && !_(tags).isArray() ){
		tags = [tags];
	}	
	if ( name && password && email 
				&& _(tags).isArray && tags.length ) {
		console.log('Register user ', name, tags);
		user = new Backendless.User();
		user.name = name;
		user.password = password;
		user.email = email;
		user.tags = tags.join(",");
		response = Backendless.UserService.register(user, errors.handler);
	}
};


module.exports = {
	'user-register-form': UserRegisterForm,
};