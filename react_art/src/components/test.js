
'use strict'


import React from 'react';
import ReactArt from 'react-art';
import Circle from './circle';


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
    this.setRotation(block);
    this.setScaling(block);
  }

  setRotation(component) {
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

  setScaling(component) {
    this._scaleIntervalId = window.setInterval(() => {
      if( this.scaleCounter > this.maxScaleCount ) {
        window.clearInterval(this._scaleIntervalId);
      } else {
        component.scale(this.scaleValue, this.scaleValue);
        this.scaleCounter = this.scaleCounter + 1;
      }
    }, 100);
  }

  render() {
    return (
        <Surface width={1500} height={900}>
          <Group x={750} y={450} ref='block'>
            <Circle
                radius={20}
                stroke='#000000'
                strokeWidth={2}
                 x={20} y={20}>
            </Circle>
            <Text font='14px Arial' fill='#DCDCDC' x={0} y={0}>
              Hello
            </Text>
          </Group>
        </Surface>
    );
  }

          // Clipping rectangle doesn't work

          // <ClippingRectangle x={750} y={450} ref='block'>
          //   <Circle
          //       radius={20}
          //       stroke='green'
          //       strokeWidth={2}
          //        x={20} y={20}>
          //   </Circle>
          //   <Text font='14px Arial' fill='navy' x={0} y={0}>
          //     Hello
          //   </Text>
          // </ClippingRectangle>

};
