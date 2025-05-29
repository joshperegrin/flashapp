import * as React from 'react'
import { useParams } from "react-router-dom";
import { CarouselSpacing } from "@renderer/components/carousel-cards"
import DropdownFilterCards from "@renderer/components/dropdown-filter-cards"
import { Button } from "@renderer/components/ui/button"
import { Searchbox } from "@renderer/components/search-deck"
import { Sparkles, CopyPlus } from "lucide-react";
import { CardWithForm } from "@renderer/components/flashcards"
import { SidebarTrigger } from "@renderer/components/ui/sidebar"
import {Card, CardContent} from "@renderer/components/ui/card"
function DeckPage() {
  const [cards, _] = React.useState([
    { id: '', front: "Front", back: "Back" },
    { id: '', front: "Front", back: "Back" },
    { id: '', front: "Front", back: "Back" },
    { id: '', front: "Front", back: "Back" },
    { id: '', front: "Front", back: "Back" },
    { id: '', front: "Front", back: "Back" },
    { id: '', front: "Front", back: "Back" },
    { id: '', front: "Front", back: "Back" },
  ])

  let { deckname } = useParams()
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

  return (
    <>
      {/* 👁 Invisible Sentinel Above Header */}
      <div ref={stickyRef} />

      {/* Header */}
      <div
        data-stuck={isStuck ? "true" : "false"}
        className="sticky top-0 z-30 w-full flex flex-col justify-center bg-white shadow-sm data-[stuck=false]:rounded-t-xl"
      >
        <header className="h-12 flex items-center border-b pr-4 pl-2 sm:pr-6 lg:pr-8">
          <SidebarTrigger />
          <h1 className="text-base font-medium truncate">{deckname}</h1>
        </header>
      </div>

      {/* Carousel */}
      <div className="w-full flex justify-center mt-4 px-4 sm:px-6 lg:px-8">
        <CarouselSpacing />
      </div>

      {/* Filters and Search */}
      <div className="w-full flex justify-center mb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4 px-4 w-full sm:w-[680px] lg:w-[1050px]">
          <Button size="sm" className="flex items-center gap-1">
            <Sparkles className="size-4" />
            <span>Generate Cards</span>
          </Button>
          <div className="flex flex-col sm:flex-row gap-2">
            <Searchbox />
            <DropdownFilterCards />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-5 items-center mt-4 px-4 sm:px-6 lg:px-8">
        <Card className="w-full sm:w-[650px] lg:w-[1000px] cursor-pointer hover:shadow-md transition-shadow bg-accent items-center">
          <CardContent className="px-4 flex flex-row">
            <CopyPlus/>
            <span className="ml-2">New Card</span>
          </CardContent>
        </Card>
        {cards.map(() => (
          <CardWithForm/>
        ))}
      </div>
    </>
  )
}

export default DeckPage
