import type { CSSProperties } from 'react'
import styles from './ImpactPoint.module.scss'

export type ImpactPointSectionKey = 'front' | 'left' | 'top' | 'right' | 'back'

export type ImpactPointSection = {
  key: ImpactPointSectionKey
  label: string
  value?: number
  color?: string
  hoverColor?: string
}

type Props = {
  sections: ImpactPointSection[]
  className?: string
  fillColor?: string
  hoverFillColor?: string
  showLabels?: boolean
  showPercentOnHover?: boolean
  alwaysShowPercent?: boolean
  onSectionClick?: (section: ImpactPointSection) => void
}

const defaultSections: ImpactPointSection[] = [
  {
    key: 'front',
    label: 'Front',
    value: 0,
  },
  {
    key: 'left',
    label: 'Left',
    value: 0,
  },
  {
    key: 'top',
    label: 'Top',
    value: 0,
  },
  {
    key: 'right',
    label: 'Right',
    value: 0,
  },
  {
    key: 'back',
    label: 'Back',
    value: 0,
  },
]

const labelPositions: Record<
  ImpactPointSectionKey,
  {
    x: number
    y: number
    textAnchor: 'start' | 'middle' | 'end'
  }
> = {
  front: {
    x: 51,
    y: -12,
    textAnchor: 'middle',
  },
  left: {
    x: -20,
    y: 67,
    textAnchor: 'middle',
  },
  top: {
    x: 51,
    y: 67,
    textAnchor: 'middle',
  },
  right: {
    x: 124,
    y: 67,
    textAnchor: 'middle',
  },
  back: {
    x: 51,
    y: 140,
    textAnchor: 'middle',
  },
}

const percentPositions: Record<
  ImpactPointSectionKey,
  {
    x: number
    y: number
    textAnchor: 'start' | 'middle' | 'end'
  }
> = {
  front: {
    x: 51,
    y: 20,
    textAnchor: 'middle',
  },
  left: {
    x: 12,
    y: 67,
    textAnchor: 'middle',
  },
  top: {
    x: 51,
    y: 67,
    textAnchor: 'middle',
  },
  right: {
    x: 90,
    y: 67,
    textAnchor: 'middle',
  },
  back: {
    x: 51,
    y: 112,
    textAnchor: 'middle',
  },
}

function getSection(sections: ImpactPointSection[], key: ImpactPointSectionKey) {
  return sections.find((section) => section.key === key) || defaultSections.find((section) => section.key === key)
}

function getPercentLabel(value?: number) {
  if (value == null) return ''

  return `${Math.round(value)}%`
}

function ImpactPoint({
  sections,
  className = '',
  fillColor = 'var(--blue-primary)',
  hoverFillColor = 'rgba(255, 255, 255, 0.28)',
  showLabels = true,
  showPercentOnHover = true,
  alwaysShowPercent = false,
  onSectionClick,
}: Props) {
  const resolvedSections = defaultSections.map((section) => ({
    ...section,
    ...sections.find((item) => item.key === section.key),
  }))

  const renderSection = (key: ImpactPointSectionKey, path: string, type: 'ellipse' | 'path' = 'path') => {
    const section = getSection(resolvedSections, key)
    const labelPosition = labelPositions[key]
    const percentPosition = percentPositions[key]
    const sectionColor = section?.color || fillColor
    const sectionHoverColor = section?.hoverColor || hoverFillColor
    const isClickable = Boolean(onSectionClick)

    const commonProps = {
      className: styles['impact-point__section-shape'],
      style: {
        '--impact-point-section-color': sectionColor,
        '--impact-point-section-hover-color': sectionHoverColor,
      } as CSSProperties,
    }

    const sectionClassName = [
      styles['impact-point__section'],
      styles[`impact-point__section--${key}`],
      isClickable ? styles['impact-point__section--clickable'] : '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <g
        className={sectionClassName}
        onClick={onSectionClick && section ? () => onSectionClick(section) : undefined}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={
          isClickable && section
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSectionClick?.(section)
                }
              }
            : undefined
        }
      >
        {type === 'ellipse' ? (
          <ellipse {...commonProps} cx="50.9664" cy="66.7006" rx="27.1402" ry="32.4359" />
        ) : (
          <path {...commonProps} d={path} />
        )}

        {showLabels && (
          <text
            className={styles['impact-point__label']}
            x={labelPosition.x}
            y={labelPosition.y}
            textAnchor={labelPosition.textAnchor}
          >
            {section?.label}
          </text>
        )}

        {showPercentOnHover && section?.value != null && (
          <text
            className={`${styles['impact-point__percentage']} ${alwaysShowPercent ? styles['impact-point__percentage--visible'] : ''}`}
            x={percentPosition.x}
            y={percentPosition.y}
            textAnchor={percentPosition.textAnchor}
            dominantBaseline="central"
            style={{
              fill: 'var(--text-primary)',
              stroke: 'var(--text-primary)',
              ...(alwaysShowPercent ? { opacity: 1, transform: 'translateY(0)' } : {}),
            }}
          >
            {getPercentLabel(section.value)}
          </text>
        )}
      </g>
    )
  }

  return (
    <div className={[styles['impact-point'], className].filter(Boolean).join(' ')}>
      <svg
        className={styles['impact-point__svg']}
        width="102"
        height="128"
        viewBox="-20 -14 142 156"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderSection('top', '', 'ellipse')}

        {renderSection(
          'left',
          'M26.3371 42.0664C27.7214 43.4508 27.8785 45.6227 26.8992 47.3179C23.7101 52.8383 21.8446 59.5115 21.8446 66.7001C21.8446 73.3672 23.4498 79.5908 26.2269 84.8627C27.1076 86.5346 26.9104 88.6136 25.5741 89.9498L14.4701 101.054C12.6828 102.841 9.70092 102.544 8.47348 100.335C3.11944 90.6973 0 79.1341 0 66.7001C0 53.6363 3.44286 41.5333 9.30343 31.6155C10.5681 29.4754 13.4936 29.2229 15.2513 30.9807L26.3371 42.0664Z',
        )}

        {renderSection(
          'front',
          'M50.9707 0C65.0763 0 77.8434 11.8395 87.0719 23.6228C88.2936 25.1826 88.1224 27.4015 86.7214 28.8025L75.4654 40.0586C73.7716 41.7524 70.9915 41.5656 69.2591 39.9114C64.26 35.1377 57.8984 32.2783 50.9707 32.2783C44.1789 32.2783 37.9305 35.026 32.9771 39.6318C31.2395 41.2473 28.4919 41.4131 26.8142 39.7355L15.5223 28.4435C14.1127 27.0339 13.9493 24.7982 15.1901 23.2381C24.3926 11.6673 37.0279 0 50.9707 0Z',
        )}

        {renderSection(
          'back',
          'M50.9707 127.6C65.5832 127.6 78.7587 120.253 88.0524 108.482C89.256 106.957 89.0562 104.786 87.6829 103.412L76.5373 92.2667C74.7913 90.5207 71.906 90.7777 70.1941 92.5571C65.0651 97.8881 58.3381 101.122 50.9707 101.122C43.7386 101.122 37.1227 98.0063 32.0303 92.8494C30.3113 91.1086 27.4584 90.8737 25.7285 92.6036L14.5512 103.781C13.1693 105.163 12.9769 107.351 14.2011 108.875C23.4765 120.416 36.5213 127.6 50.9707 127.6Z',
        )}

        {renderSection(
          'right',
          'M101.941 66.7001C101.941 53.8303 98.5997 41.8933 92.8971 32.0592C91.6437 29.8976 88.7006 29.6314 86.9338 31.3983L75.8447 42.4874C74.4752 43.8568 74.3054 45.9999 75.2538 47.6883C78.3138 53.1357 80.0968 59.6717 80.0968 66.7001C80.0968 73.2059 78.5691 79.2899 75.9151 84.4791C75.064 86.1431 75.2728 88.194 76.5943 89.5156L87.706 100.627C89.5023 102.424 92.5015 102.113 93.717 99.8821C98.9186 90.3361 101.941 78.94 101.941 66.7001Z',
        )}
      </svg>
    </div>
  )
}

export default ImpactPoint