const initialState = {
  reeldata: {},
};
export const Setreelreducers = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_REEL_DATA':
      return {...state, reeldata: action.payload};
    case 'CLEAR_REEL_DATA':
      return {
        ...state,
        reeldata: {},
      };
    default:
      return state;
  }
};
