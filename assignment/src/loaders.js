
import gifs from 'mocks/gifs';


export default {

  loadGifsList(tree) {
    // We can replace this and use ajax to get gifs from some backend
    tree.set('gifs', gifs);
  }

};
