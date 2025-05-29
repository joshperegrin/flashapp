import { Card, CardContent } from "@renderer/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@renderer/components/ui/carousel"
import { useState } from "react"
import * as Jotai from 'jotai'
import * as DeckStore from '@renderer/state'

export function CarouselSpacing() {
  const [clicked, setClicked] = useState<boolean[]>([false, false, false, false, false])
  const [deck, ] = Jotai.useAtom(DeckStore.selectedDeckAtom)
  const clickEvent = (index: number) => {
    setClicked((prev) =>
      prev.map((val, i) => (i === index ? !val : val))
    );
  };

  return (
    <>
      <style>{`
        .flip-card {
          perspective: 1000px;
        }
        
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        
        .flip-card-flipped .flip-card-inner {
          transform: rotateY(180deg);
        }
        
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        
        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
      
      <Carousel className="w-full max-w-full sm:max-w-5xl">
        <CarouselContent className="-ml-1">
          {deck?.flashcards.map((flashcard, index) => (
            <CarouselItem onClick={() => {clickEvent(index)}} key={index} className={`pl-1 sm:basis-1/2 md:basis-1/2 lg:basis-1/3 ${clicked[index] ? 'flip-card-flipped' : ''}`}>
              <div className="p-1">
                <div className="flip-card h-48">
                  <div className="flip-card-inner">
                    {/* Front of card */}
                    <div className="flip-card-front">
                      <Card className="h-full">
                        <CardContent className="flex h-full items-center justify-center p-6 rounded-lg">
                          <span className="text-xl font-semibold">{flashcard.front}</span>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Back of card */}
                    <div className="flip-card-back">
                      <Card className="h-full bg-gray-50">
                        <CardContent className="flex h-full items-center justify-center p-6 rounded-lg">
                          <div className="text-center">
                            <div className="text-md">{flashcard.back}</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      <CarouselPrevious className="hidden sm:flex sm:absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10" />
      <CarouselNext className="hidden sm:flex sm:absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10" />
    </Carousel>
    </>
  )
}
