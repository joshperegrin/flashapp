import { useState, useEffect, useRef } from "react"
import { GripVertical } from 'lucide-react'
// import * as Jotai from 'jotai'
// import * as DeckStore from '@renderer/state'

import { Button } from "@renderer/components/ui/button"
import {
  Card,
  CardContent,
} from "@renderer/components/ui/card"
import { Textarea } from "@renderer/components/ui/textarea"
import * as Jotai from 'jotai'
import * as DeckStore from "@renderer/state"

export function NewCardsForm() {
  const [selectedDeckID, ] = Jotai.useAtom(DeckStore.selectedDeckIdAtom)
  const [, setIsEditing] = Jotai.useAtom(DeckStore.isEditingAtom)
  const [, newFlashcard] = Jotai.useAtom(DeckStore.addFlashcardAtom)
  const [editString1, setEditString1] = useState<string | undefined>('')
  const [editString2, setEditString2] = useState<string | undefined>('')
  const [string1IsError, setString1IsError] = useState(false)
  const [string2IsError, setString2IsError] = useState(false)

  const string1Ref = useRef<HTMLTextAreaElement>(null)
  const string2Ref = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSave = () => {
    let hasError = false
    if (editString1?.trim() === "") {
      setString1IsError(true)
      hasError = true
    }
    if (editString2?.trim() === "") {
      setString2IsError(true)
      hasError = true
    }
    if (hasError) return
    newFlashcard({deckId: selectedDeckID, front: editString1, back: editString2})
    setIsEditing(false)
    // delete self
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  // Adjust height of textareas
  useEffect(() => {
    const adjustHeight = (el: HTMLTextAreaElement | null) => {
      if (el) {
        el.style.height = "auto"
        el.style.height = el.scrollHeight + "px"
      }
    }
    adjustHeight(string1Ref.current)
    adjustHeight(string2Ref.current)
  }, [editString1, editString2])

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleCancel()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <Card ref={containerRef} className="w-full sm:w-[650px] lg:w-[1000px] hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
            <GripVertical size={16} />
          </div>
          <div className="flex-1 flex items-center gap-2 justify-center">
            <div className="flex items-center gap-2 w-full">

            <Textarea
              ref={string1Ref}
              value={editString1}
              onChange={(e) => {
                setEditString1(e.target.value)
                setString1IsError(false)
              }}
              placeholder="Front"
              className={`flex-1 resize-none overflow-hidden ${string1IsError ? "focus-visible:border-red-500 focus-visible:ring-red-500/50" : ""}`}
              rows={1}
            />
            <Textarea
              ref={string2Ref}
              value={editString2}
              onChange={(e) => {
                setEditString2(e.target.value)
                setString2IsError(false)
              }}
              placeholder="Back"
              className={`flex-1 resize-none overflow-hidden ${string2IsError ? "focus-visible:border-red-500 focus-visible:ring-red-500/50" : ""}`}
              rows={1}
            />
          </div>
        </div>

        <div className="flex flex-col justify-end gap-2">
          <Button onClick={handleSave}>
            Save
          </Button>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
        </div>
      </CardContent>
    </Card>
  )
}
