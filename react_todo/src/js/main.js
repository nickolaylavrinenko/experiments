(function(){

    // dependencies
    var $ = require("jquery"),
        React = require("react"),
        Common = require("./common"),
        App = require("./components/app");
   
    // app init on dom ready 
    $(function(){
   
        var storage = new Common.Storage(); 
        window.storage = storage;
        var mount_point = $('body').first().get();
        var app_component = App({'storage': storage});
        window.app = app_component;
        React.renderComponent(app_component, mount_point[0]);
    
    });

})();
