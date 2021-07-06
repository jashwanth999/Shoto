const initailState = {
  reeldata: {},
};
export const Setreelreducers = (state = initailState, action) => {
  switch (action.type) {
    case "SET_REEL_DATA":
      return { reeldata: action.payload };
    default:
      return state;
  }
};
