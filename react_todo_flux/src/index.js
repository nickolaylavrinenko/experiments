(function(){

    // dependencies
    var $ = require('jquery'), 
        React = require('react'),
        Router = require('react-router'),
        routes = require('./routes');
   
    $(()=>{
        // init router
        Router.run(routes, function(Handler, state){
            var params = state.params;
            React.render(<Handler params={params}/>, document.body);
        });
        console.log('Application started');
    });

})();
