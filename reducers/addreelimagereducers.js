const initailState = {
  reellistimages: [],
};
export const Addreelimagereducer = (state = initailState, action) => {
  switch (action.type) {
    case 'ADD_REEL_IMAGES':
      return {reellistimages: action.payload};
    case 'UPDATE_LOCAL_IMAGES':
      return {
        ...state,
        reellistimages: [action.payload, ...state.reellistimages],
      };
    default:
      return state;
  }
};
