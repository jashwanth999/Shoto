const initialState = {
  userPhotos: [],
};
export const AlluserPhotosReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_PHOTOS':
      return {...state, userPhotos: action.payload};
    default:
      return state;
  }
};
