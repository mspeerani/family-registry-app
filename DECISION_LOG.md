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

