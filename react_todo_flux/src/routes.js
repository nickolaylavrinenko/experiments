
import React from 'react';
import Router from 'react-router';
import {Page, NotFoundPage} from './components/page';
import List from './components/list';

var DefaultRoute = Router.DefaultRoute,
    Route = Router.Route,
    NotFoundRoute = Router.NotFoundRoute;


var routes = (
    <Route name='index' path='/' handler={Page}>
        <Route name='filter' path=':filter' handler={List}/>
        <DefaultRoute handler={List}/>
        <NotFoundRoute handler={NotFoundPage}/>
    </Route>
);


export default routes;

