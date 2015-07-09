
import 'babel/polyfill';
import React from 'react';
import Page from './components/page';

window.onload = (()=>{
  React.render(<Page/>, document.body);
});
