"use client"

import { Button } from "@/components/ui/button"

interface KeypadProps {
  onNumberClick: (number: string) => void
  onClear: () => void
  onEnter: () => void
}

export function Keypad({ onNumberClick, onClear, onEnter }: KeypadProps) {
  const numbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["0", "00", "."],
  ]

  return (
    <div className="grid grid-cols-3 gap-2 p-4">
      {numbers.flat().map((num) => (
        <Button
          key={num}
          variant="outline"
          size="lg"
          className="h-12 text-lg font-semibold bg-transparent"
          onClick={() => onNumberClick(num)}
        >
          {num}
        </Button>
      ))}
      <Button variant="destructive" size="lg" className="h-12 text-lg font-semibold" onClick={onClear}>
        Clear
      </Button>
      <Button
        variant="default"
        size="lg"
        className="h-12 text-sm font-semibold col-span-2 whitespace-nowrap"
        onClick={onEnter}
      >
        Add to Cart
      </Button>
    </div>
  )
}
