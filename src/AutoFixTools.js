import React from "react";

//Import external components
import SupportSquare from "./SupportSquare.js";

//Import 3rd-party libraries 
import lifecycle from "react-pure-lifecycle";

//Import InstallFirefoxCertificate() function
import installCertificate from "./install-FFcertificate.js";

var pageTitle = "AutoFix Tools";

const componentDidMount = (props) => {
        props.updateTitle(pageTitle); 
        props.renderFooter(false);
};

const methods = {
        componentDidMount
};

const AutoFixTools = (props) => {
        //Passing props in React Router: https://github.com/ReactTraining/react-router/issues/4105
        //Could use a for-loop (that iterates through an object of containing key-value pairs of the props) to make a general component? An idea for next time.
        return( <div className="support-squares-container">
                        {/* {<Route path={this.props.match.url+"/wiFiMagic"} component={WiFiMagic} />} */}
                        <SupportSquare pageLink="/wiFiMagic" 
                                icon="fas fa-wifi" 
                                title="Wi-Fi Magic"
                                imgSrc="./img/icon-wifi.png" 
                                id="wiFi-magicButton" />

                        <SupportSquare pageLink="/ProjectorMagic" 
                                icon="fas fa-desktop" 
                                title="Projector Magic"
                                imgSrc="./img/icon-projector.png" />

                        <SupportSquare pageLink="#" 
                                icon="far fa-file-audio" 
                                title="Audio Magic"
                                imgSrc="./img/icon-audio.png"  />

                        <SupportSquare pageLink="#" 
                                icon="fas fa-print" 
                                title="Printer Magic"
                                imgSrc="./img/icon-printer.png"  />

                        <SupportSquare pageLink="#" 
                                icon="fab fa-firefox" 
                                title="Install Certificate"
                                imgSrc="./img/firefox-white.png"  
                                onClick={ installCertificate }  />
                </div>);
}

export default lifecycle(methods)(AutoFixTools);