import {app, BrowserWindow} from 'electron'
import path from 'path'

app.on('ready', () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // win.loadFile('index.html')
    win.loadFile(path.join(app.getAppPath(),'/dist-react/index.html'))
})