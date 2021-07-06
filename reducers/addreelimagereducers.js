const initailState = {
  reellistimages: [],
};
export const Addreelimagereducer = (state = initailState, action) => {
  switch (action.type) {
    case 'ADD_REEL_IMAGES':
      return {reellistimages: action.payload};
    case 'UPDATE_REEL_IMAGES':
      return {
        reellistimages: [...state.reellistimages, ...action.payload],
      };
    default:
      return state;
  }
};
