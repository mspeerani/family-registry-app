# Quality Plan

## Purpose

This document defines the quality system for the Family Registry App. It is the control mechanism used before each commit, checkpoint, and release.

## Quality Principles

1. Protect private family data before adding features.
2. Build in small verifiable phases.
3. Keep requirements traceable to implementation.
4. Prefer tests and executable checks over manual confidence.
5. Treat missing data and multilingual behavior as core requirements, not polish.
6. Do not tag a release unless the phase exit gate passes.

## Recursive Self-Audit Loop

Every implementation phase follows this loop:

```text
Plan -> Build -> Self-review -> Test -> Fix -> Re-test -> Document -> Commit -> Tag if release checkpoint -> Push -> Update status
```

If a test or audit fails:

```text
Record failure -> Identify cause -> Fix smallest relevant scope -> Re-run failed check -> Re-run full phase gate
```

If a risk cannot be resolved immediately:

```text
Add to RISK_REGISTER.md -> Add mitigation -> Continue only if risk is acceptable for the current phase
```

## Required Gate For Every Commit

Before each commit:

- `git status --short`
- Confirm only intended files changed.
- Run available automated checks.
- Run `scripts/project_audit.ps1`.
- Confirm no private data or secrets are staged.
- Update docs if behavior, architecture, or process changed.

## Required Gate For Every Version Tag

Before every tag:

- Working tree is clean after commit.
- Phase exit criteria in `CHECKPOINTS.md` are satisfied.
- Tests/checks pass.
- Version number follows `RELEASE_PLAN.md`.
- `PROJECT_STATUS.md` reflects the new baseline and next phase.

## Future Technical Quality Checks

When app code exists, each phase must add or run relevant checks:

- Type checking
- Linting
- Unit tests
- API tests
- Database migration tests
- Playwright smoke tests
- Accessibility smoke tests
- Production build
- Docker Compose boot test

## Privacy Quality Checks

Every phase must confirm:

- No real person data is committed.
- No photos are committed.
- No database files are committed.
- No backups are committed.
- No `.env` files are committed.
- Sample data uses obviously fake names.

## Definition Of Done

A phase is done only when:

- Required feature or document exists.
- Acceptance checks pass.
- Risk register is updated.
- Decision log is updated if a decision was made.
- Git commit is created.
- GitHub push succeeds.
- Release tag is created for version checkpoints.

