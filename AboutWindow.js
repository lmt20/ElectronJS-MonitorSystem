const {BrowserWindow} = require('electron');

class AboutWindow extends BrowserWindow {
    constructor(url, primaryDisplay, isDev) {
        super({   
            title: "ImageShrink",
            width: (primaryDisplay.size.width - 500)/2 > 500 ? 500 : (primaryDisplay.size.width - 500)/2,
            height: isDev? primaryDisplay.size.height : 600,
            x: (primaryDisplay.size.width - 500)/2 > 500? (primaryDisplay.size.width - 500)/2 - 500: 0,
            y: (primaryDisplay.size.height - 600)/2+12,
            icon: './assets/icons/cpu.png',
        });
        this.loadURL(url)
    }
}

module.exports = AboutWindow;