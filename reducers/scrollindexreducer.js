const initailState = {
  y: 0,
};
export const scrolltoindex = (state = initailState, action) => {
  switch (action.type) {
    case "SET_INDEX":
      return { y: action.payload };
    default:
      return state;
  }
};
