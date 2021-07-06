const initailState = {
  user: null,
};
export const Currentuserreducer = (state = initailState, action) => {
  switch (action.type) {
    case "SET_USER":
      return { user: action.payload };
    case "CLEAR_DATA":
      return { ...state, user: null };
    default:
      return state;
  }
};
