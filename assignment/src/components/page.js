
import './page.styl';
import React from 'react';
import {Root} from 'baobab-react/wrappers';
import HCenteredBlock from './hCenteredBlock';
import Viewer from './viewer';
import tree from '../store';


class Page extends React.Component {

  render() {
    return (
      <div className='page'>
        <HCenteredBlock>
          <Root tree={tree}>
            <Viewer className='page__viewer'/>
          </Root>
        </HCenteredBlock>
      </div>
    );
  }

};


export default Page;
