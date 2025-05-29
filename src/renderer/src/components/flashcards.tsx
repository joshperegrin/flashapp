import * as React from "react"
import { useState } from "react"
import { GripVertical, Edit, Star } from 'lucide-react'

import { Button } from "@renderer/components/ui/button"
import {
  Card,
  CardContent,
} from "@renderer/components/ui/card"
// Import Textarea instead of Input
import { Textarea } from "@renderer/components/ui/textarea"

export function CardWithForm() {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [string1, setString1] = useState("Project Name")
  const [string2, setString2] = useState("Mitochondria is the powerhouse of the cell, it also is the mitochondira")
  const [isEditing, setIsEditing] = useState(false)
  const [editString1, setEditString1] = useState(string1)
  const [editString2, setEditString2] = useState(string2)
  const [isStarred, setIsStarred] = useState(false)
  const [focusedField, setFocusedField] = useState<"Front" | "Back" | null>(null)
  const string1Ref = React.useRef<HTMLTextAreaElement>(null)
  const string2Ref = React.useRef<HTMLTextAreaElement>(null)

  const handleDoubleClick = (target: "Front" | "Back") => {
    setIsEditing(true)
    setEditString1(string1)
    setEditString2(string2)
    setFocusedField(target)
  }

  const handleSave = () => {
    setString1(editString1)
    setString2(editString2)
    setIsEditing(false)
    setFocusedField(null)
  }
  
  const handleCancel = () => {
    setEditString1(string1)
    setEditString2(string2)
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
    <Card ref={cardRef} className="sm:w-[650px] lg:w-[1000px] cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="px-4">
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
                  onChange={(e) => setEditString1(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 resize-none overflow-hidden"
                  rows={1}
                />
                <Textarea
                  ref={string2Ref}
                  value={editString2}
                  onChange={(e) => setEditString2(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 resize-none overflow-hidden"
                  rows={1}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <span className="flex-1 font-medium align" onDoubleClick={() => {handleDoubleClick("Front")}}>{string1}</span>
                <span className="flex-1 text-gray-600 box-border border-l-2 pl-4" onDoubleClick={() => {handleDoubleClick("Back")}}>{string2}</span>
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
                  setEditString1(string1)
                  setEditString2(string2)
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
