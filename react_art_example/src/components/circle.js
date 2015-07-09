/**
 * Example usage:
 * <Circle
 *   radius={10}
 *   stroke="green"
 *   strokeWidth={3}
 *   fill="blue"
 * />
 *
 */

var React = require('react');
var ReactART = require('react-art');
var art = require('react-art/node_modules/art');

var Props = React.PropTypes;
var Shape = ReactART.Shape;
var Path = ReactART.Path;
// var Path = art.Path;

/**
 * Circle is a React component for drawing circles. Like other ReactART
 * components, it must be used in a <Surface>.
 */
var Circle = React.createClass({displayName: "Circle",

  propTypes: {
    radius: Props.number.isRequired
  },

  render: function() {
    var radius = this.props.radius;

    var path = (new Path()).moveTo(0, -radius)
        .arc(0, radius * 2, radius)
        .arc(0, radius * -2, radius)
        .close();

    return (
      <Shape
          d={path}
          {...this.props} />
    );
  }

});


module.exports = Circle;
