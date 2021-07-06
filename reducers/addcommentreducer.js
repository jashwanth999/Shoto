const initailState = {
  comments: [],
};
export const Addcommmentreducer = (state = initailState, action) => {
  switch (action.type) {
    case "ADD_COMMENT":
      return { comments: (state.comments = action.payload) };
    case "UPDATE_COMMENT":
      return {
        comments: (state.comments = [action.payload, ...state.comments]),
      };
    default:
      return state;
  }
};
