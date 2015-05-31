
import './image.styl';
import React, {PropTypes} from 'react';
import cx from 'classnames';


class Image extends React.Component {

  static propTypes = {
    src: PropTypes.string.isRequired,
    title: PropTypes.string,
    active: PropTypes.bool
  }

  static defaultProps = {
    active: true
  }

  render() {
    const
      {src, title, active, className, ...props} = this.props;

    return (
      <div className={cx(className, 'image')}>
        <img className='image__image'
            src={src}
            alt={title}
            {...props}/>
        { !active &&
            <div className='image__overlay'/> }
      </div>
    );
  }

}


export default Image;
