const { app, BrowserWindow, Menu, ipcMain, shell, screen, Tray } = require('electron');
const path = require('path');
const os = require('os');
const slash = require('slash');
const MainWindow = require('./MainWindow');
const AboutWindow = require('./AboutWindow');

process.env.NODE_ENV = "development"
const isDev = process.env.NODE_ENV !== "production"
let primaryDisplay;
let mainWindow;
let tray;

function createMainWindow() {
    mainWindow = new MainWindow('./app/index.html', isDev, primaryDisplay)
}

function createAboutWindow() {
    aboutWindow = new AboutWindow('https://github.com/lmt20', primaryDisplay, isDev)
}


app.on('ready', () => {
    const template = require('./utils/menu');
    template.unshift({
        label: "About",
        click: createAboutWindow
    })
    template[1].submenu.unshift({
        label: "Toggle Nav",
        click: () => {
            mainWindow.webContents.send('nav:toggle')
        },
        accelerator: 'CmdOrCtrl+N'
    })
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    primaryDisplay = screen.getPrimaryDisplay()
    createMainWindow()
    
    const iconPath = path.join(__dirname, 'assets', 'icons','cpu.png')
    tray = new Tray(iconPath)
    tray.on('click', () => {
        if(mainWindow.isVisible() === true){
            mainWindow.hide()
        }
        else{
            mainWindow.show()
        }
    })
    tray.on('right-click', () => {
        const contextMenu = Menu.buildFromTemplate([{
            label: 'Quit',
            click: () => {
                app.isQuitting = true,
                app.quit()
            }
        }])
        tray.popUpContextMenu(contextMenu);
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow()
    }
})