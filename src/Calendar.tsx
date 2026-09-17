import type { ReactElement } from "react"
import { useState } from "react"
import { CalendarDay } from "./CalendarDay"
import { CalendarHeader } from "./CalendarHeader"
import { EventModal } from "./EventModal"
import { type CalendarEvent, type EventFormInput, useEvents } from "./useEvents"
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import "./css/CalendarLayout.css"
import "./css/CalendarDates.css"
import "./css/CalendarControls.css"

export function Calendar(): ReactElement {
  return <CalendarGrid />
}

function CalendarGrid(): ReactElement {
  const [visibleMonth, setVisibleMonth] = useState<Date>(new Date())
  const [eventDate, setEventDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent: removeEvent,
  } = useEvents()

  const visibleDates = eachDayOfInterval({
    start: startOfWeek(startOfMonth(visibleMonth)),
    end: endOfWeek(endOfMonth(visibleMonth)),
  })

  function showPreviousMonth(): void {
    setVisibleMonth(currentMonth => addMonths(currentMonth, -1))
  }

  function showNextMonth(): void {
    setVisibleMonth(currentMonth => addMonths(currentMonth, 1))
  }

  function showCurrentMonth(): void {
    setVisibleMonth(new Date())
  }

  function openEventForm(date: Date): void {
    setEventDate(date)
    setSelectedEvent(null)
  }

  function openEditForm(event: CalendarEvent, date: Date): void {
    setEventDate(date)
    setSelectedEvent(event)
  }

  function closeEventForm(): void {
    setEventDate(null)
    setSelectedEvent(null)
  }

  function saveEvent(eventForm: EventFormInput): void {
    if (!eventDate) return
    if (selectedEvent) {
      updateEvent(selectedEvent.id, eventForm, eventDate)
    } else {
      addEvent(eventForm, eventDate)
    }
  }

  function deleteEvent(): void {
    if (selectedEvent) {
      removeEvent(selectedEvent.id)
    }
  }

  return (
    <div className="date-picker">
      <CalendarHeader
        visibleMonth={visibleMonth}
        onPrevious={showPreviousMonth}
        onNext={showNextMonth}
        onToday={showCurrentMonth}
      />
      <div className="date-picker-grid-dates date-picker-grid">
        {visibleDates.map((date, index) => (
          <CalendarDay
            key={date.toDateString()}
            date={date}
            index={index}
            visibleMonth={visibleMonth}
            events={events}
            onAddEvent={openEventForm}
            onEventClick={openEditForm}
          />
        ))}
      </div>
      {eventDate && (
        <EventModal
          key={selectedEvent?.id || eventDate.toDateString()}
          date={eventDate}
          event={selectedEvent}
          onClose={closeEventForm}
          onSave={saveEvent}
          onDelete={selectedEvent ? deleteEvent : undefined}
        />
      )}
    </div>
  )
}
