import type { ReactElement } from "react"
import {
  format,
  isBefore,
  isSameMonth,
  isToday,
  startOfToday,
} from "date-fns"
import { EventList } from "./EventList"
import type { CalendarEvent } from "./useEvents"

interface CalendarDayProps {
  date: Date
  index: number
  visibleMonth: Date
  events: CalendarEvent[]
  onAddEvent: (date: Date) => void
  onEventClick: (event: CalendarEvent, date: Date) => void
}

export function CalendarDay({
  date,
  index,
  visibleMonth,
  events,
  onAddEvent,
  onEventClick,
}: CalendarDayProps): ReactElement {
  const isPastDate =
    isSameMonth(date, visibleMonth) && isBefore(date, startOfToday())

  return (
    <div
      className={`date ${
        !isSameMonth(date, visibleMonth) && "date-picker-other-month-date"
      } ${isPastDate && "date-past"} ${isToday(date) && "today"}`}
      key={date.toDateString()}
    >
      <button
        className="add-event-button"
        type="button"
        aria-label={`Add event on ${format(date, "MMMM do, yyyy")}`}
        onClick={() => onAddEvent(date)}
      >
        +
      </button>
      {index < 7 && (
        <span className="date-weekday">{format(date, "EEE")}</span>
      )}
      <span className="date-number">{date.getDate()}</span>
      <EventList
        events={events}
        date={date}
        onEventClick={event => onEventClick(event, date)}
      />
    </div>
  )
}
