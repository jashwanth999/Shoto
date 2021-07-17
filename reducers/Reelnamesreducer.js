const initialState = {
  Reelnames: [],
};
export const Reelnames = (state = initialState, action) => {
  switch (action.type) {
    case 'REEL_NAMES':
      return {...state, Reelnames: action.payload};
    default:
      return state;
  }
};
