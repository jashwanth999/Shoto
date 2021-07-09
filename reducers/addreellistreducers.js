const initailState = {
  reellist: [],
  
};
export const Addreellistreducer = (state = initailState, action) => {
  switch (action.type) {
    case 'ADD_REEL_NAME':
      return {...state, reellist: action.payload};
    case 'ADD_REEL_UPDATE':
      return {...state, reellist: [...state.reellist, action.payload]};
    case 'CLEAR_REEL_DATA':
      return {...state, reellist: []};
    default:
      return state;
  }
};
