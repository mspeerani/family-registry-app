# Product Requirements Document

## 1. Product Name

Working name: Family Registry App

## 2. Purpose

Create a slim, production-ready app for recording and exploring an extended family database. The app must support structured person records, family relationships, photos, Gregorian and Hijri dates, search, reminders, and visual family tree/knowledge graph views.

The app is intended for family historians, elders, administrators, and relatives who need a reliable single source of truth for family records.

## 3. Product Goals

1. Store extended family data in one connected database.
2. Allow missing or partial data without blocking record creation.
3. Support English database fields while offering English, Urdu, and Gujarati UI.
4. Make family relationships easy to add, verify, and visualize.
5. Provide fast search by name, father's name, surname, place, date, spouse, children, and missing-data criteria.
6. Generate reminders for upcoming birth and death anniversaries.
7. Provide a clean, thin, practical UI for repeated data entry and lookup.
8. Support backup, restore, import, and export from the first production release.

## 4. Non-Goals for MVP

The MVP must not include these unless explicitly added later:

- Public social networking features.
- Chat or comments between relatives.
- Cloud sync across many users.
- AI-generated family facts without human confirmation.
- Fully automated duplicate merging.
- Genealogy standard import/export such as GEDCOM, unless added as a later phase.

## 5. Target Users

### Family Administrator

Maintains records, adds people, links relationships, corrects duplicate records, imports/export data, and performs backup.

### Family Viewer

Searches family records, views profiles, checks tree/graph views, and sees upcoming birth/death anniversary reminders.

### Data Contributor

Provides partial or uncertain information. May not have permission to delete or merge records.

## 6. Key Product Decisions

1. The database schema must use English table and column names.
2. UI language must be switchable between English, Urdu, and Gujarati.
3. Person names can be stored in English and native scripts.
4. Every person must have an internal unique ID.
5. The visible human identifier is full name plus father's name, but it is not guaranteed unique.
6. Missing values are allowed.
7. Partial and approximate dates are first-class data cases.
8. Relationship data must be flexible enough for spouse, parent, child, sibling, guardian, adoption, and uncertain links.
9. Hijri dates may be manually entered or generated from Gregorian dates, and the app must record which one it is.

## 7. Core Features

### 7.1 Person Registry

Users can create, edit, view, archive, and search person records.

Required fields:

- Full name
- Father's name

Recommended optional fields:

- Surname
- Gender
- Native/display name
- Date of birth, Gregorian
- Date of birth, Hijri
- Place of birth
- Birth note
- Date of death, Gregorian
- Date of death, Hijri
- Place of death
- Burial place
- Notes/biography
- Data confidence
- Source note
- Photos

The app must allow a person to be saved even when only full name and father's name are known.

### 7.2 Relationships

Users can link people as:

- Father
- Mother
- Spouse
- Child
- Sibling
- Guardian
- Other relative

Relationship links must support:

- Confidence level
- Start date where relevant, such as marriage
- End date where relevant
- Notes

Children and grandchildren must be derived from relationship links, not manually duplicated.

### 7.3 Dates

The app must support Gregorian and Hijri dates for birth and death.

Date precision options:

- Exact full date
- Year and month only
- Year only
- Approximate
- Unknown

Hijri conversion:

- If Gregorian date exists, app may suggest Hijri date.
- User can manually override Hijri date.
- App must store whether Hijri date is manual or auto-generated.

### 7.4 Search and Query

Basic search must support:

- Full name
- Father's name
- Surname
- Native name
- Place of birth
- Place of death
- Burial place
- Spouse name
- Child name
- Notes

Advanced filters must support:

- Missing birth date
- Missing death date
- Missing father's name
- Has photo
- No photo
- Has spouse
- Has children
- Born in a place
- Died in a place
- Born before/after a date
- Died before/after a date
- Upcoming birth anniversaries
- Upcoming death anniversaries
- Descendants of selected person
- Ancestors of selected person

### 7.5 Family Tree View

For a selected person, show:

- Parents above
- Spouse/spouses beside
- Children below
- Grandchildren expandable below children

User must be able to click any person node to open the profile.

### 7.6 Knowledge Graph View

Show people as nodes and relationships as edges. It must support:

- Pan/zoom
- Click node to open profile
- Filter by relationship type
- Center graph on selected person
- Limit graph depth to avoid large unreadable graphs

### 7.7 Reminders and Summary Panel

The app must show:

- Birthdays in the next 7 days
- Death anniversaries in the next 7 days
- Bottom summary for past 5 days and next 5 days

The summary panel must show event type, person name, father's name, Gregorian date, and Hijri date if available.

### 7.8 Import, Export, Backup

Required:

- Export people and relationships to CSV.
- Import people from CSV with validation preview.
- Export full database backup.
- Restore from backup.
- Export selected tree as image or PDF.

### 7.9 Duplicate Detection

The app must warn about possible duplicates based on:

- Full name similarity
- Father's name similarity
- Surname
- Birth year
- Spouse
- Birth place

The app must not merge records automatically. It should show a review screen.

## 8. Permissions

MVP may support a single local admin user. Production-ready implementation should prepare for roles:

- Admin: all actions
- Editor: create/edit records and relationships
- Viewer: read/search/export allowed if configured

If authentication is included, default deployment must require login before accessing data.

## 9. Performance Requirements

The app should remain responsive with:

- 25,000 people
- 100,000 relationship records
- 50,000 events
- 100,000 search-indexed text values

Search results should return within 500 ms for typical queries on a modern laptop.

## 10. Production Requirements

The app must include:

- Database migrations
- Seed/sample data
- Environment configuration
- Docker Compose deployment
- Automated tests
- Backup and restore docs
- Error logging
- Input validation
- Accessibility basics
- Responsive desktop/tablet layout

