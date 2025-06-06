import { ElectronAPI } from '@electron-toolkit/preload'
import {GenerateCardsParams} from './types'
import {Flashcard, Deck} from '../renderer/src/state.tsx'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      selectFile: () => Promise<string>;
      generateCards: (param: any) => Promise<any>
    }
  }
}

