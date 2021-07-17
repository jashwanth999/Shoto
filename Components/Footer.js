import React from 'react';
import HomeFooter from './FooterComponents/HomeFooter';
import ReelViewFooter from './FooterComponents/ReelViewFooter';
function Footer(props) {
  if (props.page === 'home') {
    return (
      <HomeFooter
        navigation={props.navigation}
        takePhoto={props.takePhoto}
        toggleOverlay={props.toggleOverlay}
      />
    );
  } else {
    return (
      <ReelViewFooter
        takePhoto={props.takePhoto}
        navigation={props.navigation}
      />
    );
  }
}
export default Footer;
