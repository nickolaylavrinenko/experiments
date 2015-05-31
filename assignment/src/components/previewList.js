import './previewList.styl';
import React, {PropTypes} from 'react';
import cx from 'classnames';
import Image from './image';
import {
  imagesFullSizeName as FULL_SIZE,
  imagesThumbnailName as THUMBNAIL_SIZE
} from '../common/constants';


class PreviewList extends React.Component {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]).isRequired,
      [FULL_SIZE]: PropTypes.string.isRequired,
      [THUMBNAIL_SIZE]: PropTypes.string.isRequired,
      title: PropTypes.string
    }))
  }

  render() {
    const {className, items, ...props} = this.props;

    return (
      <div className={cx(className, 'previewList')} {...props}>
        <span className="previewList__title">Sortable Gifs</span>
        { items.map((item, idx) => {
            return (
              <div className='previewList__item' key={idx}>
                <Image src={item[THUMBNAIL_SIZE]} title={item['title']} />
              </div>
            );
          }) }
      </div>
    );
  }

  onClick() {
    //TODO
  }

}


export default PreviewList;
