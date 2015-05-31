
import './page.styl';
import React from 'react';
import HCenteredBlock from './hCenteredBlock';
import Viewer from './viewer';


class Page extends React.Component {

  render() {
    return (
      <div className='page'>
        <HCenteredBlock>
          <Viewer className='page__viewer'/>
        </HCenteredBlock>
      </div>
    );
  }

};


export default Page;
