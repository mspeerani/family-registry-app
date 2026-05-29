# Family Registry App - Project Pack

This project pack defines a production-ready, local-first family registry application with multilingual UI support, a single connected database of people, relationship graph views, search, and date-based reminders.

The documents are intended to be handed directly to a developer without requiring further clarification.

## Documents

- [PRD.md](PRD.md) - product requirements, users, features, scope, and acceptance criteria.
- [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md) - recommended architecture, stack, APIs, security, deployment, and testing.
- [DATA_MODEL.md](DATA_MODEL.md) - database schema, relationships, indexes, date handling, and data rules.
- [UI_UX_SPEC.md](UI_UX_SPEC.md) - screen layout, workflows, multilingual behavior, and visual requirements.
- [I18N_SPEC.md](I18N_SPEC.md) - English, Urdu, Gujarati localization model and translation keys.
- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) - phased build plan and milestone deliverables.
- [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) - testable completion checklist.

## Product Summary

Build a slim, efficient family knowledge app for extended family data. The database schema and internal field names are English. The user interface supports English, Urdu, and Gujarati. The app stores people, birth/death metadata, spouses, parents, children, grandchildren, photos, notes, and sources. It provides search by any major field, a family tree, a knowledge graph, and birthday/death-anniversary notifications.

## Recommended MVP Stack

- Frontend: React + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: SQLite
- ORM/query layer: Prisma or Drizzle
- Graph/tree visualization: Cytoscape.js or React Flow
- Date handling: Luxon plus a Hijri calendar library with manual override support
- Packaging/deployment: Docker Compose for server deployment, plus local SQLite database file backup

## Core Principle

The family tree is a view of the data, not the data itself. The source of truth is a connected database of people, relationships, events, photos, places, and sources.

