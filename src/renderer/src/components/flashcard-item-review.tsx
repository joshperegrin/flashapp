"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@renderer/components/ui/card"

interface FlashcardItemProps {
  front: string
  back: string
  disabled?: boolean
  isFlipped: boolean
  isSwapOn?: boolean
  onFlip?: () => void
}

export function FlashcardItem({ front, back, disabled = false, isFlipped, isSwapOn = false, onFlip }: FlashcardItemProps) {
  const handleFlip = () => {
    if (!disabled && onFlip) {
      onFlip()
    }
  }

  return (
    <div className="relative w-full h-full cursor-pointer" onClick={handleFlip}>
      <motion.div
        className="w-full h-full relative"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
      >
        {/* Front */}
        <Card
          className="absolute w-full h-full flex items-center justify-center p-6"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        >
          <CardContent className="p-0 flex items-center justify-center h-full">
            <p className={`text-xl text-center ${isSwapOn? "font-medium" : ""}`}>{front}</p>
          </CardContent>
        </Card>

        {/* Back */}
        <Card
          className="absolute w-full h-full flex items-center justify-center p-6"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardContent className="p-0 flex items-center justify-center h-full">
            <p className={`text-xl ${isSwapOn? "" : "font-medium"} text-center`}>{back}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
