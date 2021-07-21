import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Addreellistreducer} from './reducers/addreellistreducers';
import {Addcommmentreducer} from './reducers/addcommentreducer';
import {Currentuserreducer} from './reducers/currentuserreducer';
import {Addreelimagereducer} from './reducers/addreelimagereducers';
import {Setreelreducers} from './reducers/setreelreducers';
import {scrolltoindex} from './reducers/scrollindexreducer';
import {getreeluseremailreducer} from './reducers/getreeluseremail';
import {Reelnames} from './reducers/Reelnamesreducer';
import {Changetrigger} from './reducers/Changetrigger';
import {AlluserPhotosReducers} from './reducers/allUserPhotosReducer';

const combined = combineReducers({
  reels: Addreellistreducer,
  Comments: Addcommmentreducer,
  user: Currentuserreducer,
  reellistimages: Addreelimagereducer,
  reeldata: Setreelreducers,
  y: scrolltoindex,
  emails: getreeluseremailreducer,
  reelnames: Reelnames,
  changed: Changetrigger,
  userPhotos: AlluserPhotosReducers,
});
export const store = createStore(combined);
