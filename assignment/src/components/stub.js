
import './stub.styl';
import React from 'react';
import cx from 'classnames';


class Stub extends React.Component {

  render() {
  	const {className, children} = this.props;

    return (
    	<div className={cx(className, 'stub')}>
    		{children}
    	</div>
    );
  }

}


export default Stub;