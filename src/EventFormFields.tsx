import type { ChangeEvent, ReactElement, RefObject } from "react"
import type { EventColor, EventFormInput } from "./useEvents"

const colorOptions: Array<{ value: EventColor; background: string }> = [
  { value: "red", background: "hsl(0, 75%, 60%)" },
  { value: "green", background: "hsl(150, 80%, 30%)" },
  { value: "blue", background: "hsl(200, 80%, 50%)" },
]

interface EventFormFieldsProps {
  eventForm: EventFormInput
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  timeError: string
  inputRef?: RefObject<HTMLInputElement | null>
}

export function EventFormFields({
  eventForm,
  onChange,
  timeError,
  inputRef,
}: EventFormFieldsProps): ReactElement {
  return (
    <>
      <label htmlFor="event-name">
        Name
      </label>
      <input
        ref={inputRef}
        id="event-name"
        name="name"
        value={eventForm.name}
        onChange={onChange}
        required
      />

      <label className="all-day-label" htmlFor="event-all-day">
        <input
          id="event-all-day"
          name="allDay"
          type="checkbox"
          checked={eventForm.allDay}
          onChange={onChange}
        />
        All Day?
      </label>

      <div className="time-fields">
        <label htmlFor="event-start-time">
          Start time
        </label>
        <input
          id="event-start-time"
          name="startTime"
          type="time"
          value={eventForm.startTime}
          onChange={onChange}
          disabled={eventForm.allDay}
          required={!eventForm.allDay}
        />

        <label htmlFor="event-end-time">
          End time
        </label>
        <input
          id="event-end-time"
          name="endTime"
          type="time"
          value={eventForm.endTime}
          onChange={onChange}
          disabled={eventForm.allDay}
          required={!eventForm.allDay}
        />
      </div>

      {timeError && <p className="time-error">{timeError}</p>}

      <fieldset className="color-field">
        <legend>Color</legend>
        <div className="color-options">
          {colorOptions.map(({ value: color, background }) => (
            <label
              className={`color-option color-${color}`}
              key={color}
              htmlFor={`color-${color}`}
            >
              <input
                id={`color-${color}`}
                type="radio"
                name="color"
                value={color}
                checked={eventForm.color === color}
                onChange={onChange}
              />
              <span style={{ backgroundColor: background }} />
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}
