# Acceptance Criteria

## v1.0.0 Status

`v1.0.0` is a production-ready MVP, not the final full product vision. Passed release evidence is documented in `docs/RELEASE_NOTES_v1.0.0.md`. Items involving photo upload UI, relationship CSV import, Hijri conversion, graph pan/zoom, advanced graph filtering, and Docker runtime verification remain documented limitations or future enhancements.

## 1. General

- App can be deployed using documented steps.
- App starts without developer intervention after configuration.
- Database migrations run successfully.
- App uses a single connected SQLite database.
- Database table and column names are English.
- UI supports English, Urdu, and Gujarati.

## 2. Person Records

- User can add a person with full name and father's name.
- User can save a person with missing optional data.
- User can edit identity, birth, death, notes, source, and confidence fields.
- User can archive a person without deleting database history.
- Person profile shows all saved metadata.

## 3. Dates

- Gregorian birth date can be saved.
- Hijri birth date can be saved.
- Gregorian death date can be saved.
- Hijri death date can be saved.
- Date precision can be exact, month, year, approximate, or unknown.
- App does not invent fake days/months for partial dates.
- Hijri date source is stored as manual, auto, or unknown.

## 4. Relationships

- User can link father, mother, spouse, child, sibling, guardian, and other relationship types.
- App blocks self-relationship.
- App prevents duplicate active relationship links.
- Profile derives children and grandchildren from relationship links.
- Relationship notes and confidence are saved.

## 5. Search

- User can search by full name.
- User can search by father's name.
- User can search by surname.
- User can search by native name.
- User can search by birth place, death place, and burial place.
- User can filter people with missing birth date.
- User can filter people with missing father's name.
- User can filter people with photos and without photos.
- User can filter descendants and ancestors of a selected person.

## 6. Reminders

- App shows birthdays in the next 7 days.
- App shows death anniversaries in the next 7 days.
- Bottom panel shows past 5 days and next 5 days.
- Reminder item opens the relevant person profile.
- Year-only birth/death records do not appear in daily reminder lists.

## 7. Family Tree

- Tree view opens for a selected person.
- Tree shows parents above selected person.
- Tree shows spouse/spouses beside selected person.
- Tree shows children below selected person.
- Tree supports expandable grandchildren.
- User can click a person in the tree to open profile.
- Tree can be exported as image or PDF.

## 8. Knowledge Graph

- Graph view opens for a selected person.
- Graph shows nodes and relationship edges.
- User can pan and zoom.
- User can control graph depth.
- User can filter by relationship type.
- User can click a node to open profile.

## 9. Multilingual UI

- English UI displays left-to-right.
- Gujarati UI displays left-to-right.
- Urdu UI displays right-to-left.
- Language selector persists user's preference.
- Table headers, form labels, buttons, navigation, and messages are translated.
- User-entered data is not overwritten or auto-translated when language changes.

## 10. Import, Export, Backup

- User can export people CSV.
- User can export relationships CSV.
- User can preview CSV import before committing.
- Import preview shows validation errors.
- User can create full backup.
- User can restore backup into clean deployment.
- Uploaded photos are included in backup strategy or clearly documented.

## 11. Production Readiness

- Production build succeeds.
- Docker Compose deployment works.
- Automated tests pass.
- Core Playwright smoke test passes.
- API validates input server-side.
- Uploads are restricted to image files.
- Errors are logged.
- Production mode does not expose stack traces to users.
