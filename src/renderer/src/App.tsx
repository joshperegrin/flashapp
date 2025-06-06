import { SidebarInset, SidebarProvider } from "@renderer/components/ui/sidebar"
import { AppSidebar } from "@renderer/components/app-sidebar"
import { Routes, Route } from "react-router-dom"
import { useEffect } from 'react';
import DeckPage from '@renderer/components/deck-page'
import * as DeckStore from '@renderer/state'
import * as Jotai from 'jotai';
import {FlashcardsReview} from "@renderer/components/flashcards-review"
import { useNavigate } from "react-router-dom" 
import { Toaster } from "sonner";
import {myStore} from '@renderer/state'
import { toast } from "sonner"


function App(): React.JSX.Element {
  const [decks, ] = Jotai.useAtom(DeckStore.decksAtom)
  const navigate = useNavigate()
  const [stuff, ] = Jotai.useAtom(DeckStore.errorMessageToastAtom)
  
  useEffect(() => {
    const firstDeck = decks.at(0)?.id
    if(typeof firstDeck !== "undefined") navigate("/deck/" + firstDeck)
    
  }, [])
  useEffect(() =>{
    toast.error(stuff)
  }, [stuff])
  
  return (
    <>
      <Toaster position="bottom-right"/>
      <Jotai.Provider store={myStore}>
        <SidebarProvider>
          <AppSidebar/>
          <SidebarInset>
            <main className="h-full">
              <Routes>
                <Route path="/" />
                <Route path="/deck/:deckid" element={<DeckPage/>} />
                <Route path="/deck/:deckid/review" element={<FlashcardsReview/>} />
              </Routes>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </Jotai.Provider>
    </>
  )
}

export default App
