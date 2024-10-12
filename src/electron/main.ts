import {app, BrowserWindow} from 'electron'
import path from 'path'
import { isDev } from './util.js'

app.on('ready', () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    if (isDev()) {
        win.loadURL('http://localhost:3000')
    }else {
        win.loadFile(path.join(app.getAppPath(),'/dist-react/index.html'))
    }
})