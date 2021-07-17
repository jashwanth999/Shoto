const initialState = {
  y: 0,
};
export const scrolltoindex = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_INDEX':
      return {...state, y: action.payload};
    default:
      return state;
  }
};
