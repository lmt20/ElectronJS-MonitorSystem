const {BrowserWindow} = require('electron');

class MainWindow extends BrowserWindow {
    constructor(loadFile, isDev, primaryDisplay) {
        super({
            title: "ImageShrink",
            width: isDev ?  primaryDisplay.size.width : 630,
            height: isDev? primaryDisplay.size.height : 630,
            icon: './assets/icons/cpu.png',
            // show: false,
            opacity: 0.9,
            webPreferences: {
                nodeIntegration: true,
            },
        });
        this.loadFile(loadFile)
        if(isDev){
            this.webContents.openDevTools()
        }
    }
}

module.exports = MainWindow;