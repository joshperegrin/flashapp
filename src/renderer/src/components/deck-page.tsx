import * as React from 'react'
import { useParams } from "react-router-dom";
import { CarouselSpacing } from "@renderer/components/carousel-cards"
import DropdownFilterCards from "@renderer/components/dropdown-filter-cards"
import { Button } from "@renderer/components/ui/button"
import { Searchbox } from "@renderer/components/search-deck"
import { Zap, Sparkles, CopyPlus } from "lucide-react";
import { CardWithForm } from "@renderer/components/flashcards"
import { SidebarTrigger } from "@renderer/components/ui/sidebar"
import {Card, CardContent} from "@renderer/components/ui/card"
import { NewCardsForm } from './new-flashcard-form';
import * as Jotai from 'jotai'
import { useNavigate } from "react-router-dom" 
import * as DeckStore from '@renderer/state'
import { toast } from "sonner"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/dialog"
import { Textarea } from './ui/textarea';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Switch } from "@renderer/components/ui/switch";
import { Label } from "@renderer/components/ui/label";

function DeckPage() {
  const [parseLOT, setParseLOT] = React.useState(false)
  const navigate = useNavigate()
  const cardContainerRef = React.useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = Jotai.useAtom(DeckStore.isEditingAtom)
  const [, setSelectedDeckID] = Jotai.useAtom(DeckStore.selectedDeckIdAtom)
  const [selectedDeck, ] = Jotai.useAtom(DeckStore.selectedDeckAtom)
  let { deckid } = useParams()

  // New state for selected flashcard IDs
  const [selectedFlashcardIds, setSelectedFlashcardIds] = React.useState<string[]>([])
  const lastSelectedIndexRef = React.useRef(null) // To handle Shift + Click

  React.useEffect(() => {
    setSelectedDeckID(deckid)
  }, [deckid])

  const [isStuck, setIsStuck] = React.useState(false)
  const stickyRef = React.useRef(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting)
      },
      { threshold: [1], rootMargin: "0px 0px 0px 0px" }
    )

    if (stickyRef.current) {
      observer.observe(stickyRef.current)
    }


    return () => {
      if (stickyRef.current) {
        observer.unobserve(stickyRef.current)
      }
    }
  }, [])

  // Function to handle flashcard selection
  const handleFlashcardSelection = (flashcardId, index, event) => {
    if (event.ctrlKey || event.metaKey) { // Ctrl or Cmd key
      setSelectedFlashcardIds(prevSelected =>
        prevSelected.includes(flashcardId)
          ? prevSelected.filter(id => id !== flashcardId)
          : [...prevSelected, flashcardId]
      )
      lastSelectedIndexRef.current = index
    } else if (event.shiftKey) {
      if (lastSelectedIndexRef.current !== null && selectedDeck?.flashcards) {
        const startIndex = Math.min(lastSelectedIndexRef.current, index)
        const endIndex = Math.max(lastSelectedIndexRef.current, index)
        const flashcardsToSelect = selectedDeck.flashcards
          .slice(startIndex, endIndex + 1)
          .map(card => card.id)

        // Merge new selection with existing selection, ensuring no duplicates
        setSelectedFlashcardIds(prevSelected => {
          const newSet = new Set([...prevSelected, ...flashcardsToSelect]);
          return Array.from(newSet);
        });
      } else {
        // If shift is pressed without a previous selection, treat as a single click
        setSelectedFlashcardIds([flashcardId])
      }
      lastSelectedIndexRef.current = index
    } //else {
//      // Regular click - select only this card
//      setSelectedFlashcardIds(prevSelected =>
//        prevSelected.includes(flashcardId) && prevSelected.length === 1
//          ? [] // Deselect if already selected and it's the only one
//          : [flashcardId]
//      )
//      lastSelectedIndexRef.current = index
//    }
  }

  // Arbitrary function that receives selected flashcard IDs
  const processSelectedFlashcards = (ids) => {
    console.log("Processing selected flashcard IDs:", ids)
    // You can perform any action here, e.g., delete, export, move, etc.
    alert(`Selected ${ids.length} flashcards: ${ids.join(', ')}`);
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cardContainerRef.current &&
        !cardContainerRef.current.contains(event.target as Node)
      ) {
        setSelectedFlashcardIds([]);
        lastSelectedIndexRef.current = null;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      {/* 👁 Invisible Sentinel Above Header */}
      <div ref={stickyRef} />

      {/* Header */}
      <div
        data-stuck={isStuck ? "true" : "false"}
        className="sticky top-0 z-30 w-full flex flex-col justify-center bg-white shadow-sm data-[stuck=false]:rounded-t-xl"
      >
        <header className="h-12 flex justify-between items-center border-b pr-2 pl-2">
          <div className="flex flex-row">
            <SidebarTrigger />
            <h1 className="text-base font-medium truncate">{selectedDeck?.name}</h1>
          </div>
          <Button onClick={() => {
            if(selectedDeck?.flashcards.length !== 0){
              navigate(`/deck/${deckid}/review`)
            } else {toast.error("Uhh Oh! It seems like you don't have any flashcards to study.")}}}>
            <Zap/>
            Review
          </Button>
        </header>
      </div>

      {/* Carousel */}
      <div className="w-full flex justify-center mt-4 px-4 sm:px-6 lg:px-8">
        {selectedDeck?.flashcards.length !== 0 && <CarouselSpacing />}
      </div>

      {/* Filters and Search */}
      <div className="w-full flex justify-center mb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4 px-4 w-full sm:w-[680px] lg:w-[1050px]">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1" onClick={async ()=>{}}>
                <Sparkles className="size-4" />
                  <span>Generate Cards</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Generate Flashcards</DialogTitle>
                <DialogDescription>Please paste your text below</DialogDescription>
              </DialogHeader>

                  <Textarea className='resize-none h-50'/>
                  <div className='flex flex-row gap-2 my-3'>
                  <Switch checked={parseLOT} onCheckedChange={setParseLOT}/>
                  <Label> Parse as list of terms </Label>
                  </div>
                <DialogFooter className="sm:justify-between">
                  <Button> Open file</Button>
                  <div className='flex flex-row gap-2'>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                  <Button type="button">
                    Submit
                  </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          <div className="flex flex-col sm:flex-row gap-2">
            <Searchbox />
            <DropdownFilterCards />
          </div>
        </div>
      </div>

      {/* Display a button to trigger the arbitrary function if cards are selected */}
      {selectedFlashcardIds.length > 0 && (
        <div className="w-full flex justify-center mb-4">
          <Button onClick={() => processSelectedFlashcards(selectedFlashcardIds)}>
            Process {selectedFlashcardIds.length} Selected Cards
          </Button>
        </div>
      )}


      {/* Cards */}
      <div className="flex flex-col gap-5 items-center mt-4 px-4 sm:px-6 lg:px-8">
        <Card className="w-full sm:w-[650px] lg:w-[1000px] cursor-pointer hover:shadow-md transition-shadow bg-accent items-center" onClick={() => setIsEditing(true)}>
          <CardContent className="px-4 flex flex-row">
            <CopyPlus/>
            <span className="ml-2">New Card</span>
          </CardContent>
        </Card>
        {isEditing && <NewCardsForm/>}
        <div ref={cardContainerRef} className="flex flex-col gap-5 items-center mt-4 w-full sm:w-fit">
        {selectedDeck?.flashcards.map((value, index) => (
          <CardWithForm
            flashcard_id={value.id}
            key={value.id} // Use unique ID as key for better React performance
            isSelected={selectedFlashcardIds?.includes(value.id)}
            onSelect={(event) => handleFlashcardSelection(value.id, index, event)}
          />
        ))}
        </div>
      </div>
    </>
  )
}

export default DeckPage
