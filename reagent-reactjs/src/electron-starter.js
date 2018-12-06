const electron = require("electron");
const { remote } = electron; //ES6 Destructuring -- Same as  const remote = electron.remote

// Module to control application life.
const { app } = electron; //ES6 Destructuring -- Same as const app = electron.app

// Module to create native browser window.
const { BrowserWindow } = electron; //ES6 Destructuring -- Same as const BrowserWindow = electron.BrowserWindow

const { ipcMain } = electron;

const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev"); 

const { nativeImage } = require("electron");

/*Keep a global reference of the electron window object, if you don't, the window will
 be closed automatically when the JavaScript object is garbage collected. */
let mainWindow = null;
let backgroundWindow = null;
let tray = null;

process.env['APP_PATH'] = app.getAppPath();

const create_MainWindow = () => {
    // Create the browser window.
    //Show:false key-value pair is to delay loading until all resources have been loaded.
    var mainWindow = new BrowserWindow({
        title: "WayPoint", //Title of window whe frame is enabled
        width: 376, 
        height: 700, 
        frame: false, 
        fullscreen: false, 
        resizable: false, 
        webPreferences: {
            nodeIntegration: true,
        },
        show: false,
        skipTaskbar: false, //whether to show window in taskbar
        backgroundColor: "black",
        icon: isDev ? nativeImage.createFromPath(path.join(__dirname, "./../public/img/wp-icon-grey.png")) : nativeImage.createFromPath(path.join(__dirname, "./../build/img/wp-icon-grey.png"))
    });

    // ../public/img/wp-icon-grey.ico
    // ./gallery-icon.png
    const startUrl = isDev ? (process.env.ELECTRON_START_URL || "http://localhost:3000") : url.format({
        pathname: path.join(__dirname, "./../build/index.html"),
        protocol: "file:",
        slashes: true
    });

   // console.log(JSON.stringify(process.env)); //Log the environment variables
   //  console.log("process.env.ELECTRON_START_URL:\t" + process.env.ELECTRON_START_URL);
    // and load the index.html of the app.
    //mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    mainWindow.loadURL(startUrl);

    // Install the React tools, but only in development
    let prodDebug = true;
    if (isDev || prodDebug) {
         // Open the DevTools.
        mainWindow.webContents.openDevTools({ mode: "undocked"});
    } //end if-statement

    /*
    when everything is loaded, show the window and focus it so it pops up for the 
    user. You can do this with the “ready-to-show” event on your `BrowserWindow`, 
    which is recommended, or the ‘did-finish-load’ event on your webContents.
    * https://blog.avocode.com/4-must-know-tips-for-building-cross-platform-electron-apps-f3ae9c2bffff
    */
    mainWindow.on("ready-to-show", () => { 
        mainWindow.show(); 
        mainWindow.focus(); 
        console.log(`App Path:\t ${app.getAppPath()}`);
    });  

    // Emitted when the window is closed.
   
    mainWindow.on("closed", () => {
        // Dereference the window object, usually you would store windows
          //  in an array if your app supports multi windows, this is the time
         //   when you should delete the corresponding element. 
       // mainWindow = null;
       console.log("Main window closed");
    }); 

    let receiveIPC = () => {
        console.log("receiveIPC() main process");
        ipcMain.on("toMainProcess", (event, monitor) => {
            console.log("send message from main process");
            event.sender.send("monitorDown", monitor);
        });
    };

    mainWindow.webContents.on("did-finish-load", () => {
        receiveIPC();
    });

    //Always show the tray icon when the mainWindow is hidden
    mainWindow.on("hide", () => {
        if (tray) {
            tray.setHighlightMode("always");
        }
    });

    //Override minimize and close window functions to tray
    mainWindow.on("minimize", (event) => {
        event.preventDefault();
        mainWindow.minimize();
    });
    
    mainWindow.on("close", (event) => {
        event.preventDefault();
        if (tray) {
            if(!app.isQuitting) {
                event.preventDefault();
                mainWindow.hide();
            } //end inner if-statement
        } //end outer if-statement
        else {
           app.isQuitting = true;
           tray = null;
          // mainWindow = null;
           app.quit();
        }
        return false;
    });
} //end create_MainWindow()

const create_BackgroundWindow = () => {
    console.log("create_BackgroundWindow()");
    backgroundWindow = new BrowserWindow({
        title: "WayPoint", //Title of window when frame is enabled
        width: 500, 
        height: 200, 
        frame: false, 
        fullscreen: false, 
        resizable: false, 
        webPreferences: {
            nodeIntegrationInWorker: true,
        },
        show: true
    });

    const startUrl = isDev ? (process.env.ELECTRON_START_URL || path.join(__dirname, "./../public/background-process.html") ) : url.format({
        pathname: path.join(__dirname, "./../build/background-process.html"),
        protocol: "file:",
        slashes: true
    });

   backgroundWindow.loadURL(startUrl);
    backgroundWindow.on("ready-to-show", () => { 
        console.log("backgroundWindow ready to show!!");
        // if (typeof(Worker) !== "undefined") {
        //     console.log("Web worker supported");
        //     let monitorsWorker = new Worker("worker.js");
        // } else {
        //     console.log("Sorry! No Web Worker support...");
        // }
    });

    //let monitorsWorker = new Worker("fetchMonitors.js");
};

const setTrayIcon = () => {
    const {Menu, Tray, app, nativeImage} = require("electron");

    //let tray = null;
    //or use extraresources field in electron-builder package.json to bundle the icon
    const iconPath = isDev ? path.join(__dirname, "../public/img/wp-icon-grey-16x16.ico") : path.join(__dirname, "../build/img/wp-icon-grey-16x16.ico");
    
    tray = new Tray(nativeImage.createFromPath(iconPath));

    const contextMenu = Menu.buildFromTemplate([
        {   label: "Show WayPoint", 
            click:  function() {
                mainWindow.show();
            } //end click()
        },
        { label: "Quit", 
          click:  function() {
                app.isQuitting = true;
                 /* On OS X it is common for applications and their menu bar
                    to stay active until the user quits explicitly with Cmd + Q */
               /* if (process.platform !== "darwin") {
                    app.quit();
                } */
             
              //  mainWindow.destroy();
                mainWindow = null;

                if ( !tray.isDestroyed() ) {
                    tray.destroy();
                    tray = null;
                }
                
                app.quit();
            } //end click()
        }
    ]); //contextMenu declaration

    tray.setToolTip("CVUHSD WayPoint");
    tray.setContextMenu(contextMenu);
    console.log("Set Tray Icon");

    tray.on("click", () => {
        mainWindow.show();
    });
}; //end setTrayIcon()

//Prevent user from launching two different instances of the app.
const preventMoreThanOneInstance = () => {
    const shouldQuit = app.makeSingleInstance( (commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
          if ( mainWindow.isMinimized() ) { 
              mainWindow.restore();
              mainWindow.show(); 
              mainWindow.focus(); 
            } // end inner if-statement
          mainWindow.focus();
        } //end outer if statement
      }); //shouldQuit initialization
    
      if (shouldQuit) {
        app.quit();
        return;
      }
}; //preventMoreThanOneInstance()

preventMoreThanOneInstance();

var ws = require("windows-shortcuts");
ws.create("%APPDATA%/Microsoft/Windows/Start Menu/Programs/Electron.lnk", process.execPath);

/* Set app user model ID and setAsDefaultProtocol for windows notifications to run 
    Issue: https://github.com/electron/electron/issues/10864    
*/
//(`${./../package.json build.appId}` || "com.waypoint");

app.setAsDefaultProtocolClient("waypoint");

/*  This method will be called when Electron has finished
    initialization and is ready to create browser windows.
    Some APIs can only be used after this event occurs. 

    Trying out using async/wait here -- may need to remove */

app.on("ready", async () => {
   await create_MainWindow();
   //await create_BackgroundWindow();
    electron.protocol.registerServiceWorkerSchemes(["file:"]);
    ///* Register the file protocol as supported
   /*     electron.webFrame.registerURLSchemeAsPrivileged("file");
        electron.webFrame.registerURLSchemeAsSecure("file");
        electron.webFrame.registerURLSchemeAsBypassingCSP("file"); */
    // */
   await setTrayIcon();
});


// Quit when all windows are closed.
app.on("window-all-closed", () => {
    /* On OS X it is common for applications and their menu bar
    to stay active until the user quits explicitly with Cmd + Q */
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    /* On OS X it's common to re-create a window in the app when the
        dock icon is clicked and there are no other windows open. */
    if (mainWindow === null) {
        create_MainWindow();
        create_BackgroundWindow();
    }
});

//Prevent the creation of WebViews with insecure options
app.on("web-contents-created", (event, contents) => {
    contents.on("will-attach-webview", (event, webPreferences, params) => {
      // Strip away preload scripts if unused or verify their location is legitimate
      delete webPreferences.preload;
      delete webPreferences.preloadURL;
  
      // Disable Node.js integration
      webPreferences.nodeIntegration = false;

      // Verify URL being loaded
   /* if ( !params.src.startsWith("https://portal.centinela.k12.ca.us/staff.html") ) {
        event.preventDefault();
      }  //end if-statement

    else if ( !params.src.startsWith("https://portal.centinela.k12.ca.us/troubleshooting.html") ) {
        event.preventDefault();
      }  //end if-statement  */
    }); //end contents.on()
  });//end app.on

  /* Open the app when a user logins. Takes a settings object as an argument. 
    Docs: https://electronjs.org/docs/api/app#appsetloginitemsettingssettings-macos-windows
*/
app.setLoginItemSettings({
    "openAtLogin": true,
    "openAsHidden": false
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
/* window.eval = global.eval = function () {
   throw new Error(`Sorry, this app does not support window.eval().`)
  } */

  


