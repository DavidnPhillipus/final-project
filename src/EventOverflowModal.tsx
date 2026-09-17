import type {
  AnimationEvent as ReactAnimationEvent,
  ReactElement,
} from "react"
import { useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import type { CalendarEvent } from "./useEvents"
import "./css/EventOverflowModal.css"

interface EventOverflowModalProps {
  date: Date
  events: CalendarEvent[]
  onClose: () => void
  onEventClick: (event: CalendarEvent) => void
}

export function EventOverflowModal({
  date,
  events,
  onClose,
  onEventClick,
}: EventOverflowModalProps): ReactElement {
  const [isClosing, setIsClosing] = useState(false)
  const selectedEventRef = useRef<CalendarEvent | null>(null)

  useEffect(() => {
    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        requestClose()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  function requestClose(): void {
    if (!isClosing) setIsClosing(true)
  }

  function finishClose(event: ReactAnimationEvent<HTMLDivElement>): void {
    if (
      event.target !== event.currentTarget ||
      event.animationName !== "overflow-backdrop-out"
    ) {
      return
    }
    if (selectedEventRef.current) onEventClick(selectedEventRef.current)
    else onClose()
  }

  return (
    <div
      className={`overflow-modal-backdrop ${isClosing ? "is-closing" : ""}`}
      onMouseDown={requestClose}
      onAnimationEnd={finishClose}
    >
      <div
        className="overflow-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="overflow-modal-title"
        onMouseDown={event => event.stopPropagation()}
      >
        <div className="overflow-modal-header">
          <h2 id="overflow-modal-title">{format(date, "MMMM do, yyyy")}</h2>
          <button
            type="button"
            aria-label="Close overflow modal"
            onClick={requestClose}
          >
            &times;
          </button>
        </div>
        <div className="overflow-event-list">
          {events.map(event => (
            <button
              className={`overflow-event overflow-event-${event.color}`}
              key={event.id}
              type="button"
              onClick={() => {
                selectedEventRef.current = event
                setIsClosing(true)
              }}
            >
              <span>{event.name}</span>
              {!event.allDay && <small>{event.startTime}</small>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
