
import React, {PropTypes} from 'react';
import Image from './image';
import {
  imagesFullSizeName as FULL_SIZE
} from '../common/constants';


class ActivePreview extends React.Component {

  static propTypes = {
    details: PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]).isRequired,
      [FULL_SIZE]: PropTypes.string.isRequired,
      title: PropTypes.string,
    })
  }

  render() {
    const {details} = this.props;
    if( details ) {
      const
        {id, [FULL_SIZE]: src, title} = details;

      return (
        <Image src={src} alt={title} isActive={true}/>
      );
    } else {
      return null;
    }
  }

}


export default ActivePreview;
