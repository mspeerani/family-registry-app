# Risk Register

| ID | Risk | Impact | Likelihood | Mitigation | Status |
| --- | --- | --- | --- | --- | --- |
| R-001 | Real family data accidentally committed to public repo | High | Medium | Strict `.gitignore`, audit script, staged-file review before commits | Open |
| R-002 | Two people share same full name and father's name | Medium | High | Use internal UUID as primary key; treat name plus father's name as human identifier only | Accepted |
| R-003 | Hijri/Gregorian conversion differs by method or moon sighting | Medium | High | Store manual vs auto source; allow manual override; do not treat conversion as absolute truth | Open |
| R-004 | Graph view becomes unreadable for large families | Medium | High | Add depth controls, filters, and selected-person focus | Open |
| R-005 | Multilingual UI causes layout overflow, especially Urdu RTL | Medium | Medium | Add RTL smoke tests and responsive layout checks | Open |
| R-006 | Import creates duplicates | Medium | Medium | Import preview, duplicate warnings, no automatic merge | Open |
| R-007 | Backup/restore is not tested until late | High | Medium | Add backup/restore verification before production release | Open |
| R-008 | Scope grows before core registry is stable | Medium | Medium | Follow checkpoint order and defer non-MVP features | Open |
| R-009 | Local laptop lacks global Node/npm/Docker | Medium | High | Use ignored project-local Node for development; keep Docker optional until available | Mitigated |
| R-010 | Native SQLite package may fail to install on Windows without build tools | Medium | Medium | Use Node.js built-in `node:sqlite`; avoid native package dependency for foundation phase | Mitigated |
| R-011 | `node:sqlite` requires a modern Node runtime | Medium | Medium | Pin Docker to Node 24 and provide project-local Node bootstrap script | Open |

## Risk Handling Rule

Any new high-impact risk must be added here before continuing the phase. If the risk affects privacy or data loss, stop feature work until mitigation is defined.
