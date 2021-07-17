const initialState = {
  reellistimages: [],
};
export const Addreelimagereducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_REEL_IMAGES':
      return {...state, reellistimages: action.payload};
    case 'UPDATE_LOCAL_IMAGES':
      return {
        ...state,
        reellistimages: [action.payload, ...state.reellistimages],
      };
    default:
      return state;
  }
};
