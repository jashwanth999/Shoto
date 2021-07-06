const initailState = {
  changed: false,
};
export const Changetrigger = (state = initailState, action) => {
  switch (action.type) {
    case "CHANGE":
      return { changed: action.payload };
    default:
      return state;
  }
};
