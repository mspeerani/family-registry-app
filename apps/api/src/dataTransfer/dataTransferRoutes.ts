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
      restoreBackup(database, request.body as BackupData);
      response.json({ restored: true });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

