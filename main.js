const electron = require('electron');
const url      = require('url');
const path     = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;



//SET ENV
process.env.NODE_ENV = 'production';




let mainWindow;
let addWindow;

//Listen for app to be ready

app.on('ready', function(){
  //create new Window

  mainWindow = new BrowserWindow({});
  //Load html into window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes : true
  }));

  //Quit app when closed
  mainWindow.on('closed', function(){
   app.quit();
  });


  //  Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});



// Handle creater add window 
function createAddWindow() {
  
//create new Window

  addWindow = new BrowserWindow({

    width: 300,
    height:300,
    title: 'Add Shopping List item'
  });
  //Load html into window
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes : true
  }));

  // Garbage collection handle
  addWindow.on('close', function(){

    addWindow: null
  });

}

//catch item:add

ipcMain.on('item:add', function(e, item){
  console.log(item);
  mainWindow.webContents.send('item:add', item);
  addWindow.close();
})


//Create menu template

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
     {
      label: 'Add Item',
      click(){
        createAddWindow();
      }
     },

     {
      label: 'Clear Item',
      click(){
        mainWindow.webContents.send('item:clear');

      }
     },

     {
      label: 'Quit',
      accelerator: process.platform == 'darwin' ? 'Command+Q' : 'ctrl+Q', 
      click(){
        app.quit();
      }
     }
    ]
  }

];


// If mac, add empty object to menu
if(process.platform == 'darwin'){  
  mainMenuTemplate.unshift({});  // this empty object is fix for error on mac (menu bar)
}


//Add developer tools item if not in prod
if(process.env.NODE_ENV !== 'production'){
   mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
       {
         label: 'Toggle DevTools',
         accelerator: process.platform == 'darwin' ? 'Command+I' : 'ctrl+I',
         click(item, focusedWindow){
            focusedWindow.toggleDevTools(); 
          }
       },

       {role: 'reload'}
    ]
   });
}