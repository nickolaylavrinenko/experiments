import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './Header';
import SignIn from './SignIn';
import CreateLink from './CreateLink';
import LinkList from './LinkList';
// import Search from './Search';
import '../styles/App.css';

class App extends Component {
  static displayName = 'App'

  render() {
    return (
      <div className='center w85'>
        <Header />
        <div className='ph3 pv1 background-gray'>
        <Switch>
          <Route exact path='/' render={() => <Redirect to='/new' />} />
          <Route exact path='/new' component={LinkList} />
          { /*<Route exact path='/top' component={LinkList} />*/ }
          { /*<Route exact path='/search' component={Search} />*/ }
          {  <Route exact path='/create' component={CreateLink} />  }
          { <Route exact path='/login' component={SignIn} /> }
        </Switch>
      </div>
      </div>
    );
  }
}

export default App;
