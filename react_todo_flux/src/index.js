(function(){

    // dependencies
    var $ = require('jquery'), 
        React = require('react'),
        Router = require('react-router'),
        Handler = Router.Handler,
        routes = require('./routes');
   
    $(()=>{
        // init router
        //Router.run(routes, Router.HistoryLocation, function(Handler, state){
        Router.run(routes, function(Handler, state){
            var params = state.params;
            React.render(<Handler params={params}/>, document.body);
        });
        console.log('Application started');
    });

})();
