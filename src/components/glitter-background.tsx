import { useEffect, useState } from 'react'

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

export function GlitterBackground() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles: Sparkle[] = []
      for (let i = 0; i < 50; i++) {
        newSparkles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          delay: Math.random() * 3,
          duration: Math.random() * 2 + 1,
        })
      }
      setSparkles(newSparkles)
    }

    generateSparkles()
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -m-8">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute rounded-full bg-white animate-sparkle shadow-[0_0_6px_2px_rgba(255,255,255,0.8)]"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
