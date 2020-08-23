const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

// Set envirnment
//process.env.NODE_ENV =  'production';

let mainWindow;
let addWindow;

// Listen for the app to be ready
app.on('ready', function() {
    //Create new Window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Load html into window 
    mainWindow.loadURL(url.format({
        //Basically passing dirname/mainWindow.html into the url 
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file', 
        slashes: true
    }));
    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert Menu
    Menu.setApplicationMenu(mainMenu);

});

// Handle create add Window 
function createAddWindow() {
    //Create new Window
    addWindow = new BrowserWindow({
        width: 400,
        height: 350,
        title: 'Add new Project',
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Load html into window 
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:', 
        slashes: true
    }));
    // Garbage collection handle
    addWindow.on('close', function(){
        addWindow = null;
    })
}

ipcMain.on('add-todo-window', () => {
    createAddWindow()
      })

// Catch item:add
ipcMain.on('item:add', function(e, item){
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});


// document.getElementById('createProjectBtn').addEventListener('click', () => {
//     createAddWindow()
//   })

// Create Menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear')
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ] 
    }
];

// Check if mac to change the manu from  Electron >> File
// if(process.platform == 'darwin'){
//     mainMenuTemplate.unshift({});
// }

// Add developer tools item if not in production 
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label:'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}