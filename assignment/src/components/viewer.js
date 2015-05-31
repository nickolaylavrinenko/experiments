
import './viewer.styl';
import React from 'react';
import cx from 'classnames';
import Stub from './stub';
import PreviewList from './previewList';
import Image from './image';
import gifs from 'mocks/gifs.json';


class Viewer extends React.Component {

  render() {
    const {className} = this.props;

    return (
      <div className={cx(className, 'viewer')}>

        <div className='viewer__full'>
          <Image src={gifs[0]['640x360']} title={gifs[0]['title']} />
        </div>

        <div className='viewer__previews'>
          <PreviewList items={gifs}/>
        </div>

      </div>
    );
  }

}


export default Viewer;