import type { ReactElement } from "react"
import { useEffect, useRef, useState } from "react"
import { format, parse } from "date-fns"
import { EventOverflowModal } from "./EventOverflowModal"
import type { CalendarEvent } from "./useEvents"
import "./css/EventList.css"

interface EventListProps {
  events: CalendarEvent[]
  date: Date
  onEventClick: (event: CalendarEvent) => void
}

function formatEventTime(time: string): string {
  return format(parse(time, "HH:mm", new Date()), "h:mm a")
}

export function EventList({
  events,
  date,
  onEventClick,
}: EventListProps): ReactElement {
  const eventListRef = useRef<HTMLDivElement | null>(null)
  const [visibleCount, setVisibleCount] = useState<number>(0)
  const [isOverflowOpen, setIsOverflowOpen] = useState<boolean>(false)
  const dateEvents = events
    .filter(event => event.date === date.toDateString())
    .sort((firstEvent, secondEvent) =>
      Number(secondEvent.allDay) - Number(firstEvent.allDay)
    )

  useEffect(() => {
    const listElement = eventListRef.current

    if (listElement === null) {
      return undefined
    }

    const element = listElement

    function updateVisibleCount(): void {
      const rootFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      )
      const styles = getComputedStyle(element)
      const gap = parseFloat(styles.rowGap) || 0
      const rowHeight = rootFontSize * 0.9
      const moreHeight = rootFontSize * 0.9
      const maxWithoutMore = Math.floor(
        (element.clientHeight + gap) / (rowHeight + gap)
      )
      const nextVisibleCount =
        dateEvents.length > maxWithoutMore
          ? Math.max(
              0,
              Math.floor(
                (element.clientHeight - moreHeight - gap) /
                  (rowHeight + gap)
              )
            )
          : maxWithoutMore

      setVisibleCount(Math.min(dateEvents.length, nextVisibleCount))
    }

    const observer = new ResizeObserver(updateVisibleCount)
    observer.observe(element)
    updateVisibleCount()
    return () => observer.disconnect()
  }, [dateEvents.length])

  const visibleEvents = dateEvents.slice(0, visibleCount)
  const overflowEvents = dateEvents.slice(visibleCount)

  function handleOverflowEventClick(event: CalendarEvent): void {
    setIsOverflowOpen(false)
    onEventClick(event)
  }

  return (
    <div className="event-list" ref={eventListRef}>
      {visibleEvents.map((event, eventIndex) =>
        event.allDay ? (
          <div
            className={`event event-all-day event-${event.color}`}
            key={`${event.name}-${eventIndex}`}
            title={event.name}
            onClick={() => onEventClick(event)}
            onKeyDown={keyboardEvent => {
              if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
                onEventClick(event)
              }
            }}
            role="button"
            tabIndex={0}
          >
            {event.name}
          </div>
        ) : (
          <div
            className={`event event-timed event-${event.color}`}
            key={`${event.name}-${eventIndex}`}
            title={`${formatEventTime(event.startTime)} ${event.name}`}
            onClick={() => onEventClick(event)}
            onKeyDown={keyboardEvent => {
              if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
                onEventClick(event)
              }
            }}
            role="button"
            tabIndex={0}
          >
            <span className="event-dot" />
            <span className="event-time">{formatEventTime(event.startTime)}</span>
            <span className="event-name">{event.name}</span>
          </div>
        )
      )}
      {overflowEvents.length > 0 && (
        <button
          className="more-events"
          type="button"
          onClick={() => setIsOverflowOpen(true)}
        >
          +{overflowEvents.length} More
        </button>
      )}
      {isOverflowOpen && (
        <EventOverflowModal
          date={date}
          events={overflowEvents}
          onClose={() => setIsOverflowOpen(false)}
          onEventClick={handleOverflowEventClick}
        />
      )}
    </div>
  )
}
