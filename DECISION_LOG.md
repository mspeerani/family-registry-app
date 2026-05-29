# Decision Log

## D-001 - Database Schema Language

Decision: Database table and column names will use English.

Reason: English schema names make implementation, maintenance, migrations, and developer onboarding simpler.

Date: 2026-05-29

## D-002 - UI Languages

Decision: UI must support English, Urdu, and Gujarati.

Reason: Family users may prefer different languages, while a single English database schema avoids duplicating data models.

Date: 2026-05-29

## D-003 - Public Repository Safety

Decision: The GitHub repository is public, so real databases, photos, exports, backups, and secrets must never be committed.

Reason: Family records are private and should remain local unless a future secure deployment model is explicitly approved.

Date: 2026-05-29

## D-004 - Versioning Strategy

Decision: Use semantic-style pre-1.0 version tags for checkpoints.

Reason: Small tags make it easier to roll back, audit progress, and identify stable handoff points.

Date: 2026-05-29

## D-005 - Governance Before App Code

Decision: Create governance and QA controls before building the app scaffold.

Reason: The project involves private family data and a public repository, so safety and repeatable verification are prerequisites.

Date: 2026-05-29

## D-006 - Initial App Stack

Decision: Use a TypeScript monorepo with React/Vite for the web app and Express for the API.

Reason: This matches the PRD recommendation, keeps the stack common for developers, and supports a thin UI with a small API server.

Date: 2026-05-29

## D-007 - Project-Local Runtime On This Laptop

Decision: Use a portable Node runtime under `.tools/` on this laptop when global Node/npm are unavailable.

Reason: The user authorized project-folder changes only. A project-local ignored runtime allows testing without changing system software.

Date: 2026-05-29

## D-008 - Database Driver Deferred To Database Phase

Decision: The `v0.2.0` scaffold includes SQLite configuration placeholders but defers the concrete SQLite driver and migrations to `v0.3.0`.

Reason: Native SQLite packages can add installation risk. The scaffold phase should prove app structure first, then the database phase can evaluate the safest production driver.

Date: 2026-05-29

## D-009 - SQLite Runtime

Decision: Use Node.js built-in `node:sqlite` for the database foundation.

Reason: It works in the project-local Node 24 LTS runtime and avoids native package installation risk on Windows.

Date: 2026-05-29

## D-010 - Migration Immutability

Decision: Tagged migrations should not be rewritten after release.

Reason: Forward-only migrations keep production upgrades auditable and reduce data-loss risk.

Date: 2026-05-29

## D-011 - Archive Instead Of Delete For People

Decision: The person delete endpoint archives a record by setting `is_archived = 1`.

Reason: Family history records should not be permanently removed during normal use, and archive behavior preserves auditability.

Date: 2026-05-29

## D-012 - Place Names Through Places Table

Decision: Person birth, death, and burial place inputs are stored through the `places` table rather than free-text columns on `people`.

Reason: This preserves the normalized schema from the data model while allowing a simple UI field in the registry.

Date: 2026-05-29

## D-013 - Relationship Direction Convention

Decision: Relationship rows use `person_id` as the subject and `related_person_id` as the related object. `relationship_type` describes how the related object is related to the subject.

Reason: This matches the data model and supports derived parent, spouse, child, and grandchild views without duplicating relationship facts.

Date: 2026-05-29

## D-014 - Reminder Eligibility

Decision: Reminder windows include only Gregorian dates with known month and day.

Reason: Year-only and approximate dates cannot produce reliable daily reminders. Hijri reminder logic remains a later enhancement after manual/auto Hijri handling is complete.

Date: 2026-05-29

## D-015 - ASCII-Safe Translation Source

Decision: Urdu and Gujarati UI strings are stored with Unicode escape sequences in source code.

Reason: The project previously showed mojibake in shell output. ASCII-safe source prevents editor/terminal encoding drift while still rendering proper Urdu and Gujarati in the browser.

Date: 2026-05-29

## D-016 - Persisted Locale Preference

Decision: The web app stores the selected locale in browser local storage.

Reason: Users should not need to reselect English, Urdu, or Gujarati on every app launch.

Date: 2026-05-29

## D-017 - Native SVG Graph For First Graph Release

Decision: Use native React/SVG/CSS for the initial family tree and knowledge graph instead of introducing a graph library in `v0.8.0`.

Reason: The current graph scope is selected-person context with small depth limits. Native SVG keeps the app slim and avoids dependency weight while leaving room to adopt Cytoscape.js or React Flow later if graph complexity grows.

Date: 2026-05-29

## D-018 - SVG Graph Export

Decision: The first graph export format is SVG.

Reason: SVG is a real image format, preserves text and edges clearly, and can later be converted to PDF if required.

Date: 2026-05-29

## D-019 - Backup Format

Decision: Use JSON backup export for `v0.9.0`.

Reason: JSON backup is portable, testable, and avoids exposing raw SQLite file paths through the API. It can be extended to include more tables as the app grows.

Date: 2026-05-29

## D-020 - CSV Import Scope

Decision: `v0.9.0` supports people CSV import preview and commit. Relationship CSV import remains a later enhancement.

Reason: Person import is the highest-value first data migration path. Relationship import needs stronger duplicate and direction review before enabling commit.

Date: 2026-05-29
