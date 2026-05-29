import { Router } from "express";
import { DatabaseSync } from "node:sqlite";
import { ZodError } from "zod";

import { archivePerson, createPerson, getPerson, listPeople, updatePerson } from "./personRepository.js";
import { createPersonSchema, updatePersonSchema } from "./personSchemas.js";
import { getFamilyProfile } from "../relationships/relationshipRepository.js";

export function createPeopleRouter(database: DatabaseSync): Router {
  const router = Router();

  router.get("/", (request, response, next) => {
    try {
      const people = listPeople(database, {
        includeArchived: request.query.includeArchived === "true",
        query: typeof request.query.q === "string" ? request.query.q : undefined
      });
      response.json({ people });
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id/profile", (request, response, next) => {
    try {
      const profile = getFamilyProfile(database, request.params.id);

      if (!profile) {
        response.status(404).json({ error: { code: "not_found", message: "Person not found." } });
        return;
      }

      response.json({ profile });
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", (request, response, next) => {
    try {
      const person = getPerson(database, request.params.id, request.query.includeArchived === "true");

      if (!person) {
        response.status(404).json({ error: { code: "not_found", message: "Person not found." } });
        return;
      }

      response.json({ person });
    } catch (error) {
      next(error);
    }
  });

  router.post("/", (request, response, next) => {
    try {
      const input = createPersonSchema.parse(request.body);
      const person = createPerson(database, input);
      response.status(201).json({ person });
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).json({
          error: {
            code: "validation_error",
            issues: error.issues,
            message: "Person data is invalid."
          }
        });
        return;
      }

      next(error);
    }
  });

  router.patch("/:id", (request, response, next) => {
    try {
      const input = updatePersonSchema.parse(request.body);
      const person = updatePerson(database, request.params.id, input);

      if (!person) {
        response.status(404).json({ error: { code: "not_found", message: "Person not found." } });
        return;
      }

      response.json({ person });
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).json({
          error: {
            code: "validation_error",
            issues: error.issues,
            message: "Person data is invalid."
          }
        });
        return;
      }

      next(error);
    }
  });

  router.delete("/:id", (request, response, next) => {
    try {
      const archived = archivePerson(database, request.params.id);

      if (!archived) {
        response.status(404).json({ error: { code: "not_found", message: "Person not found." } });
        return;
      }

      response.json({ archived: true });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
