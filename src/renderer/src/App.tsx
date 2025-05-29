import { SidebarInset, SidebarProvider } from "@renderer/components/ui/sidebar"
import { AppSidebar } from "@renderer/components/app-sidebar"
import { HashRouter, Routes, Route } from "react-router-dom"
import { useEffect } from 'react';
import DeckPage from '@renderer/components/deck-page'
import * as DeckStore from '@renderer/state'
import * as Jotai from 'jotai';

function App(): React.JSX.Element {
  const [decks, ] = Jotai.useAtom(DeckStore.decksAtom)
  const [, setSelectedDeck] = Jotai.useAtom(DeckStore.selectedDeckIdAtom)
  
  useEffect(() => {
    const firstDeck = decks.at(0)?.id
    if(typeof firstDeck !== 'undefined') setSelectedDeck(firstDeck)
  }, [])
  
  return (
    <>
      <HashRouter>
        <SidebarProvider>
          <AppSidebar/>
          <SidebarInset>
            <main>
              <Routes>
                <Route path="/" element={<p className="text-blue-600 dark:text-sky-400"> Hello World!</p>} />
                <Route path="/deck/:deckid" element={<DeckPage/>} />
              </Routes>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </HashRouter>
    </>
  )
}

export default App
