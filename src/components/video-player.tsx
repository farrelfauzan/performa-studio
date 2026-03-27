import { useEffect, useRef } from 'react'
import Hls from 'hls.js'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

interface VideoPlayerProps {
  src: string
  className?: string
  autoPlay?: boolean
  onClose?: () => void
}

export function VideoPlayer({
  src,
  className = '',
  autoPlay = false,
  onClose,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const plyrRef = useRef<Plyr | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    if (src.includes('.m3u8') && Hls.isSupported()) {
      const hls = new Hls()
      hlsRef.current = hls
      hls.loadSource(src)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        const availableQualities = data.levels.map((l) => l.height)

        // Initialize Plyr with quality options from HLS levels
        const player = new Plyr(video, {
          controls: [
            'play-large',
            'play',
            'progress',
            'current-time',
            'mute',
            'volume',
            'settings',
            'fullscreen',
          ],
          settings: ['quality', 'speed'],
          quality: {
            default: 0, // 0 = auto
            options: [0, ...availableQualities],
            forced: true,
            onChange: (quality: number) => {
              if (quality === 0) {
                hls.currentLevel = -1 // auto
              } else {
                const levelIndex = data.levels.findIndex(
                  (l) => l.height === quality,
                )
                if (levelIndex !== -1) {
                  hls.currentLevel = levelIndex
                }
              }
            },
          },
          i18n: {
            qualityLabel: {
              0: 'Auto',
            },
          },
        })
        plyrRef.current = player

        if (autoPlay) video.play()
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      const player = new Plyr(video, {
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'mute',
          'volume',
          'settings',
          'fullscreen',
        ],
        settings: ['speed'],
      })
      plyrRef.current = player
      video.src = src
      if (autoPlay) video.play()
    } else {
      // Fallback for non-HLS sources
      const player = new Plyr(video, {
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'mute',
          'volume',
          'settings',
          'fullscreen',
        ],
        settings: ['speed'],
      })
      plyrRef.current = player
      video.src = src
      if (autoPlay) video.play()
    }

    return () => {
      if (plyrRef.current) {
        plyrRef.current.destroy()
        plyrRef.current = null
      }
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [src, autoPlay])

  return (
    <div className={`relative ${className}`}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/80 transition-colors hover:bg-black/80 hover:text-white"
        >
          ✕
        </button>
      )}
      <video ref={videoRef} className="aspect-video w-full rounded-lg" />
    </div>
  )
}
