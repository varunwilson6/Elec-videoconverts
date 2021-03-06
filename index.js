const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');
const _ = require('lodash');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;
app.on('ready', ()=> {
    mainWindow = new BrowserWindow({
        height:600,
        width:800,
        webPreferences: {backgroundThrottling:false,
        nodeIntegration:true,
    }
    });

    mainWindow.loadURL(`file://${__dirname}/src/index.html`)


});

ipcMain.on('videos:added', (event, videos)=>{
    // const promise = new Promise((resolve, reject)=>{
    //     ffmpeg.ffprobe(videos[0].path, (err, metadata)=>{
    //         resolve(metadata);
    //     });
    // });

    // promise.then((metadata)=>console.log(metadata))

    const promises = _.map(videos, video => {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(video.path, (err, metadata)=>{
                video.duration = metadata.format.duration;
                video.format = 'avi';    
                resolve(video);
            });
        });
    });

    Promise.all(promises)
    .then((results)=> {
        mainWindow.webContents.send('metadata:complete', results);
    });
});

ipcMain.on('conversion:start', (event,videos)=>{
        console.log(videos);
})

