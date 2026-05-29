import { Router } from "express";
import { DatabaseSync } from "node:sqlite";
import { ZodError } from "zod";

import {
  createRelationship,
  deleteRelationship,
  listRelationships,
  RelationshipError
} from "./relationshipRepository.js";
import { createRelationshipSchema } from "./relationshipSchemas.js";

export function createRelationshipRouter(database: DatabaseSync): Router {
  const router = Router();

  router.get("/", (request, response, next) => {
    try {
      const personId = typeof request.query.personId === "string" ? request.query.personId : undefined;
      response.json({ relationships: listRelationships(database, personId) });
    } catch (error) {
      next(error);
    }
  });

  router.post("/", (request, response, next) => {
    try {
      const input = createRelationshipSchema.parse(request.body);
      const relationship = createRelationship(database, input);
      response.status(201).json({ relationship });
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).json({
          error: {
            code: "validation_error",
            issues: error.issues,
            message: "Relationship data is invalid."
          }
        });
        return;
      }

      if (error instanceof RelationshipError) {
        response.status(error.statusCode).json({
          error: {
            code: error.code,
            message: error.message
          }
        });
        return;
      }

      next(error);
    }
  });

  router.delete("/:id", (request, response, next) => {
    try {
      const deleted = deleteRelationship(database, request.params.id);

      if (!deleted) {
        response.status(404).json({
          error: {
            code: "not_found",
            message: "Relationship not found."
          }
        });
        return;
      }

      response.json({ deleted: true });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

