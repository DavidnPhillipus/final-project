import type {
  AnimationEvent as ReactAnimationEvent,
  ChangeEvent,
  FormEvent,
  ReactElement,
} from "react"
import { useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import { EventFormFields } from "./EventFormFields"
import type { CalendarEvent, EventFormInput } from "./useEvents"
import "./css/EventModal.css"

const emptyEvent: EventFormInput = {
  name: "",
  allDay: false,
  startTime: "",
  endTime: "",
  color: "blue",
}

interface EventModalProps {
  date: Date
  event: CalendarEvent | null
  onClose: () => void
  onSave: (eventForm: EventFormInput) => void
  onDelete?: () => void
}

type PendingAction =
  | { type: "save"; value: EventFormInput }
  | { type: "delete" }
  | null

export function EventModal({
  date,
  event,
  onClose,
  onSave,
  onDelete,
}: EventModalProps): ReactElement {
  const firstInputRef = useRef<HTMLInputElement | null>(null)
  const [eventForm, setEventForm] = useState<EventFormInput>(event || emptyEvent)
  const [timeError, setTimeError] = useState("")
  const [isClosing, setIsClosing] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  useEffect(() => {
    firstInputRef.current?.focus()

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        requestClose()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  function updateEventForm(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value, type, checked } = event.target

    setEventForm(currentForm => {
      if (name === "allDay") {
        return { ...currentForm, allDay: checked }
      }

      if (
        name === "name" ||
        name === "startTime" ||
        name === "endTime" ||
        name === "color"
      ) {
        return {
          ...currentForm,
          [name]: type === "checkbox" ? checked : value,
        }
      }

      return currentForm
    })

    if (name === "startTime" || name === "endTime") setTimeError("")
  }

  function saveEvent(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    if (!eventForm.allDay && eventForm.startTime >= eventForm.endTime) {
      setTimeError("End time must be after start time.")
      return
    }

    setPendingAction({ type: "save", value: eventForm })
    setIsClosing(true)
  }

  function requestClose(): void {
    if (!isClosing) setIsClosing(true)
  }

  function finishClose(event: ReactAnimationEvent<HTMLDivElement>): void {
    if (
      event.target !== event.currentTarget ||
      event.animationName !== "modal-backdrop-out"
    ) {
      return
    }
    if (pendingAction?.type === "save") onSave(pendingAction.value)
    if (pendingAction?.type === "delete") onDelete?.()
    onClose()
  }

  return (
    <div
      className={`modal-backdrop ${isClosing ? "is-closing" : ""}`}
      onMouseDown={requestClose}
      onAnimationEnd={finishClose}
    >
      <form
        className="event-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
        onSubmit={saveEvent}
        onMouseDown={event => event.stopPropagation()}
      >
        <div className="event-modal-header">
          <h2 id="event-modal-title">{event ? "Edit Event" : "Add Event"}</h2>
          <p className="event-date">{format(date, "M/d/yy")}</p>
          <button
            type="button"
            className="close-button"
            aria-label="Close event modal"
            onClick={requestClose}
          >
            &times;
          </button>
        </div>
        <EventFormFields
          eventForm={eventForm}
          onChange={updateEventForm}
          timeError={timeError}
          inputRef={firstInputRef}
        />
        <div className="event-actions">
          {onDelete && (
            <button
              className="delete-event-button"
              type="button"
              onClick={() => {
                setPendingAction({ type: "delete" })
                setIsClosing(true)
              }}
            >
              Delete
            </button>
          )}
          <button className="save-event-button" type="submit">
            {event ? "Save" : "Add"}
          </button>
        </div>
      </form>
    </div>
  )
}
