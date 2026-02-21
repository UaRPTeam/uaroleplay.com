import {Box, Text} from '@sanity/ui'
import {set, type ObjectInputProps} from 'sanity'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'

const MIN_WIDTH_PERCENT = 20
const MAX_WIDTH_PERCENT = 100
const MIN_OFFSET_X = -400
const MAX_OFFSET_X = 400
const MIN_OFFSET_Y = 0
const MAX_OFFSET_Y = 300

function clampWidth(value: number) {
  return Math.min(MAX_WIDTH_PERCENT, Math.max(MIN_WIDTH_PERCENT, Math.round(value)))
}

function clampOffsetX(value: number) {
  return Math.min(MAX_OFFSET_X, Math.max(MIN_OFFSET_X, Math.round(value)))
}

function clampOffsetY(value: number) {
  return Math.min(MAX_OFFSET_Y, Math.max(MIN_OFFSET_Y, Math.round(value)))
}

export default function BodyImageInput(props: ObjectInputProps<Record<string, unknown>>) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const previewRef = useRef<HTMLDivElement | null>(null)
  const previewImageRef = useRef<HTMLImageElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [previewReady, setPreviewReady] = useState(false)
  const [handleStyle, setHandleStyle] = useState<{top: number; right: number}>({top: 56, right: 12})
  const [guardStyle, setGuardStyle] = useState<{top: number; left: number; width: number; height: number}>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  })
  const dragStartRef = useRef<{x: number; y: number; offsetX: number; offsetY: number} | null>(null)

  const widthPercent = useMemo(() => {
    const raw = props.value?.widthPercent
    return typeof raw === 'number' ? clampWidth(raw) : 100
  }, [props.value])
  const offsetX = useMemo(() => {
    const raw = props.value?.offsetX
    return typeof raw === 'number' ? clampOffsetX(raw) : 0
  }, [props.value])
  const offsetY = useMemo(() => {
    const raw = props.value?.offsetY
    return typeof raw === 'number' ? clampOffsetY(raw) : 0
  }, [props.value])
  const align = ((props.value?.align as string | undefined) ?? 'center') as 'left' | 'center' | 'right'
  const isControlTarget = (target: HTMLElement) =>
    Boolean(
      target.closest('.body-image-resize-handle') ||
        target.closest('.body-image-move-handle') ||
        target.closest('.body-image-align-controls'),
    )

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const rect = previewRef.current?.getBoundingClientRect() ?? wrapperRef.current?.getBoundingClientRect()
      if (!rect || rect.width <= 0) return

      const percentage = ((clientX - rect.left) / rect.width) * 100
      props.onChange(set(clampWidth(percentage), ['widthPercent']))
    },
    [props],
  )

  useEffect(() => {
    const root = wrapperRef.current
    if (!root) return

    const updateHandlePosition = () => {
      const previewEl = previewRef.current
      const rootRect = root.getBoundingClientRect()
      if (!previewEl) {
        setHandleStyle({
          top: 56,
          right: 12,
        })
        setGuardStyle({top: 0, left: 0, width: 0, height: 0})
        return
      }

      const previewRect = previewEl.getBoundingClientRect()
      const nextTop = previewRect.top - rootRect.top + previewRect.height / 2
      const nextRight = rootRect.right - previewRect.right + 12
      const top = Math.max(56, Math.min(rootRect.height - 56, nextTop))
      const right = Math.max(12, Math.min(rootRect.width - 44, nextRight))
      setHandleStyle({top, right})
      setGuardStyle({
        top: Math.max(0, previewRect.top - rootRect.top),
        left: Math.max(0, previewRect.left - rootRect.left),
        width: Math.max(0, previewRect.width),
        height: Math.max(0, previewRect.height),
      })
    }

    const findPreview = () => {
      const images = Array.from(root.querySelectorAll('img')) as HTMLImageElement[]
      const image = images
        .map((candidate) => {
          const rect = candidate.getBoundingClientRect()
          return {
            candidate,
            area: rect.width * rect.height,
          }
        })
        .filter((item) => item.area > 3000)
        .sort((a, b) => b.area - a.area)[0]?.candidate

      if (!image) {
        previewRef.current = null
        previewImageRef.current = null
        setPreviewReady(false)
        updateHandlePosition()
        return
      }

      const host = image.closest('[data-sanity-image-preview]') ?? image.closest('[data-ui]') ?? image.parentElement
      previewRef.current = host as HTMLDivElement | null
      previewImageRef.current = image
      setPreviewReady(Boolean(previewRef.current))
      updateHandlePosition()
    }

    findPreview()
    const observer = new MutationObserver(findPreview)
    observer.observe(root, {childList: true, subtree: true})
    const resizeObserver = new ResizeObserver(() => updateHandlePosition())
    if (previewRef.current) {
      resizeObserver.observe(previewRef.current)
    }
    window.addEventListener('resize', updateHandlePosition)
    window.addEventListener('scroll', updateHandlePosition, true)

    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateHandlePosition)
      window.removeEventListener('scroll', updateHandlePosition, true)
    }
  }, [])

  useEffect(() => {
    const image = previewImageRef.current
    const preview = previewRef.current
    if (!image) return

    if (preview) {
      preview.style.width = `${widthPercent}%`
      preview.style.maxWidth = '100%'
      preview.style.marginTop = `${offsetY}px`
      preview.style.marginBottom = '1rem'
      preview.style.transition = 'width 120ms ease, margin-top 120ms ease'
    }

    image.style.width = '100%'
    image.style.maxWidth = '100%'
    image.style.height = 'auto'
    image.style.display = 'block'
    image.style.transform = `translateX(${offsetX}px)`
    image.style.transition = 'transform 120ms ease'
    image.style.marginTop = '0'

    if (align === 'left') {
      if (preview) {
        preview.style.float = 'left'
        preview.style.marginLeft = '0'
        preview.style.marginRight = '1rem'
      }
    } else if (align === 'right') {
      if (preview) {
        preview.style.float = 'right'
        preview.style.marginRight = '0'
        preview.style.marginLeft = '1rem'
      }
    } else {
      if (preview) {
        preview.style.float = 'none'
        preview.style.marginLeft = 'auto'
        preview.style.marginRight = 'auto'
      }
    }
  }, [align, offsetX, offsetY, widthPercent])

  useEffect(() => {
    if (!isDragging) return

    const onMove = (event: MouseEvent) => {
      updateFromClientX(event.clientX)
    }
    const onUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isDragging, updateFromClientX])

  useEffect(() => {
    if (!isMoving) return

    const onMove = (event: MouseEvent) => {
      const start = dragStartRef.current
      if (!start) return

      const nextOffsetX = clampOffsetX(start.offsetX + (event.clientX - start.x))
      const nextOffsetY = clampOffsetY(start.offsetY + (event.clientY - start.y))
      props.onChange([set(nextOffsetX, ['offsetX']), set(nextOffsetY, ['offsetY'])])
    }

    const onUp = () => {
      setIsMoving(false)
      dragStartRef.current = null
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isMoving, props])

  return (
    <Box>
      <div
        className="body-image-input"
        ref={wrapperRef}
        onMouseDownCapture={(event) => {
          const target = event.target as HTMLElement
          if (!previewReady || isControlTarget(target)) {
            return
          }
          event.preventDefault()
          event.stopPropagation()
        }}
        onClickCapture={(event) => {
          const target = event.target as HTMLElement
          if (!previewReady || isControlTarget(target)) {
            return
          }
          event.preventDefault()
          event.stopPropagation()
        }}
        onDoubleClickCapture={(event) => {
          const target = event.target as HTMLElement
          if (!previewReady || isControlTarget(target)) {
            return
          }
          event.preventDefault()
          event.stopPropagation()
        }}
      >
        {props.renderDefault(props)}
        {previewReady && guardStyle.width > 0 && guardStyle.height > 0 && (
          <div
            className="body-image-click-guard"
            style={{
              top: `${guardStyle.top}px`,
              left: `${guardStyle.left}px`,
              width: `${guardStyle.width}px`,
              height: `${guardStyle.height}px`,
            }}
            onMouseDown={(event) => {
              event.preventDefault()
              event.stopPropagation()
            }}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
            }}
          />
        )}
        <button
          type="button"
          className="body-image-resize-handle"
          style={{top: `${handleStyle.top}px`, right: `${handleStyle.right}px`}}
          aria-label="Змінити ширину зображення"
          title="Потягніть, щоб змінити ширину зображення"
          onMouseDown={(event) => {
            event.preventDefault()
            setIsDragging(true)
            updateFromClientX(event.clientX)
          }}
        >
          ↔
        </button>
        <div
          className="body-image-align-controls"
          role="group"
          aria-label="Вирівнювання зображення"
          style={{top: `${handleStyle.top - 40}px`, right: `${handleStyle.right}px`}}
        >
          {[
            {label: 'L', value: 'left'},
            {label: 'C', value: 'center'},
            {label: 'R', value: 'right'},
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              className={`body-image-align-button ${align === item.value ? 'is-active' : ''}`}
              onClick={() => props.onChange(set(item.value, ['align']))}
              aria-label={`Вирівняти ${item.value}`}
              title={`Вирівняти ${item.value}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="body-image-move-handle"
          style={{top: `${handleStyle.top + 40}px`, right: `${handleStyle.right}px`}}
          aria-label="Перетягнути зображення в body"
          title="Потягніть, щоб змінити позицію зображення"
          onMouseDown={(event) => {
            event.preventDefault()
            dragStartRef.current = {
              x: event.clientX,
              y: event.clientY,
              offsetX,
              offsetY,
            }
            setIsMoving(true)
          }}
        >
          ✥
        </button>
        <div className="body-image-size-badge">{widthPercent}%</div>
        <div className="body-image-position-badge">
          X: {offsetX} Y: {offsetY}
        </div>
      </div>
      <Text size={1} muted>
        {previewReady
          ? 'Працюйте прямо в body: ↔ змінює ширину, ✥ перетягує позицію.'
          : 'Завантажте або відкрийте зображення, після цього з’являться ↔ та ✥.'}
      </Text>
    </Box>
  )
}
