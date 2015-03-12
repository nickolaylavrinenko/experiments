
import Router from 'react-router';
import {Page, NotFoundPage} from './app';
import List from './list';

var DefaultRoute = Router.DefaultRoute,
    Route = Router.Route,
    NotFoundRoute = Router.NotFoundRoute;


var routes = (
    <Route name='index' path='/' handler={Page}>
        <Route name='filter' path=':filter' handler={List}/>
        <DefaultRoute handler={List}/>
    </Route>
    <NotFoundRoute handler={NotFoundPage}/>
);


export routes;

