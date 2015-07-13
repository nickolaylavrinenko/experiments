
import './page.styl';
import React from 'react';
import Composition from './composition/root';
import {isNumber} from './utils/checks';
import {colors, defaultStageOptions} from './common/constants';


export default class Page extends React.Component {

  displayName = 'Page'

  componentDidMount() {
    new Composition(React.findDOMNode(this.refs.canvas1));
    new Composition(React.findDOMNode(this.refs.canvas2));
    const context3 = React.findDOMNode(this.refs.canvas3).getContext('2d');
    context3.fillRect(50, 50, 50, 50);
    const context4 = React.findDOMNode(this.refs.canvas4).getContext('2d');
    context4.fillRect(50, 50, 50, 50);
  }

  render() {
    return (
      <div className='page'>
        <div draggable="true" id='canvas1'>
        	<canvas ref='canvas1'
              width={defaultStageOptions.width} height={defaultStageOptions.height}
              style={{
                backgroundColor: colors.lightGrey
              }} />
        </div>
        <div draggable="true" id='canvas2'>
          <canvas ref='canvas2'
              width={defaultStageOptions.width} height={defaultStageOptions.height}
              style={{
                backgroundColor: colors.lightGrey
              }} />
        </div>
        <div draggable="true" id='canvas3'>
          <canvas ref='canvas3'
              width={defaultStageOptions.width} height={defaultStageOptions.height}
              style={{
                backgroundColor: colors.lightGrey
              }} />
        </div>
        <div draggable="true" id='canvas4'>
          <canvas ref='canvas4'
              width={defaultStageOptions.width} height={defaultStageOptions.height}
              style={{
                backgroundColor: colors.lightGrey
              }} />
        </div>
      </div>
    );
  }

};
