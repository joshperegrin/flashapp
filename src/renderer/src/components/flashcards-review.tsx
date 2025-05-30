"use client"

import { useParams } from "react-router-dom";
import { useState, useRef } from "react"
import * as React from 'react'
import { motion } from "framer-motion"
import { Button } from "@renderer/components/ui/button"
import { FlashcardItem } from "@renderer/components/flashcard-item-review"
import * as Jotai from 'jotai'
import * as DeckStore from "@renderer/state"
import { X, Annoyed, Smile } from 'lucide-react'
import { SidebarTrigger } from "@renderer/components/ui/sidebar"
import { useNavigate } from "react-router-dom" 
import CustomQueue from "@renderer/lib/queue"

export function FlashcardsReview() {
  const initialized = useRef(false)
  const navigate = useNavigate()
  let { deckid } = useParams()
  const queueref = useRef(new CustomQueue<DeckStore.Flashcard>)
  const [deck, ] = Jotai.useAtom(DeckStore.selectedDeckAtom)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null)
  const [isFlippedOnNext, setIsFlippedOnNext] = useState(true)
  const [previousIsFlippedOnNext, setPreviousIsFlipped] = useState(false)
  const [reviewLength, setReviewLength] = useState(0)
  const [reviewProgress, setReviewProgress] = useState(0)
  const [clicked, setClicked] = useState(false)

  const [currentFC, setCurrentFC] = useState<DeckStore.Flashcard>()
  const [previousFC, setPreviousFC] = useState<DeckStore.Flashcard>()

  const nextIndex = (currentIndex + 1) % deck!.flashcards.length
  const prevIndex = (currentIndex - 1 + deck!.flashcards.length) % deck!.flashcards.length

  const handleNext = () => {
    if (isAnimating || deck!.flashcards.length <= 1) return
    
    setPreviousFC(queueref.current.peek())
    queueref.current.dequeue()
    setCurrentFC(queueref.current.peek())
    setReviewProgress(reviewLength - queueref.current.size())
    if(isFlipped){
      setPreviousIsFlipped(!isFlippedOnNext)
      setIsFlippedOnNext(false)
    } else {
      setPreviousIsFlipped(isFlippedOnNext)
      setIsFlippedOnNext(true)
    }
    
    setIsAnimating(true)
    setAnimatingIndex(currentIndex)
    
    setCurrentIndex(nextIndex)
    setClicked(false)

    setTimeout(() => {
      setIsAnimating(false)
      setAnimatingIndex(null)
    }, 400)
  }

  const handleForgot = () => {
    if (isAnimating || deck!.flashcards.length <= 1) return;

    const currentFC = queueref.current.peek();
    queueref.current.dequeue();
    queueref.current.insertAt(Math.floor(queueref.current.size() / 2), currentFC!);
  
    setPreviousFC(currentFC);
    setCurrentFC(queueref.current.peek());

    if (isFlipped) {
      setPreviousIsFlipped(!isFlippedOnNext);
      setIsFlippedOnNext(false);
    } else {
      setPreviousIsFlipped(isFlippedOnNext);
      setIsFlippedOnNext(true);
    }

    setIsAnimating(true);
    setAnimatingIndex(currentIndex);
    setCurrentIndex(nextIndex);
    setClicked(false)

    setTimeout(() => {
      setIsAnimating(false);
      setAnimatingIndex(null);
    }, 400);
  };


  React.useEffect(()=>{
    if(!initialized.current){
      deck?.flashcards.forEach((value) => {queueref.current.enqueue(value)})
      setCurrentFC(queueref.current.peek())
      setReviewLength(queueref.current.size())
    }
    initialized.current = true
  }, [])

  return (
    <>
    <header className="h-12 flex justify-between items-center border-b pr-2 pl-2">
      <div className="flex flex-row">
          <SidebarTrigger />
        <h1 className="text-base font-medium truncate">{deck?.name} </h1>
      </div>
      <Button variant="outline" onClick={() => {navigate(`/deck/${deckid}`)}}>
        <X/>
        Quit Reviewing
      </Button>
    </header>

    <div className="flex flex-col items-center gap-6 h-[500px] mt-20 w-auto mx-20">
      <div className="relative w-full h-full overflow-hidden">
        <div className="h-full w-full" style={{ perspective: "1000px" }}>
          {/* Current card */}
          <div className="absolute w-full h-full z-10">
            <FlashcardItem
              front={isFlippedOnNext? currentFC?.front ?? "Congratulation! 🎉" : currentFC?.back ?? "You did it!"}
              back={isFlippedOnNext? currentFC?.back ?? "You did it!" : currentFC?.front ?? "Congratulation! 🎉"}
              isFlipped={isFlipped}
              isSwapOn={isFlippedOnNext}
              onFlip={() => {setIsFlipped(!isFlipped); setClicked(true)}}
            />
          </div>

          {/* Animating card */}
          {animatingIndex !== null && (
            <motion.div
              className="absolute w-full h-full z-20"
              initial={{ y: 0 }}
              animate={{ y: 300 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <FlashcardItem
                front={previousIsFlippedOnNext? previousFC?.front ?? "Congratulation! 🎉" : previousFC?.back ?? "You did it!"}
                back={previousIsFlippedOnNext? previousFC?.back ?? "You did it!" : previousFC?.front ?? "Congratulation! 🎉"}
                isFlipped={false}
                disabled={true}
              />
            </motion.div>
          )}
        </div>
      </div>
        <div className="text-sm text-muted-foreground">
          Studied: {reviewProgress} / {reviewLength}
        </div>
      <div className="w-full h-[50px]">
      {(clicked && reviewProgress < reviewLength) &&
        <div className="flex justify-between w-full h-[50px]">
        <Button onClick={handleForgot} disabled={isAnimating} variant="outline">
          <Annoyed/> 
          Forgot
        </Button>


        <Button onClick={handleNext} disabled={isAnimating}>
          <Smile/>
          Remembered
        </Button>
      </div>
      }
      {(reviewProgress === reviewLength) &&
        <Button className="self-center" onClick={()=>{navigate(`/deck/${deckid}`)}}>
          <Smile/>
          Go Back to Deck
        </Button>
      
      }
      </div>
      
    </div>
  </>
  )
}
