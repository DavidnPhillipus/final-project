import { useEffect, useState } from "react"

export type EventColor = "red" | "green" | "blue"

export interface EventFormInput {
  name: string
  allDay: boolean
  startTime: string
  endTime: string
  color: EventColor
}

export interface CalendarEvent extends EventFormInput {
  id: string
  date: string
}

const storageKey = "calendar-events"

function toEventColor(value: unknown): EventColor {
  return value === "red" || value === "green" || value === "blue"
    ? value
    : "blue"
}

function loadEvents(): CalendarEvent[] {
  try {
    const storedEvents = JSON.parse(localStorage.getItem(storageKey) ?? "null")

    if (!Array.isArray(storedEvents)) {
      return []
    }

    return storedEvents.map((event, index) => {
      const safeEvent = event as Record<string, unknown>

      return {
        id:
          typeof safeEvent.id === "string"
            ? safeEvent.id
            : `${String(safeEvent.date ?? "unknown")}-${String(safeEvent.name ?? "event")}-${index}`,
        date: typeof safeEvent.date === "string" ? safeEvent.date : "",
        name: typeof safeEvent.name === "string" ? safeEvent.name : "",
        allDay: Boolean(safeEvent.allDay),
        startTime: typeof safeEvent.startTime === "string" ? safeEvent.startTime : "",
        endTime: typeof safeEvent.endTime === "string" ? safeEvent.endTime : "",
        color: toEventColor(safeEvent.color),
      }
    })
  } catch {
    return []
  }
}

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>(loadEvents)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(events))
  }, [events])

  function addEvent(event: EventFormInput, date: Date): void {
    setEvents(currentEvents => [
      ...currentEvents,
      { ...event, date: date.toDateString(), id: crypto.randomUUID() },
    ])
  }

  function updateEvent(
    eventId: string,
    event: EventFormInput,
    date: Date
  ): void {
    setEvents(currentEvents =>
      currentEvents.map(currentEvent =>
        currentEvent.id === eventId
          ? { ...currentEvent, ...event, date: date.toDateString() }
          : currentEvent
      )
    )
  }

  function deleteEvent(eventId: string): void {
    setEvents(currentEvents =>
      currentEvents.filter(event => event.id !== eventId)
    )
  }

  return { events, addEvent, updateEvent, deleteEvent }
}
