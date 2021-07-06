const initailState = {
  emails: [],
};
export const getreeluseremailreducer= (state = initailState, action) => {
  switch (action.type) {
    case "GET_REEL_USERS_EMAIL":
      return { emails: action.payload };
    case "ADD_USER_EMAIL":
      return { emails: [action.payload, ...state.emails] };
    default:
      return state;
  }
};
