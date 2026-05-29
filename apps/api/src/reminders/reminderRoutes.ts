import { Router } from "express";
import { DatabaseSync } from "node:sqlite";

import { getReminderWindow } from "./reminderRepository.js";

function queryInt(value: unknown, fallback: number): number {
  if (typeof value !== "string") {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export function createReminderRouter(database: DatabaseSync): Router {
  const router = Router();

  router.get("/upcoming", (request, response, next) => {
    try {
      const days = queryInt(request.query.days, 7);
      const today = typeof request.query.today === "string" ? request.query.today : undefined;
      response.json({
        events: getReminderWindow(database, { futureDays: days, pastDays: 0, today })
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/window", (request, response, next) => {
    try {
      const pastDays = queryInt(request.query.pastDays, 5);
      const futureDays = queryInt(request.query.futureDays, 5);
      const today = typeof request.query.today === "string" ? request.query.today : undefined;
      const events = getReminderWindow(database, { futureDays, pastDays, today });
      const todayValue = today ?? new Date().toISOString().slice(0, 10);

      response.json({
        future: events.filter((event) => event.occurrenceDate >= todayValue),
        past: events.filter((event) => event.occurrenceDate < todayValue)
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

