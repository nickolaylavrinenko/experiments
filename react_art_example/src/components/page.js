
import './page.styl';
import React from 'react';
import Test from './test';


export default class Page extends React.Component {

  displayName = 'Page'

  render() {
    return (
      <div className='page'>
        <Test />
      </div>
    );
  }

};
