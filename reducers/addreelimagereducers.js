const initailState = {
  reellistimages: [],
  localimages: [],
};
export const Addreelimagereducer = (state = initailState, action) => {
  switch (action.type) {
    case 'ADD_REEL_IMAGES':
      return {reellistimages: action.payload};
    case 'UPDATE_LOCAL_IMAGES':
      return {
        ...state,
        localimages: [...state.localimages, action.payload],
        reellistimages: [...state.localimages, ...state.reellistimages],
      };
    default:
      return state;
  }
};
