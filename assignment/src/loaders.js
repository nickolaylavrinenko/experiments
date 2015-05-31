
import tree from './store';
import {ensureArray, isEmpty} from './utils/checks';
import data from 'mocks/gifs.json';


export default {

  loadGifsList(tree) {

    // We can replace this and use ajax instead to get images from some backend
    const items = ensureArray(data);

    tree.set('items', items);
    if( items.length &&
          !isEmpty(items[0].id) ) {
      tree.set('activeId', items[0].id);
    }
    tree.commit();
  }

};
