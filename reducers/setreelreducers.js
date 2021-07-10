const initailState = {
  reeldata: {},
};
export const Setreelreducers = (state = initailState, action) => {
  switch (action.type) {
    case 'SET_REEL_DATA':
      return {reeldata: action.payload};
    case 'CLEAR_REEL_DATA':
      return {
        ...state,
        reeldata: [],
      };
    default:
      return state;
  }
};
