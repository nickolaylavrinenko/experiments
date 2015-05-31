
import './viewer.styl';
import React from 'react';
import {Branch} from 'baobab-react/wrappers';
import cx from 'classnames';
import ActivePreview from './activePreview';
import PreviewList from './previewList';
import Image from './image';


class Viewer extends React.Component {

  render() {
    const {className} = this.props;

    return (
      <div className={cx(className, 'viewer')}>

        <div className='viewer__full'>
          <Branch
                facets={{
                  details: 'activeItem'
                }}>
            <ActivePreview/>
          </Branch>
        </div>

        <div className='viewer__previews'>
          <Branch
                cursors={{
                  items: ['items'],
                  activeId: ['activeId']
                }}>
            <PreviewList/>
          </Branch>
        </div>

      </div>
    );
  }

}


export default Viewer;
