import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  generateCards(param: any){
    console.log("HELLOOOO")
    return ipcRenderer.invoke("generate:cards", param)
  },
  selectFile(){
    return ipcRenderer.invoke("dialog:selectFile")
  }

}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  console.log("HIIIIIIIIII")
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  // window.electron = electronAPI
  // // @ts-ignore (define in dts)
  // window.api = api
}
