import {app, BrowserWindow, ipcMain} from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import * as youtubeDL from 'youtube-dl-exec';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

const ytDL = youtubeDL.create(path.join(__dirname, '/../node_modules/youtube-dl-exec/bin/youtube-dl'));

function createWindow(): BrowserWindow {
  // const electronScreen = screen;
  // const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: 630,
    height: 101,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run e2e test with Spectron
    },
  });

  win.setResizable(false);

  ipcMain.on('resize', (event, data) => {
    win.setSize(630, 101+data.count*104+(data.count > 0 ? 20 : 0));
  })
  
  ipcMain.on('downloadYT', (event, data) => {
    ytDL(data.link, {
      printJson: true,
      skipDownload: true
    }).then(output => {
      const subprocess = ytDL.exec(data.link, {
        extractAudio: true,
        audioFormat: 'mp3',
        output: path.join(app.getPath('downloads'), '/').concat('%(title)s.%(ext)s')
      }, {encoding: 'utf-8'});
      let lastProcess = 0;
      subprocess.stderr.on('data', (error) => {
        event.sender.send('downloadYTProcess', {
          process: lastProcess,
          title: output.title,
          link: data.link,
          thumbnail: output.thumbnail,
          error: error,
          corrId: data.corrId
        })
      });
      subprocess.stdout.on('data', (process) => {
        let processText = '';
        process.forEach((num) => {
          processText += (String.fromCharCode(num));
        });
        let processPercent = processText.match(/([0-9]){1,3}([.])?([0-9]){1,3}?([%])/g);
        lastProcess = processPercent ? parseFloat(processPercent[0]) : lastProcess;
        event.sender.send('downloadYTProcess', {
          process: lastProcess,
          title: output.title,
          link: data.link,
          thumbnail: output.thumbnail,
          corrId: data.corrId
        })
      });
    });
  });

  if (serve) {
    win.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '/../node_modules/electron'))
    });
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    win.loadURL(url.format({
      pathname: path.join(__dirname, pathIndex),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
