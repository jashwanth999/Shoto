export const AddComments = Commentdata => {
  return {
    type: 'ADD_COMMENT',
    payload: Commentdata,
  };
};
export const Addcontributorsaction = Addcotributorslist => {
  return {
    type: 'ADD_CONTRIBUTORS',
    payload: Addcotributorslist,
  };
};
export const Adduser = userdata => {
  return {
    type: 'SET_USER',
    payload: userdata,
  };
};
export const Addreelimages = Reelistimages => {
  return {
    type: 'ADD_REEL_IMAGES',
    payload: Reelistimages,
  };
};
export const Addreel = reeldata => {
  return {
    type: 'ADD_REEL_NAME',
    payload: reeldata,
  };
};
export const Addreelupdate = reeldata => {
  return {
    type: 'ADD_REEL_UPDATE',
    payload: reeldata,
  };
};
export const Addreeldata = reel => {
  return {
    type: 'SET_REEL_DATA',
    payload: reel,
  };
};
export const scrollto = cord => {
  return {
    type: 'SCROLL_TO',
    payload: cord,
  };
};
export const setindex = y => {
  return {
    type: 'SET_INDEX',
    payload: y,
  };
};
export const reeluseremail = useremail => {
  return {
    type: 'GET_REEL_USERS_EMAIL',
    payload: useremail,
  };
};
export const addreeluseremail = useremail => {
  return {
    type: 'ADD_USER_MAIL',
    payload: useremail,
  };
};
export const clearData = () => {
  return {
    type: 'CLEAR_DATA',
    payload: null,
  };
};
export const clearReelData = () => {
  return {
    type: 'CLEAR_REEL_DATA',
  };
};
export const addImage = imageData => {
  return {
    type: 'ADD_IMAGE',
    payload: imageData,
  };
};
export const updateComments = commentData => {
  return {
    type: 'UPDATE_COMMENT',
    payload: commentData,
  };
};

export const reelNameAction = reelnames => {
  return {
    type: 'REEL_NAMES',
    payload: reelnames,
  };
};
export const reelNameUpdate = reelnames => {
  return {
    type: 'UPDATE_REELNAMES',
    payload: reelnames,
  };
};
export const setChange = change => {
  return {
    type: 'CHANGE',
    payload: change,
  };
};



