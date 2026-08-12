'use client'

import { RotateCcw, Skull } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
  ACCESSORY_OPTIONS,
  BASE_OPTIONS,
  HAIR_OPTIONS,
  OUTFIT_OPTIONS,
  clearCharacters,
  loadCharacters,
  saveCharacter,
} from '@/lib/characters'
import { cn } from '@/lib/utils'

type LayerName = 'base' | 'hair' | 'outfit' | 'accessory'

function SwatchRow({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string
  options: (string | null)[]
  selected: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="eyebrow text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            aria-pressed={selected === i}
            aria-label={src ? `${label} option ${i}` : `No ${label.toLowerCase()}`}
            className={cn(
              'flex size-11 items-center justify-center rounded-sm border bg-card transition-colors',
              selected === i
                ? 'border-primary ring-2 ring-ring'
                : 'border-border hover:bg-secondary',
            )}
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                className="size-8 [image-rendering:pixelated]"
              />
            ) : (
              <span className="text-xs text-muted-foreground">none</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export function CharacterCreator() {
  const [layers, setLayers] = useState<Record<LayerName, number>>({
    base: 0,
    hair: 1,
    outfit: 0,
    accessory: 0,
  })
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
      // Auto-disarm after a few seconds so an accidental second click
      // later (unrelated to this) can't trigger a delete.
      armedTimeoutRef.current = window.setTimeout(() => setDestructArmed(false), 4000)
      return
    }
    if (armedTimeoutRef.current) window.clearTimeout(armedTimeoutRef.current)
    clearCharacters()
    setDestructArmed(false)
  }

  function setLayer(name: LayerName, index: number) {
    setLayers((prev) => ({ ...prev, [name]: index }))
    setSaved(false)
  }

  function randomize() {
    setLayers({
      base: Math.floor(Math.random() * BASE_OPTIONS.length),
      hair: Math.floor(Math.random() * HAIR_OPTIONS.length),
      outfit: Math.floor(Math.random() * OUTFIT_OPTIONS.length),
      accessory: Math.floor(Math.random() * ACCESSORY_OPTIONS.length),
    })
    setSaved(false)
  }

  function handleSave() {
    saveCharacter(layers)
    setSaved(true)
  }

  const previewLayers = [
    BASE_OPTIONS[layers.base],
    OUTFIT_OPTIONS[layers.outfit],
    HAIR_OPTIONS[layers.hair],
    ACCESSORY_OPTIONS[layers.accessory],
  ].filter((src): src is string => Boolean(src))

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
      {/* Live preview */}
      <div className="flex shrink-0 flex-col items-center gap-3">
        <div className="relative size-32 overflow-hidden rounded-sm border border-dashed border-input bg-secondary/60">
          {previewLayers.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              className="absolute inset-0 size-full [image-rendering:pixelated]"
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={randomize}
            className="inline-flex items-center gap-1.5 rounded-full border border-input px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
          >
            <RotateCcw className="size-3" aria-hidden="true" />
            Randomize
          </button>
        </div>
      </div>

      {/* Customization controls */}
      <div className="flex flex-1 flex-col gap-4">
        <SwatchRow
          label="Skin tone"
          options={BASE_OPTIONS}
          selected={layers.base}
          onSelect={(i) => setLayer('base', i)}
        />
        <SwatchRow
          label="Hair"
          options={HAIR_OPTIONS}
          selected={layers.hair}
          onSelect={(i) => setLayer('hair', i)}
        />
        <SwatchRow
          label="Outfit"
          options={OUTFIT_OPTIONS}
          selected={layers.outfit}
          onSelect={(i) => setLayer('outfit', i)}
        />
        <SwatchRow
          label="Accessory"
          options={ACCESSORY_OPTIONS}
          selected={layers.accessory}
          onSelect={(i) => setLayer('accessory', i)}
        />

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 active:scale-95"
        >
          {saved ? 'Saved — look at the bottom of the page!' : 'Save my character'}
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