const initailState = {
  comments: [],
};
export const Addcommmentreducer = (state = initailState, action) => {
  switch (action.type) {
    case 'ADD_COMMENT':
      return {...state, comments: action.payload};

    default:
      return state;
  }
};
