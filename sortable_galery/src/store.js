
import Baobab from 'baobab';
import update from 'react/lib/update';
import loaders from './loaders';
import {isNumber, isEmpty, ensureArray} from './utils/checks';


const activeItemFacet = {
  cursors: {
    items: ['items'],
    activeId: ['activeId']
  },
  get(state) {
    return ensureArray(state.items).find(item => item.id === state.activeId);
  }
};

// creating tree
const
  tree = new Baobab({}, {
    'facets': {
      'activeItem': activeItemFacet
    }
  }),
  value = tree.get();

// load tree if empty
if( isEmpty(value) ||
      !Object.keys(value).length ) {
  loaders.loadGifsList(tree);
}

// update tree object with modifiers
Object.assign(tree, {

  moveItem(id, afterId) {
    const
      items = this.get('items'),
      item = items.find(i => i.id === id),
      after = items.find(i => i.id === afterId),
      itemIndex = items.indexOf(item),
      afterIndex = items.indexOf(after);

    this.set('items', update(
      items,
      { $splice: [
          [itemIndex, 1],
          [afterIndex, 0, item]
        ] }
    ));
    this.commit();
  },

  setActiveId(id) {
    if( !isEmpty(id) ) {
      this.set('activeId', id);
      this.commit();
    }
  },

  setActiveNextId() {
    const
      items = ensureArray(this.get('items')),
      activeId = this.get('activeId'),
      active = items.find(item => item.id === activeId),
      activeIndex = items.indexOf(active);
    var
      nextIndex = 0;

    if( activeIndex >= 0 ) {
      nextIndex = (activeIndex + 1) % items.length;
    }
    if( isNumber(nextIndex) &&
          items[nextIndex] &&
            !isEmpty(items[nextIndex].id) ) {
      this.setActiveId(items[nextIndex].id);
    }
  }

});


export default tree;
