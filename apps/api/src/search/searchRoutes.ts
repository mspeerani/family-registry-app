import { Router } from "express";
import { DatabaseSync } from "node:sqlite";
import { ZodError } from "zod";

import { listPeople } from "../people/personRepository.js";
import { advancedSearchPeople } from "./searchRepository.js";
import { advancedSearchSchema } from "./searchSchemas.js";

export function createSearchRouter(database: DatabaseSync): Router {
  const router = Router();

  router.get("/", (request, response, next) => {
    try {
      const query = typeof request.query.q === "string" ? request.query.q : undefined;
      response.json({ people: listPeople(database, { query }) });
    } catch (error) {
      next(error);
    }
  });

  router.post("/advanced", (request, response, next) => {
    try {
      const input = advancedSearchSchema.parse(request.body);
      response.json({ people: advancedSearchPeople(database, input) });
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).json({
          error: {
            code: "validation_error",
            issues: error.issues,
            message: "Search criteria are invalid."
          }
        });
        return;
      }

      next(error);
    }
  });

  return router;
}

