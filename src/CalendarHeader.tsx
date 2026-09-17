import type { ReactElement } from "react"
import { format } from "date-fns"

interface CalendarHeaderProps {
  visibleMonth: Date
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}

export function CalendarHeader({
  visibleMonth,
  onPrevious,
  onNext,
  onToday,
}: CalendarHeaderProps): ReactElement {
  return (
    <div className="date-picker-header">
      <button className="today-button" type="button" onClick={onToday}>
        Today
      </button>
      <button
        className="prev-month-button month-button"
        type="button"
        onClick={onPrevious}
      >
        &lt;
      </button>
      <button
        className="next-month-button month-button"
        type="button"
        onClick={onNext}
      >
        &gt;
      </button>
      <div className="current-month">
        {format(visibleMonth, "MMMM - yyyy")}
      </div>
    </div>
  )
}
