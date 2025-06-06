import * as React from "react"
import { useState } from "react"
import { GripVertical, Edit, Star } from 'lucide-react'
import * as Jotai from 'jotai'
import * as DeckStore from '@renderer/state'

import { Button } from "@renderer/components/ui/button"
import {
  Card,
  CardContent,
} from "@renderer/components/ui/card"
// Import Textarea instead of Input
import { Textarea } from "@renderer/components/ui/textarea"

export function CardWithForm({ flashcard_id, isSelected, onSelect }: { flashcard_id: string, isSelected?: boolean, onSelect: Function } ) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [flashcard, setFlashcard] = Jotai.useAtom(DeckStore.getFlashcardAtomByID(flashcard_id))
  console.log(flashcard?.id, ",  ", flashcard?.front, flashcard_id, " hello ")
  const [isEditing, setIsEditing] = useState(false)
  const [editString1, setEditString1] = useState<string | undefined>(flashcard?.front)
  const [editString2, setEditString2] = useState<string | undefined>(flashcard?.back)
  const [isStarred, setIsStarred] = useState(false)
  const [focusedField, setFocusedField] = useState<"Front" | "Back" | null>(null)
  const [string1IsError, setString1IsError] = useState(false)
  const [string2IsError, setString2IsError] = useState(false)
  const string1Ref = React.useRef<HTMLTextAreaElement>(null)
  const string2Ref = React.useRef<HTMLTextAreaElement>(null)

  const handleDoubleClick = (target: "Front" | "Back") => {
    setIsEditing(true)
    setEditString1(flashcard?.front)
    setEditString2(flashcard?.back)
    setFocusedField(target)
  }

  const handleSave = () => {
    let hasError = false;

    if (editString1?.trim() === "") {
      setString1IsError(true);
      hasError = true;
    }

    if (editString2?.trim() === "") {
      setString2IsError(true);
      hasError = true;
    }

    if (hasError) return;

    setFlashcard({
      front: editString1!.trim(),
      back: editString2!.trim()
    });
    setIsEditing(false);
    setFocusedField(null);
  };  
  const handleCancel = () => {
    setEditString1(flashcard?.front)
    setEditString2(flashcard?.back)
    setIsEditing(false)
    setFocusedField(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { // allow Shift+Enter for new line
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  React.useEffect(() => {
    if (isEditing) {
      if (focusedField === "Front") {
        string1Ref.current?.focus()
      } else if (focusedField === "Back") {
        string2Ref.current?.focus()
      }
    }
  }, [isEditing, focusedField])

  React.useEffect(() => {
    const adjustHeight = (el: HTMLTextAreaElement | null) => {
      if (el) {
        el.style.height = "auto" // reset height to shrink if needed
        el.style.height = el.scrollHeight + "px"
      }
    }
    adjustHeight(string1Ref.current)
    adjustHeight(string2Ref.current)
  }, [editString1, editString2])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditing &&
        cardRef.current &&
        !cardRef.current.contains(event.target as Node)
      ) {
        handleCancel()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isEditing])

  return (
    <Card ref={cardRef} className={`w-full sm:w-[650px] lg:w-[1000px] cursor-pointer hover:shadow-md transition-shadow ${isSelected ? 'border-2 border-blue-500 bg-blue-50': ''}`} onClick={onSelect}>
      <CardContent className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {/* Handlebar */}
          <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
            <GripVertical size={16} />
          </div>

          {/* Content */}
          <div className="flex-1 flex items-center gap-2 justify-center">
            {isEditing ? (
              <div className="flex items-center gap-2 w-full">
                <Textarea
                  ref={string1Ref}
                  value={editString1}
                  onChange={(e) => {setEditString1(e.target.value); setString1IsError(false)}}
                  onKeyDown={handleKeyDown}
                  className={`flex-1 resize-none overflow-hidden ${string1IsError ? "focus-visible:border-red-500 focus-visible:ring-red-500/50" : ""}`}
                  rows={1}
                />
                <Textarea
                  ref={string2Ref}
                  value={editString2}
                  onChange={(e) => {setEditString2(e.target.value); setString2IsError(false)}}
                  onKeyDown={handleKeyDown}
                  className={`flex-1 resize-none overflow-hidden ${string2IsError ? "focus-visible:border-red-500 focus-visible:ring-red-500/50" : ""}`}
                  rows={1}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <span className="flex-1 font-medium align" onDoubleClick={() => {handleDoubleClick("Front")}}>{flashcard?.front}</span>
                <span className="flex-1 text-gray-600 box-border border-l-2 pl-4" onDoubleClick={() => {handleDoubleClick("Back")}}>{flashcard?.back}</span>
              </div>
            )}
          </div>

          {/* Action Icons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                  setEditString1(flashcard?.front)
                  setEditString2(flashcard?.back)
                }}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <Edit size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsStarred(!isStarred)
                }}
                className={`h-8 w-8 p-0 hover:bg-gray-100 ${isStarred ? 'text-yellow-500' : ''}`}
              >
                <Star size={14} fill={isStarred ? 'currentColor' : 'none'} />
              </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
