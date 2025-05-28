import { useParams } from "react-router-dom";
import { CarouselSpacing } from "@renderer/components/carousel-cards"
function DeckPage(){
  let { deckname } = useParams()
  return (
    <>
      <div className="w-full flex flex-col justify-center">
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <h1 className="text-base font-medium">{deckname}</h1>
          </div>
        </header>
      </div>
      <div className="w-full flex justify-center mt-4">
        <CarouselSpacing />
      </div>
    </>
  )
}

export default DeckPage
