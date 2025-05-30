import mammoth from 'mammoth';
import PptxGenJS from 'pptxgenjs';
import JSZip from 'jszip';
import pdfParse from 'pdf-parse';
import { dialog, app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import path from 'path';
import fs from 'fs';

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const MAX_FILE_SIZE_MB = 5; // max file size
const ALLOWED_EXTENSIONS = ['.txt', '.md', '.doc', '.docx', '.rtf', '.pdf', '.ppt', '.pptx'];
const MAX_PAGE_COUNT = 10; // for PDFs
const MAX_CHAR_COUNT = 10000; // for txt/md files

ipcMain.handle('dialog:selectFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {
        name: 'Supported Documents',
        extensions: ['txt', 'md', 'doc', 'docx', 'rtf', 'pdf', 'ppt', 'pptx']
      }
    ]
  });

  if (canceled || filePaths.length === 0) return { error: 'No file selected' };

  const filePath = filePaths[0];
  const ext = path.extname(filePath).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { error: 'Unsupported file type' };
  }

  // File size check
  const stats = fs.statSync(filePath);
  const fileSizeMB = stats.size / (1024 * 1024);
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    return { error: `File too large (${fileSizeMB.toFixed(2)}MB). Max allowed is ${MAX_FILE_SIZE_MB}MB.` };
  }

  if (ext === '.pdf') {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      if (pdfData.numpages > MAX_PAGE_COUNT) {
        return { error: `PDF has too many pages (${pdfData.numpages}). Max allowed is ${MAX_PAGE_COUNT}.` };
      }
    } catch {
      return { error: 'Failed to parse PDF file.' };
    }
  }

  if (ext === '.txt' || ext === '.md') {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (content.length > MAX_CHAR_COUNT) {
        return { error: `File too long (${content.length} characters). Max allowed is ${MAX_CHAR_COUNT} characters.` };
      }
    } catch {
      return { error: 'Failed to read text file.' };
    }
  }

  if (ext === '.docx') {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const { value: text } = await mammoth.extractRawText({ buffer: dataBuffer });
      // Estimate pages: assume 1800 characters ~ 1 page (adjust as needed)
      const estimatedPages = Math.ceil(text.length / 1800);
      if (estimatedPages > MAX_PAGE_COUNT) {
        return { error: `DOCX has too many pages (estimated ${estimatedPages}). Max allowed is ${MAX_PAGE_COUNT}.` };
      }
    } catch {
      return { error: 'Failed to parse DOCX file.' };
    }
  }

  if (ext === '.pptx') {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const zip = await JSZip.loadAsync(dataBuffer);
    
      // pptx slides are stored in ppt/slides/ folder
      const slidesFolder = 'ppt/slides/';
      const slides = Object.keys(zip.files).filter(filename => filename.startsWith(slidesFolder) && filename.endsWith('.xml'));

      const slideCount = slides.length;

      if (slideCount > MAX_PAGE_COUNT) {
        return { error: `PPTX has too many slides (${slideCount}). Max allowed is ${MAX_PAGE_COUNT}.` };
      }
    } catch (err) {
      console.error(err);
      return { error: 'Failed to parse PPTX file.' };
    }
  }
  // For other extensions (.doc, .rtf, .ppt), skipping page count due to complexity

  return { filePath };
});

