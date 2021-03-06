import React, { Component } from "react";

//Import utilities
import { stringIsEmptyOrBlank } from "./utilityFunctions.js";

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: this.getUsername(),
            ipAddress: this.getIPAddress()
        };

        const os = window.require("os");
        const userInfo_object = os.userInfo({encoding: 'utf8'});
        const userInfo_name = userInfo_object.username;

        const usernameIf = process.env.username || process.env.user;
    } //end constructor()
    
    getUsername = () => {
        const completeUserName = window.require("fullname");

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
                console.log("Complete username is empty!");
                this.setState({
                    userName: this.userInfo_name
                });
            } //end else-statement
        });  //end completeUserName() 
    } //end completeUserName()

    getIPAddress = () => {
        console.log("Process env:\t" + JSON.stringify(process.env));
        const macaddress = window.require("macaddress");
        const undefsafe = window.require("undefsafe");

        console.log(`Mac address: ${JSON.stringify(macaddress.networkInterfaces()) }`);

        let IP_Address; 

        if ( undefsafe(macaddress.networkInterfaces(), "Ethernet.ipv4") !== undefined ) {
            //  IP_Address = macaddress.networkInterfaces()["Local Area Connection"]["ipv4"];
            IP_Address = undefsafe(macaddress.networkInterfaces(), "Ethernet.ipv4");
            console.log("IPV4 ethernet:\t" + IP_Address);
            console.log("IPV4 ethernet Typeof:\t"+ typeof IP_Address);
        }

        else if ( undefsafe(macaddress.networkInterfaces(), "VirtualBox Host-Only Network.ipv4") !== undefined ) {
            //  IP_Address = macaddress.networkInterfaces()["Local Area Connection"]["ipv4"];
            IP_Address = undefsafe(macaddress.networkInterfaces(), "VirtualBox Host-Only Network.ipv4");
            console.log("Virtual Box host only network:\t" + IP_Address);
           console.log("Virtual Box host only network Typeof:\t"+ typeof IP_Address);
        }

        else if ( undefsafe(macaddress.networkInterfaces(), "Local Area Connection.ipv4") !== undefined ) {
          //  IP_Address = macaddress.networkInterfaces()["Local Area Connection"]["ipv4"];
          IP_Address = undefsafe(macaddress.networkInterfaces(), "Local Area Connection.ipv4");
          console.log("IPV4 local area connection:\t" + IP_Address);
          console.log("IPV4  local area connection Typeof:\t"+ typeof IP_Address);
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

    componentDidMount = () => { 
    /*console.log("OS Network Interface Obj:\t" + JSON.stringify(os.networkInterfaces()) );
        console.log("MacAddress:\t" + JSON.stringify(macaddress.networkInterfaces(), null, 2));
        console.log("OS username:\t" + os.userInfo().username); */
    } //end componentDidMount() 

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
    }  //end determineWindowsVersion() 

     render = () => {
        const os = window.require("os");

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
                        <p className="cv-way noDrag">Powered by: The CV-Way</p>
                    </footer>
                 ) : null
            ); //end return
    } //end render()
} //end class

export default Footer;
