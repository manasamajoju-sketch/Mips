import { useMemo } from 'react'
import type { ImpactZone } from '../../../types/eventAnalytics'
import { CursorIcon } from '../../common/Icons'
import './ImpactWheel.scss'

interface ImpactWheelProps {
  activeZone: ImpactZone
  activeZonePercent: number
  centerLabel?: string
}

const SIZE = 220
const CENTER = SIZE / 2
const OUTER_R = 96
const STROKE_W = 34
const GAP_DEG = 10
const CIRCUMFERENCE = 2 * Math.PI * OUTER_R

// Order matches the visual layout: top, right, bottom, left
const ZONE_ORDER: { zone: ImpactZone; label: string; angle: number }[] = [
  { zone: 'front', label: 'Front', angle: 0 },
  { zone: 'right', label: 'Right', angle: 90 },
  { zone: 'back', label: 'Back', angle: 180 },
  { zone: 'left', label: 'Left', angle: 270 },
]

function polarToXY(angleDeg: number, radius: number) {
  // 0deg = top, clockwise
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  }
}

export default function ImpactWheel({ activeZone, activeZonePercent, centerLabel = 'Top' }: ImpactWheelProps) {
  const segments = useMemo(() => {
    const segmentAngle = 90 - GAP_DEG
    const dashLength = (segmentAngle / 360) * CIRCUMFERENCE
    return ZONE_ORDER.map(({ zone, label, angle }) => {
      const rotation = angle + GAP_DEG / 2 - 90
      return {
        zone,
        label,
        angle,
        rotation,
        dasharray: `${dashLength} ${CIRCUMFERENCE - dashLength}`,
        isActive: zone === activeZone,
      }
    })
  }, [activeZone])

  const activeZoneMeta = ZONE_ORDER.find((z) => z.zone === activeZone)
  const labelPos = activeZoneMeta ? polarToXY(activeZoneMeta.angle + 45, OUTER_R + STROKE_W / 2 + 6) : null

  return (
    <div className="impact-wheel">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="impact-wheel__svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {segments.map((seg) => (
          <circle
            key={seg.zone}
            cx={CENTER}
            cy={CENTER}
            r={OUTER_R}
            className={`impact-wheel__segment${seg.isActive ? ' impact-wheel__segment--active' : ''}`}
            strokeWidth={STROKE_W}
            strokeDasharray={seg.dasharray}
            transform={`rotate(${seg.rotation} ${CENTER} ${CENTER})`}
          />
        ))}

        <circle cx={CENTER} cy={CENTER} r={OUTER_R - STROKE_W / 2 - 10} className="impact-wheel__core" />

        <text x={CENTER} y={CENTER + 5} textAnchor="middle" className="impact-wheel__core-label">
          {centerLabel}
        </text>

        {ZONE_ORDER.map(({ zone, label, angle }) => {
          const pos = polarToXY(angle, OUTER_R + STROKE_W / 2 + 20)
          return (
            <text
              key={zone}
              x={pos.x}
              y={pos.y + 4}
              textAnchor="middle"
              className="impact-wheel__zone-label"
            >
              {label}
            </text>
          )
        })}
      </svg>

      {labelPos && (
        <div
          className="impact-wheel__callout"
          style={{ left: `${(labelPos.x / SIZE) * 100}%`, top: `${(labelPos.y / SIZE) * 100}%` }}
        >
          <span className="impact-wheel__callout-value">{activeZonePercent}%</span>
          <CursorIcon className="impact-wheel__callout-cursor" />
        </div>
      )}
    </div>
  )
}
