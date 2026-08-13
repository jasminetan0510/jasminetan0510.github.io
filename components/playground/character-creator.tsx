'use client'

import { RotateCcw, Skull } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { CharacterAvatar } from '@/components/character-avatar'
import {
  DEFAULT_HAIR_BY_BASE,
  EYE_COLORS,
  HAIR_STYLES,
  SHIRT_COLORS,
  clearCharacters,
  loadCharacters,
  saveCharacter,
  type BaseGender,
} from '@/lib/characters'
import { cn } from '@/lib/utils'

function ColorSwatchRow({
  label,
  colors,
  selected,
  onSelect,
}: {
  label: string
  colors: readonly string[]
  selected: string
  onSelect: (color: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="eyebrow text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            aria-pressed={selected === color}
            aria-label={`${label}: ${color}`}
            style={{ backgroundColor: color }}
            className={cn(
              'size-9 rounded-full border-2 transition-transform',
              selected === color
                ? 'border-primary scale-110 ring-2 ring-ring'
                : 'border-border hover:scale-105',
            )}
          />
        ))}
      </div>
    </div>
  )
}

function HairStyleRow({
  selected,
  onSelect,
}: {
  selected: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="eyebrow text-muted-foreground">Hair</p>
      <div className="flex flex-wrap gap-2">
        {HAIR_STYLES.map((style, i) => (
          <button
            key={style.label}
            type="button"
            onClick={() => onSelect(i)}
            aria-pressed={selected === i}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm transition-colors',
              selected === i
                ? 'border-transparent bg-foreground text-background'
                : 'border-input hover:bg-secondary',
            )}
          >
            {style.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function CharacterCreator() {
  const [base, setBase] = useState<BaseGender>('female')
  const [hair, setHair] = useState(DEFAULT_HAIR_BY_BASE.female)
  const [shirtColor, setShirtColor] = useState<string>(SHIRT_COLORS[0])
  const [eyeColor, setEyeColor] = useState<string>(EYE_COLORS[0])

  const [saved, setSaved] = useState(false)
  const [characterCount, setCharacterCount] = useState(0)
  const [destructArmed, setDestructArmed] = useState(false)
  const armedTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    function refreshCount() {
      setCharacterCount(loadCharacters().length)
    }
    refreshCount()
    window.addEventListener('characters-updated', refreshCount)
    return () => window.removeEventListener('characters-updated', refreshCount)
  }, [])

  function handleDestruct() {
    if (!destructArmed) {
      setDestructArmed(true)
      armedTimeoutRef.current = window.setTimeout(
        () => setDestructArmed(false),
        4000,
      )
      return
    }
    if (armedTimeoutRef.current) window.clearTimeout(armedTimeoutRef.current)
    clearCharacters()
    setDestructArmed(false)
  }

  function handleBaseChange(next: BaseGender) {
    setBase(next)
    setHair(DEFAULT_HAIR_BY_BASE[next])
    setSaved(false)
  }

  function randomize() {
    const nextBase: BaseGender = Math.random() < 0.5 ? 'female' : 'male'
    setBase(nextBase)
    setHair(Math.floor(Math.random() * HAIR_STYLES.length))
    setShirtColor(SHIRT_COLORS[Math.floor(Math.random() * SHIRT_COLORS.length)])
    setEyeColor(EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)])
    setSaved(false)
  }

  function handleSave() {
    saveCharacter({ base, hair, shirtColor, eyeColor })
    setSaved(true)
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
      {/* Live preview */}
      <div className="flex shrink-0 flex-col items-center gap-3">
        <div className="flex size-44 items-center justify-center rounded-sm border border-dashed border-input bg-secondary/60">
          <CharacterAvatar
            base={base}
            hair={hair}
            shirtColor={shirtColor}
            eyeColor={eyeColor}
            size={110}
          />
        </div>
        <button
          type="button"
          onClick={randomize}
          className="inline-flex items-center gap-1.5 rounded-full border border-input px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
        >
          <RotateCcw className="size-3" aria-hidden="true" />
          Randomize
        </button>
      </div>

      {/* Customization controls */}
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="eyebrow text-muted-foreground">Base</p>
          <div className="flex gap-2">
            {(['female', 'male'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleBaseChange(option)}
                aria-pressed={base === option}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm capitalize transition-colors',
                  base === option
                    ? 'border-transparent bg-foreground text-background'
                    : 'border-input hover:bg-secondary',
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <HairStyleRow selected={hair} onSelect={setHair} />
        <ColorSwatchRow
          label="Shirt color"
          colors={SHIRT_COLORS}
          selected={shirtColor}
          onSelect={setShirtColor}
        />
        <ColorSwatchRow
          label="Eye color"
          colors={EYE_COLORS}
          selected={eyeColor}
          onSelect={setEyeColor}
        />

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 active:scale-95"
        >
          {saved
            ? 'Saved — look at the bottom of the page!'
            : 'Save my character'}
        </button>

        {characterCount > 0 ? (
          <button
            type="button"
            onClick={handleDestruct}
            className={cn(
              'inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              destructArmed
                ? 'border-destructive bg-destructive text-white'
                : 'border-destructive/40 text-destructive hover:bg-destructive/10',
            )}
          >
            <Skull className="size-3.5" aria-hidden="true" />
            {destructArmed
              ? `Click again to destroy all ${characterCount}`
              : `Destroy all saved characters (${characterCount})`}
          </button>
        ) : null}
      </div>
    </div>
  )
}