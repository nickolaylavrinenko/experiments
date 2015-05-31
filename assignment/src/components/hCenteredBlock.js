import './hCenteredBlock.styl';
import React from 'react';
import cx from 'classnames';


class HCenteredBlock extends React.Component {

  render() {
    const {className, children, ...props} = this.props;

    return (
      <div className={cx("hCenteredBlock", className)} {...props} >
        <div className="hCenteredBlock__inner">
          {children}
        </div>
      </div>
    );
  }

}


export default HCenteredBlock;
