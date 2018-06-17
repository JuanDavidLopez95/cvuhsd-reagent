import React, { Component } from "react";

//Import required external components
import SupportSquare from "./SupportSquare.js";

class HelpDesk extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div class="support-squares-container">
            <SupportSquare pageLink="tel:+13102633200p7398" 
                        icon="fas fa-phone-square" 
                        title="Helpdesk Hotline"
                        id="helpdeskHotline-supportSquare"
                        imgSrc="./img/icon-building2.png" />

            <SupportSquare pageLink="tel:+13102633100" 
                        icon="fas fa-building" 
                        title="Lawndale" 
                        imgSrc="./img/icon-building2.png" />

            <SupportSquare pageLink="tel:+13102632346" 
                        icon="fas fa-building" 
                        title="Leuzinger" 
                        imgSrc="./img/icon-building2.png" />

            <SupportSquare pageLink="tel:+13102633286" 
                        icon="fas fa-building" 
                        title="Hawthorne" 
                        imgSrc="./img/icon-building2.png" />

            <SupportSquare pageLink="tel:+13102633286" 
                icon="fas fa-building" 
                title="Lloyde" 
                imgSrc="./img/icon-building2.png" />      

            </div>
        );
    }
}

export default HelpDesk;