import { SidebarInset, SidebarProvider } from "@renderer/components/ui/sidebar"
import { AppSidebar } from "@renderer/components/app-sidebar"
import { HashRouter, Routes, Route } from "react-router-dom"
import { useState } from 'react';
import { Deck } from '@renderer/types'
import DeckPage from '@renderer/components/deck-page'

function App(): React.JSX.Element {
  const [decks, _] = useState<Deck[]>([
    { title: "Deck 1", url: "/deck/Deck1" },
    { title: "Deck 2", url: "/deck/Deck2" },
    { title: "Deck 3", url: "/deck/Deck3" },
    { title: "Deck 4", url: "/deck/Deck4" },
    { title: "Deck 5", url: "/deck/Deck5" },
  ]);
  
  return (
    <>
      <HashRouter>
        <SidebarProvider>
          <AppSidebar decks={decks}/>
          <SidebarInset>
            <main>
              <Routes>
                <Route path="/" element={<p className="text-blue-600 dark:text-sky-400"> Hello World!</p>} />
                <Route path="/deck/:deckname" element={<DeckPage/>} />
              </Routes>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </HashRouter>
    </>
  )
}

export default App
