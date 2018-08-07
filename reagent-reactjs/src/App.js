import React, { Component } from "react";
import {Route, BrowserRouter, Switch, HashRouter} from "react-router-dom";

// Import General Page Components
import Titlebar from "./Titlebar.js";
import Header from "./Header.js";
import SubmitTicket from "./SubmitTicket.js";

// Import Pages
import Home from "./Home.js";
import WiFiMagic from "./WiFiMagic.js";
import ProjectorMagic from "./ProjectorMagic.js";
import QuickFixTutorials from "./QuickFixTutorials.js";
import HelpDesk from "./HelpDesk.js";
import AutoFixTools from "./AutoFixTools.js";
import StaffPortal from "./StaffPortal.js";
import Announcements from "./Announcements.js";
import Footer from "./Footer.js";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const isDev = window.require("electron").remote.require('electron-is-dev'); 
  
    let openingContainer;
    let closingContainer;

    if (isDev) {
      openingContainer =  <BrowserRouter>;
      closingContainer =  </BrowserRouter>;

      return (
        <BrowserRouter>
          <div>
          <Titlebar/>
            <main>
              <Header/>
            {/* <Home/>*/}   {/* This is is the component you change when 
                          the page changes, since all components have a 
                          container, a main element, and a header. */}
                          <Footer />
              <section className="page-content">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/autoFix-tools" component={AutoFixTools} />
                  <Route path="/submit-ticket" component={SubmitTicket} />
                  <Route path="/quickFix-tutorials" component={QuickFixTutorials} />
                  <Route path="/call-helpdesk" component={HelpDesk} />
                  <Route path="/wiFiMagic" component={WiFiMagic} /> 
                  <Route path="/ProjectorMagic" component={ProjectorMagic} />
                  <Route path="/staffPortal" component={StaffPortal} /> 
                  <Route path="/announcements" component={Announcements} /> 
                </Switch>  
              </section>
              <Footer />
              <div className="blur-effect"></div>
            </main>
          </div>
          </BrowserRouter>
      ); //end return statement
    } //end if-statement

    else {
      openingContainer =  <HashRouter>;
      closingContainer =  </HashRouter>;

      return (
        <HashRouter>
          <div>
          <Titlebar/>
            <main>
              <Header/>
            {/* <Home/>*/}   {/* This is is the component you change when 
                          the page changes, since all components have a 
                          container, a main element, and a header. */}
                          <Footer />
              <section className="page-content">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/autoFix-tools" component={AutoFixTools} />
                  <Route path="/submit-ticket" component={SubmitTicket} />
                  <Route path="/quickFix-tutorials" component={QuickFixTutorials} />
                  <Route path="/call-helpdesk" component={HelpDesk} />
                  <Route path="/wiFiMagic" component={WiFiMagic} /> 
                  <Route path="/ProjectorMagic" component={ProjectorMagic} />
                  <Route path="/staffPortal" component={StaffPortal} /> 
                  <Route path="/announcements" component={Announcements} /> 
                </Switch>  
              </section>
              <Footer />
              <div className="blur-effect"></div>
            </main>
          </div>
          </HashRouter>
      ); //end return statement
    } //end else-statement
  } //end render() process
} //end App class

export default App;
