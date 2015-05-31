
import './previewList.styl';
import React, {PropTypes} from 'react';
import cx from 'classnames';
import {DragSource, DropTarget, DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import Image from './image';
import {isEmpty, ensureArray} from '../utils/checks';
import tree from '../store';
import {
  imagesThumbnailName as THUMBNAIL_SIZE,
  dndTypes as DND_TYPES,
  switchInterwal as SWITCH_INTERVAL
} from '../common/constants';


// DnD source contract
const source = {
  beginDrag(props) {
    return {
      id: props.id
    };
  }
};

const target = {
  hover(props, monitor) {
    const draggedId = monitor.getItem().id;

    if (draggedId !== props.id) {
      props.onMove(draggedId, props.id);
    }
  }
};


@DropTarget(DND_TYPES.IMAGE, target, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource(DND_TYPES.IMAGE, source, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class PreviewItem extends React.Component {

  static propTypes = {
    // Image props
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired,
    [THUMBNAIL_SIZE]: PropTypes.string.isRequired,
    title: PropTypes.string,
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
    onMove: PropTypes.func,
    // DnD props:
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  }

  render() {
    const
      {id, [THUMBNAIL_SIZE]: thumbnail, title, isActive, onClick,
       connectDragSource, connectDropTarget, isDragging} = this.props,
      classNames = cx({
        'previewItem': true,
        'previewItem--active': !!isActive,
        'previewItem--dragging': !!isDragging,
      });

    return connectDragSource(connectDropTarget(
      <div key={id}
           className={classNames}
           style={{opacity: (isDragging ? 0.5 : 1)}} >
        <Image
            src={thumbnail}
            title={title}
            isActive={isActive}
            onClick={onClick}/>
      </div>
    ));
  }

}


@DragDropContext(HTML5Backend)
class PreviewList extends React.Component {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    activeId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ])
  }

  componentDidMount() {
    this.__startSwitching();
  }

  componentWillUnmount() {
    this.__stopSwitching();
  }

  render() {
    var {className, items, activeId, ...props} = this.props;

    // check values
    items = ensureArray(items);
    if( isEmpty(activeId) &&
          items.length &&
            !isEmpty(items[0].id) ) {
      activeId = items[0].id;
    }

    return (
      <div className={cx(className, 'previewList')} {...props}>
        <span className="previewList__title">Sortable Gifs</span>
        { items.map((item) => {
            return (
              <PreviewItem
                  key={item.id}
                  isActive={!isEmpty(activeId) && activeId === item.id}
                  onClick={this.__onClick.bind(this, item.id)}
                  onMove={this.__move}
                  {...item} />
            );
          }) }
      </div>
    );
  }

  __onClick(id, e) {
    if( e && e.preventDefault ) {
      e.preventDefault();
    }
    // reset interval for proper timing
    this.__stopSwitching();
    tree.setActiveId(id);
    this.__startSwitching();
  }

  __startSwitching() {
    if( isEmpty(this.__intervalId) ) {
      this.__intervalId = window.setInterval(this.__switchToNextImage, SWITCH_INTERVAL);
    }
  }

  __stopSwitching() {
    if( !isEmpty(this.__intervalId) ) {
      window.clearInterval(this.__intervalId);
      delete this.__intervalId;
    }
  }

  __switchToNextImage() {
    tree.setActiveNextId();
  }

  __move(id, afterId) {
    tree.moveItem(id, afterId);
  }

}


export default PreviewList;
