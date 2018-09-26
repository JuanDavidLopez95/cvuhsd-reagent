import React, { Component } from "react";

//Import utilities
import { stringIsEmptyOrBlank, requireNodeJSmodule, popNotification} from "./utilityFunctions.js";
import { corsAnywhere } from "./server.js"

//const fetch = requireNodeJSmodule("electron-fetch");
//import fetch from 'electron-fetch';
class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: this.getUsername(),
            ipAddress: this.getIPAddress(),
            randomFact: ""
        };
    } //end constructor()
    
    getUsername = () => {
        const electron = window.require("electron");
        const remote = electron.remote;
        const completeUserName = remote.require("fullname");

      completeUserName().then(name => {
          console.log("completeIserName():\t" + name);
          if ( !stringIsEmptyOrBlank(name)) {
                console.log("Username:\t" + name);
                console.log("Username type:\t" + typeof(name) );
                console.log("Username length:\t" + name.length);
                this.setState({
                    userName: name
                });
            } //end if-statement 
            else {
                const os = remote.require("os");
                console.log("Complete username is empty!");
                this.setState({
                    userName: os.userInfo().username
                });
            } //end else-statement
        });  //end completeUserName() 
    } //end completeUserName()

    getIPAddress = () => {
        console.log("Process env:\t" + JSON.stringify(process.env));
        const electron = window.require("electron");
        const remote = electron.remote;

        const macaddress = remote.require("macaddress");
        const undefsafe = remote.require("undefsafe");

        let IP_Address; 

        if ( undefsafe(macaddress.networkInterfaces(), "Ethernet.ipv4") !== undefined ) {
            //  IP_Address = macaddress.networkInterfaces()["Local Area Connection"]["ipv4"];
            IP_Address = undefsafe(macaddress.networkInterfaces(), "Ethernet.ipv4");
         //   console.log("IPV4 ethernet:\t" + IP_Address);
           // console.log("IPV4 ethernet Typeof:\t"+ typeof IP_Address);
        }

        else if ( undefsafe(macaddress.networkInterfaces(), "VirtualBox Host-Only Network.ipv4") !== undefined ) {
            //  IP_Address = macaddress.networkInterfaces()["Local Area Connection"]["ipv4"];
            IP_Address = undefsafe(macaddress.networkInterfaces(), "VirtualBox Host-Only Network.ipv4");
            //console.log("Virtual Box host only network:\t" + IP_Address);
           // console.log("Virtual Box host only network Typeof:\t"+ typeof IP_Address);
        }

        else if ( undefsafe(macaddress.networkInterfaces(), "Local Area Connection.ipv4") !== undefined ) {
          //  IP_Address = macaddress.networkInterfaces()["Local Area Connection"]["ipv4"];
          IP_Address = undefsafe(macaddress.networkInterfaces(), "Local Area Connection.ipv4");
        //  console.log("IPV4 local area connection:\t" + IP_Address);
         // console.log("IPV4  local area connection Typeof:\t"+ typeof IP_Address);
        }

        else if ( undefsafe(macaddress, "Wi-Fi.ipv4") !== undefined) {
            IP_Address =  undefsafe(macaddress, "Wi-Fi.ipv4"); 
           // console.log("IPV4 wifi:\t" + IP_Address);
            //console.log("IPV4 wifTypeof:\t"+ typeof IP_Address);
        }
        
        else {
            IP_Address = (navigator.onLine) ? "Cannot get IP" : "Internet down";
        } 
        //console.log("Returning IP address:\t" + IP_Address);
        return IP_Address;
    }


    randomFactFetch = () => {
        let isDev = requireNodeJSmodule("electron-is-dev");
        
        if (isDev) {
            corsAnywhere();
        }
        
        //Other interesting API:
        //http://numbersapi.com/random/year?json
        const jsonFetch = () => {

            let API_URL = "https://catfact.ninja/fact";
            let localHost_URL = "http://localhost:4000/";

            let headers = {
                headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
             };

            let fetchURL = isDev ? (localHost_URL + API_URL) : API_URL;
             
            window.fetch(fetchURL, headers)
                .then( (response) => {
                    return response.json();
                })
                .then( (myJson) => {
                    console.log(JSON.stringify(myJson));
                    let randomFact = myJson.fact;
                    console.log("randomFact:\t" + randomFact);
                    this.setState({
                        randomFact: randomFact
                    });
                    
                    //Constant cat fact notifications for the giggles
                    popNotification("Random Fact:", randomFact, "https://image.shutterstock.com/image-illustration/question-mark-thin-line-icon-260nw-762116929.jpg");
                /*
                    var notifier = requireNodeJSmodule('node-notifier');
                    var path = requireNodeJSmodule('path');

                    notifier.notify(
                    {
                        message: 'Hi! Hello thereeeee',
                        wait: true,
                        icon: path.join(__dirname, './coulson.jpg'),
                        sound: true
                    },
                    function(err, data) {
                        // Will also wait until notification is closed.
                        console.log('Waited');
                        console.log(err, data);
                    }
                    );

                    notifier.on('timeout', function() {
                    console.log('Timed out!');
                    });

                    notifier.on('click', function() {
                    console.log('Clicked!');
                    }); */
                
                })
                .catch( (error) => {
                    console.log('There has been a problem with your fetch operation: ', error.message);
                }); 
        }; 

        jsonFetch();
        window.setInterval( jsonFetch, 10000);
    };


    componentDidMount = () => { 
    /*console.log("OS Network Interface Obj:\t" + JSON.stringify(os.networkInterfaces()) );
        console.log("MacAddress:\t" + JSON.stringify(macaddress.networkInterfaces(), null, 2));
        console.log("OS username:\t" + os.userInfo().username); */
        this.randomFactFetch();
    }; //end componentDidMount() 

    determineWindowsVersion = (releaseNumber) => {
        let windowsVersion;
        let releaseNumberInt = parseInt(releaseNumber, 10);
        //console.log(releaseNumber);
       // console.log(releaseNumberInt);

        if (releaseNumber === 6) {
            windowsVersion = "Windows 8"
        }

        if (releaseNumberInt >= 6 && releaseNumberInt <= 8 ) {
            windowsVersion = "Windows 7"
        }
    
        else if (releaseNumberInt >= 8 ) {
            windowsVersion = "Windows 10"
        }

        else if (releaseNumberInt >= 8 ) {
            windowsVersion = "Windows 10"
        }
    
        return windowsVersion;
    };  //end determineWindowsVersion() 

     render = () => {
        const electron = window.require("electron");
        const remote = electron.remote;
        const os = remote.require("os");

        //If footer is rendered, shorten the height of the page content container.
        if (this.props.renderFooterBool) {
            if (document.body.contains(document.querySelector("section.page-content")) ) {
                document.querySelector("section.page-content").style.maxHeight = "450px";
            } //end inner if-statement
        } //end outer if-statement

        else {
            if (document.body.contains(document.querySelector("section.page-content")) ) {
                document.querySelector("section.page-content").style.maxHeight = "695px";
            } //end inner if-statement
        } //end else-statement

        return (
                this.props.renderFooterBool ? (
                    <footer>
                        <div className="USER-container noDrag"><p>User: <span className="currentUserName">{ this.state.userName }</span></p></div>
                        <div className="IP-container noDrag"><p className="IP-message">IP Address:&#9;<span>{ this.state.ipAddress }</span></p></div>
                        <div className="OS-container noDrag"><p className="OS-platform">System:&#9;<span>{this.determineWindowsVersion(os.release()) || "OS Platform"}</span></p></div>
                        <div className="noDrag"><p className="randomFact-container">Random Fact:&#9;<span className="randomFact">{this.state.randomFact}</span></p></div>
                        <p className="cv-way noDrag">Powered by: The CV-Way</p>
                    </footer>
                 ) : null
            ); //end return
    } //end render()
} //end class

export default Footer;
