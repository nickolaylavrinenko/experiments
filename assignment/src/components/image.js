
import './image.styl';
import React, {PropTypes} from 'react';
import cx from 'classnames';


class Image extends React.Component {

  static propTypes = {
    src: PropTypes.string.isRequired,
    title: PropTypes.string,
    isActive: PropTypes.bool,
    onClick: PropTypes.func
  }

  static defaultProps = {
    isActive: false
  }

  render() {
    const
      {src, title, isActive, onClick, className, ...props} = this.props;

    return (
      <div className={cx(className, 'image')} onClick={onClick}>
        <img className='image__image'
            src={src}
            alt={title}
            {...props}/>
        { !isActive &&
            <div className='image__overlay'/> }
      </div>
    );
  }

}


export default Image;
