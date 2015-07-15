
'use strict'


import React from 'react';
import ReactArt from 'react-art';

import Circle from 'react-art/lib/Circle.art';
import Rectangle from 'react-art/lib/Rectangle.art';
import Wedge from 'react-art/lib/Wedge.art';

import FlexBox from './flexbox';

const {
  Surface,
  Group,
  Path,
  Shape,
  ClippingRectangle,
  Text
} = ReactArt;


const RING_ONE_PATH = "M84,121 C130.391921,121 168,106.673113 168,89 C168,71.3268871 130.391921,57 84,57 C37.6080787,57 0,71.3268871 0,89 C0,106.673113 37.6080787,121 84,121 Z M84,121";


export default class Test extends React.Component {

  displayName = 'Test'

  constructor(props) {
    super(props);
    this.rotateValue = 0;
    this.rotateDelta = 5;
    this.maxRotateValue = 360;
    this.scaleValue = 1.03;
    this.scaleCounter = 0;
    this.maxScaleCount = 72;
  }

  componentDidMount() {
    const block = this.refs.block;
    // this._setRotation(block);
    // this._setScaling(block);
  }

  render() {
    return (
        <Surface width={1500} height={900}>
          <FlexBox ref='block'
              x={450} y={300}
              width={500} height={300}
              fill={'#DCDCDC'} stroke={'#FFFFFF'}>
            <Rectangle width={200} height={100} fill='#F00'>
            </Rectangle>
            <Rectangle width={200} height={100} fill='#0F0'>
            </Rectangle>
          </FlexBox>
        </Surface>
    );
  }

              // <Circle
              //     radius={19}
              //     stroke='#000000'
              //     strokeWidth={2}
              //      x={20} y={20}>
              // </Circle>
              // <Text font='14px Arial' fill='#DCDCDC' x={0} y={0}>
              //   Hello
              // </Text>

  _setRotation(component) {
    this._rotateIntervalId = window.setInterval(() => {
      if( this.rotateValue >= this.maxRotateValue ) {
        component.rotateTo(this.maxRotateValue);
        window.clearInterval(this._rotateIntervalId);
      } else {
        component.rotateTo(this.rotateValue);
        this.rotateValue = this.rotateValue + this.rotateDelta;
      }
    }, 100);
  }

  _setScaling(component) {
    this._scaleIntervalId = window.setInterval(() => {
      if( this.scaleCounter > this.maxScaleCount ) {
        window.clearInterval(this._scaleIntervalId);
      } else {
        component.scale(this.scaleValue, this.scaleValue);
        this.scaleCounter = this.scaleCounter + 1;
      }
    }, 100);
  }

};
