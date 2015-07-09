
import {colors, defaultStageOptions} from '../common/constants';
import {isNumber} from '../utils/checks';
const {
  Stage,
  Text,
  Container,
  Graphics,
  Shape
} = createjs;


export default class Root extends Object {

  constructor(canvas, options) {
    super();
    options = options || {};
    this.stage = window.stage = new Stage(canvas);
    this._init(options);
    this._renderChildren();
  }

  _init(options) {
    this.stage.setBounds(
      options.x || defaultStageOptions.x,
      options.y || defaultStageOptions.y,
      options.width || defaultStageOptions.width,
      options.height || defaultStageOptions.height
    );
    this._updateStage;
  }

  _renderChildren() {
    const
      container = window.container = new Container(),
      text1 = window.text1 = new Text("Hello", "20px Arial", colors.red),
      text2 = window.text2 = new Text("World", "20px Arial", colors.red);

    container.x = container.y = 50;
    text1.x = text1.y = 50;
    text2.x = text2.y = 100;

    // if( isNumber(containerWidth) ) {
    //   text1.lineWidth = containerWidth;
    //   text2.lineWidth = containerWidth;
    // }

    
    container.addChild(text1);
    container.addChild(text2);
    this.stage.addChild(container);
    this._updateStage();

    const
      containerBounds = container.getTransformedBounds();
      rectangle = window.rectangle = new Shape(),

    console.log('>>>', containerBounds);

    rectangle
      .graphics
        .beginStroke("black")
        .drawRect(0, 0, containerBounds.width, containerBounds.height)
        .endStroke();

    container.addChild(rectangle);
    stage.update();

    // const
    //   containerBounds = container.getTransformedBounds(),
    //   rectangle = new Shape().graphics
    //     .beginStroke("black")
    //     .drawRect(0, 0, containerBounds.width, containerBounds.height);

    // container.addChild(rectangle);
    // stage.update();
  }

  _updateStage() {
    this.stage.update();
  }

};
