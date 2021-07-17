const initialState = {
  user: null,
};
export const Currentuserreducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {...state, user: action.payload};
    case 'CLEAR_DATA':
      return {...state, user: null};
    default:
      return state;
  }
};
