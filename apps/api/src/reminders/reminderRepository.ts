import { DatabaseSync } from "node:sqlite";

export type ReminderEvent = {
  eventType: "birth" | "death";
  fatherName: string | null;
  gregorianDate: string;
  hijriDate: string | null;
  occurrenceDate: string;
  personId: string;
  personName: string;
};

type ReminderRow = {
  birth_date_gregorian: string | null;
  birth_date_hijri: string | null;
  death_date_gregorian: string | null;
  death_date_hijri: string | null;
  father_name: string | null;
  full_name: string;
  id: string;
};

function toUtcDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function extractMonthDay(date: string | null): { day: number; month: number } | null {
  const match = date?.match(/^\d{4}-(\d{2})-(\d{2})$/);

  if (!match) {
    return null;
  }

  return {
    day: Number(match[2]),
    month: Number(match[1])
  };
}

function occurrencesInWindow(
  monthDay: { day: number; month: number },
  start: Date,
  end: Date
): Date[] {
  const years = [start.getUTCFullYear() - 1, start.getUTCFullYear(), end.getUTCFullYear(), end.getUTCFullYear() + 1];
  const uniqueYears = Array.from(new Set(years));
  const dates: Date[] = [];

  for (const year of uniqueYears) {
    const occurrence = new Date(Date.UTC(year, monthDay.month - 1, monthDay.day));
    if (occurrence >= start && occurrence <= end) {
      dates.push(occurrence);
    }
  }

  return dates;
}

export function getReminderWindow(
  database: DatabaseSync,
  options: { futureDays: number; pastDays: number; today?: string }
): ReminderEvent[] {
  const today = toUtcDate(options.today ?? formatDate(new Date()));
  const start = addDays(today, -Math.max(0, options.pastDays));
  const end = addDays(today, Math.max(0, options.futureDays));
  const rows = database
    .prepare(
      `
        SELECT
          id,
          full_name,
          father_name,
          birth_date_gregorian,
          birth_date_hijri,
          death_date_gregorian,
          death_date_hijri
        FROM people
        WHERE is_archived = 0
      `
    )
    .all() as ReminderRow[];

  const events: ReminderEvent[] = [];

  for (const row of rows) {
    const birthMonthDay = extractMonthDay(row.birth_date_gregorian);
    if (birthMonthDay && row.birth_date_gregorian) {
      for (const occurrence of occurrencesInWindow(birthMonthDay, start, end)) {
        events.push({
          eventType: "birth",
          fatherName: row.father_name,
          gregorianDate: row.birth_date_gregorian,
          hijriDate: row.birth_date_hijri,
          occurrenceDate: formatDate(occurrence),
          personId: row.id,
          personName: row.full_name
        });
      }
    }

    const deathMonthDay = extractMonthDay(row.death_date_gregorian);
    if (deathMonthDay && row.death_date_gregorian) {
      for (const occurrence of occurrencesInWindow(deathMonthDay, start, end)) {
        events.push({
          eventType: "death",
          fatherName: row.father_name,
          gregorianDate: row.death_date_gregorian,
          hijriDate: row.death_date_hijri,
          occurrenceDate: formatDate(occurrence),
          personId: row.id,
          personName: row.full_name
        });
      }
    }
  }

  return events.sort((a, b) => a.occurrenceDate.localeCompare(b.occurrenceDate));
}

