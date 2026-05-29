# Release Plan

## Versioning

Use milestone tags:

```text
vMAJOR.MINOR.PATCH
```

Before `v1.0.0`, minor versions represent functional milestones and patch versions represent governance, documentation, or small corrective releases.

Examples:

```text
v0.1.0 - initial project documentation pack
v0.1.1 - governance and QA system
v0.2.0 - runnable app scaffold
v1.0.0 - production-ready release
```

## Commit Rules

Commit messages should be short and factual:

```text
Add project governance and QA controls
Scaffold frontend and backend apps
Add SQLite migrations
Implement person registry
```

## Tag Rules

Only create a tag when:

- The working tree is clean.
- The checkpoint exit criteria pass.
- The commit has been pushed or is ready to push.
- The tag is pushed to GitHub.

## Rollback Rules

For local rollback investigation:

```powershell
git checkout v0.1.0
```

Do not reset or rewrite public history unless the user explicitly approves it. Prefer forward fixes.

## Branch Rules

Default branch:

```text
main
```

For larger changes, use:

```text
codex/<short-feature-name>
```

Small checkpoint changes may go directly to `main` if they are reviewed, tested, committed, tagged, and pushed.

## Release Notes

For `v1.0.0`, create release notes containing:

- What is included
- Deployment steps
- Backup/restore instructions
- Known limitations
- Privacy warnings
- Upgrade path

`v1.0.0` release notes are stored at:

```text
docs/RELEASE_NOTES_v1.0.0.md
```
