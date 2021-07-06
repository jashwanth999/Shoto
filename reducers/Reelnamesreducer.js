const initailState = {
  Reelnames: [],
};
export const Reelnames = (state = initailState, action) => {
  switch (action.type) {
    case "REEL_NAMES":
      return { Reelnames: action.payload };
    default:
      return state;
  }
};
