import { CalendarDate } from "@internationalized/date";

export function dateToCalendarDate(date: Date): CalendarDate {
  return new CalendarDate(date.getFullYear(), date.getMonth(), date.getDate());
}
