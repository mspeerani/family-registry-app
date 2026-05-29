import { Router } from "express";
import { DatabaseSync } from "node:sqlite";

import {
  commitPeopleImport,
  createBackup,
  exportPeopleCsv,
  exportRelationshipsCsv,
  previewPeopleImport,
  restoreBackup,
  type BackupData
} from "./dataTransferRepository.js";

export const restoreConfirmationPhrase = "RESTORE_FAMILY_REGISTRY";

export function createDataTransferRouter(database: DatabaseSync): Router {
  const router = Router();

  router.get("/export/people.csv", (_request, response, next) => {
    try {
      response.setHeader("Content-Type", "text/csv; charset=utf-8");
      response.setHeader("Content-Disposition", "attachment; filename=people.csv");
      response.send(exportPeopleCsv(database));
    } catch (error) {
      next(error);
    }
  });

  router.get("/export/relationships.csv", (_request, response, next) => {
    try {
      response.setHeader("Content-Type", "text/csv; charset=utf-8");
      response.setHeader("Content-Disposition", "attachment; filename=relationships.csv");
      response.send(exportRelationshipsCsv(database));
    } catch (error) {
      next(error);
    }
  });

  router.get("/export/backup", (_request, response, next) => {
    try {
      response.json(createBackup(database));
    } catch (error) {
      next(error);
    }
  });

  router.post("/import/people/preview", (request, response, next) => {
    try {
      response.json(previewPeopleImport(database, String(request.body.csv ?? "")));
    } catch (error) {
      next(error);
    }
  });

  router.post("/import/people/commit", (request, response, next) => {
    try {
      response.json(commitPeopleImport(database, String(request.body.csv ?? "")));
    } catch (error) {
      next(error);
    }
  });

  router.post("/restore/backup", (request, response, next) => {
    try {
      const body = isRecord(request.body) ? request.body : {};
      const confirmation = String(
        request.get("x-restore-confirmation") ?? body.confirmation ?? ""
      );
      const backup = isRecord(body.backup) ? body.backup : body;

      if (confirmation !== restoreConfirmationPhrase) {
        response.status(400).json({
          error: {
            code: "restore_confirmation_required",
            message: `Restore is destructive. Send confirmation phrase ${restoreConfirmationPhrase} to continue.`
          }
        });
        return;
      }

      restoreBackup(database, backup as BackupData);
      response.json({ restored: true });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
