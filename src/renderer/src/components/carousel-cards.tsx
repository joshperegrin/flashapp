import { Card, CardContent } from "@renderer/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@renderer/components/ui/carousel"
import { useState } from "react"

export function CarouselSpacing() {
  const [clicked, setClicked] = useState<boolean[]>([false, false, false, false, false])

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
      
      <Carousel className="max-w-5xl w-full">
        <CarouselContent className="-ml-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem onClick={() => {clickEvent(index)}} key={index} className={`pl-1 md:basis-1/2 lg:basis-1/3 ${clicked[index] ? 'flip-card-flipped' : ''}`}>
              <div className="p-1">
                <div className="flip-card h-48">
                  <div className="flip-card-inner">
                    {/* Front of card */}
                    <div className="flip-card-front">
                      <Card className="h-full">
                        <CardContent className="flex h-full items-center justify-center p-6 rounded-lg">
                          <span className="text-2xl font-semibold">{index + 1}</span>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Back of card */}
                    <div className="flip-card-back">
                      <Card className="h-full">
                        <CardContent className="flex h-full items-center justify-center p-6 rounded-lg">
                          <div className="text-center">
                            <div className="text-lg font-semibold mb-2">Card {index + 1}</div>
                            <div className="text-sm opacity-90">Back Side!</div>
                            <div className="text-xs mt-2">🎉</div>
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
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  )
}
