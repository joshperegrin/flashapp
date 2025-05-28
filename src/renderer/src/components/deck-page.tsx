import { useParams } from "react-router-dom";

function DeckPage(){
  let { deckname } = useParams()
  return (
    <>
      {deckname}
    </>
  )
}

export default DeckPage
