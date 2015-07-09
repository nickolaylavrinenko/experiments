
import './page.styl';
import React from 'react';
import Composition from './composition/root';
import {isNumber} from './utils/checks';
import {colors, defaultStageOptions} from './common/constants';


export default class Page extends React.Component {

  displayName = 'Page'

  componentDidMount() {
    this.composition = new Composition(React.findDOMNode(this.refs.canvas));
  }

  render() {
    return (
      <div className='page'>
      	<canvas ref='canvas'
            width={defaultStageOptions.width} height={defaultStageOptions.height}
            style={{
              backgroundColor: colors.lightGrey
            }} />
      </div>
    );
  }

};
