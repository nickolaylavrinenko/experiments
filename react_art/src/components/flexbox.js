
import React from 'react';
import ReactArt from 'react-art';
import cssLayout from 'css-layout';
import {ensureArray, isNumber} from '../utils/checks';
import {applyWhiteList, applyBlackList} from '../utils/object';

import Rectangle from 'react-art/lib/Rectangle.art';

const 
  {Group, ClippingRectangle} = ReactArt,
  PropTypes = React.PropTypes,
  stylePropsNames = [
    'fill',
    'stroke',
    'strokeWidth',
    'strokeCap',
    'strokeJoin',
    'strokeDash'
  ],
  layoutPropsNames = [
    'x', 'y',
    'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
    'left', 'right', 'top', 'bottom',
    'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom',
    'padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
    'borderWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth',
    'position',
    'flexDirection',
    'justifyContent',
    'alignItems',
    'alignSelf',
    'flexWrap',
    'flex'
  ];


export default class FlexBox extends React.Component {

  static propTypes = {
    // style
    fill: PropTypes.string,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    strokeCap: PropTypes.any,
    strokeJoin: PropTypes.any,
    strokeDash: PropTypes.any,
    x: PropTypes.number,
    y: PropTypes.number,

    //  TODO:
    //  1. Think about method of propagating rest part of props, like minWidth, maxWidth etc...
    //  2. Continue with clipping flexbox experiments

    // layout
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    flexDirection: PropTypes.oneOf(['column', 'row']),
    justifyContent: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'space-between', 'space-around']),
    alignItems: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'stretch']),
    alignSelf: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'stretch']),
    flexWrap: PropTypes.oneOf(['wrap', 'nowrap']),
    flex: PropTypes.number
  }

  static defaultProps = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
    flex: 1,
    strokeWidth: 1
  }
    
  render() {
    const
      allProps = this.props,
      [styleProps, layoutWithRest] = applyWhiteList(allProps, stylePropsNames),
      [layoutProps ,childrenWithRest] = applyWhiteList(layoutWithRest, layoutPropsNames),
      {children, ...restProps} = childrenWithRest,
      calculatedLayout = this._calculateLayout(),
      [outerBoxLayout,] = applyBlackList(calculatedLayout, ['x', 'y', 'children']);

    const
      childrenItems = ensureArray(children)
        .map((child, idx) => {
          const childLayout = calculatedLayout.children[idx] || {};
          return React.cloneElement(child, Object.assign({}, child.props, childLayout, {key: child.props.key || idx}));
        })
        .filter((item) => item && item);

    return (
      <Group x={calculatedLayout.x} y={calculatedLayout.y} >
        { (styleProps.fill || styleProps.stroke) &&
              <Rectangle {...Object.assign({}, outerBoxLayout, styleProps)} /> }
        <ClippingRectangle
              {...Object.assign({}, outerBoxLayout, restProps)} >
          { childrenItems }
        </ClippingRectangle>
      </Group>
    );
  }

  _calculateLayout() {
    return this._transformBack(cssLayout(this._transformToCSS(this._makeParamsTree())));
  }

  _makeParamsTree(component) {
    component = component || this;

    const
      [layoutProps,] = applyWhiteList(component.props, layoutPropsNames),
      children = ensureArray(component.props.children),
      paramsTree = {
        style: layoutProps || {},
        children: []
      };

    // for root component only
    if (component === this) {
      paramsTree.children = children.map((child) => {
        return this._makeParamsTree(child);
      });
    }

    return paramsTree;
  }

  /**
   * transform incoming object's fields names to CSS-like names
   * !!! mutate incoming object
   * @param  {[type]} props [description]
   * @return {[type]}       [description]
   */
  _transformToCSS(props) {
    props = props || {};

    // handle current level
    if (props.style) {
      this._transformToCSS(props.style);
    } else {

      // change x/y to left/top
      if (isNumber(props.x)) {
        props.left = props.x;
        delete props.x;
      }
      if (isNumber(props.y)) {
        props.top = props.y;
        delete props.y;
      }

    }

    // dive deeper into next level - children
    if (props.children) {
      ensureArray(props.children).map(this._transformToCSS.bind(this));
    }

    // return mutated object
    return props;
  }

  /**
   * transform back, see previous method description
   * !!! mutate incoming object
   * @param  {[type]} props [description]
   * @return {[type]}       [description]
   */
  _transformBack(props) {
    props = props || {};

    // handle current level

    // change x/y to left/top
    if (isNumber(props.left)) {
      props.x = props.left;
      delete props.left;
    }
    if (isNumber(props.top)) {
      props.y = props.top;
      delete props.top;
    }

    // dive deeper into next level - children
    if (props.children) {
      ensureArray(props.children).map(this._transformBack);
    }

    // return mutated object
    return props;
  }

}
