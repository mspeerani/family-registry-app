# UI/UX Specification

## 1. Design Direction

The app should feel like a practical registry and research tool, not a marketing site. It should be dense, clear, and efficient.

Visual direction:

- Thin top navigation.
- Compact forms.
- Table-first registry.
- Clear profile view.
- Minimal decoration.
- No landing page as the first screen.
- No large hero sections.
- No card-heavy marketing layout.

## 2. First Screen

Default screen after login or launch:

```text
Top bar:
App name | Search | Add Person | Import | Export | Backup | Language

Main:
Left panel: filters and saved searches
Center: people table or selected profile
Right panel: family links for selected person
Bottom: past 5 days and next 5 days summary
```

## 3. Main Navigation

Required sections:

- Registry
- Person Profile
- Family Tree
- Knowledge Graph
- Reminders
- Import/Export
- Settings

## 4. Registry Screen

The registry screen must show a searchable table.

Default columns:

- Full name
- Father's name
- Surname
- Birth date
- Birth place
- Death date
- Spouse
- Children count
- Confidence

Required actions:

- Add person
- Edit person
- Archive person
- Open profile
- Link relationship
- Add photo

## 5. Person Profile

Profile sections:

- Header: name, father's name, surname, primary photo, confidence badge.
- Life details: birth/death Gregorian and Hijri dates, places, burial place.
- Family: parents, spouses, children, grandchildren.
- Notes: biography, source note.
- Photos: gallery.
- Data quality: missing fields, possible duplicates, source confidence.

## 6. Add/Edit Person Form

The form must support quick data entry.

Field groups:

- Identity
- Birth
- Death
- Family links
- Notes and source
- Photos

Required form behavior:

- Save button always visible.
- Missing optional fields allowed.
- Date precision selector beside each date.
- Hijri date can be entered manually or generated from Gregorian.
- Duplicate warning appears before save if likely duplicate exists.

## 7. Family Tree View

For selected person:

- Parents above.
- Spouse/spouses beside.
- Children below.
- Grandchildren expandable.

Controls:

- Zoom in/out.
- Fit to screen.
- Export image.
- Export PDF.
- Depth selector.
- Center on selected person.

## 8. Knowledge Graph View

Required:

- Nodes represent people.
- Edges represent relationships.
- Color or icon indicates relationship type.
- Click node opens side profile panel.
- Filters by relationship type.
- Depth selector default: 2.

## 9. Reminder Panel

Bottom panel must show:

- Past 5 days.
- Next 5 days.

Reminder screen must show:

- Next 7 days birthdays.
- Next 7 days death anniversaries.
- Filters for Gregorian/Hijri reminders.

Each reminder item:

- Person name
- Father's name
- Event type
- Gregorian date
- Hijri date if available
- Open profile action

## 10. Multilingual UI

Language selector:

- English
- Urdu
- Gujarati

Behavior:

- English: left-to-right.
- Gujarati: left-to-right.
- Urdu: right-to-left.
- The selected language affects UI labels, buttons, headings, messages, and table headers.
- Stored person data is not automatically translated.

## 11. Responsive Behavior

Desktop:

- Three-panel layout with bottom summary.

Tablet:

- Left filters collapsible.
- Right family panel collapsible.

Mobile:

- Registry/table becomes stacked list.
- Profile sections become tabs or accordions.
- Bottom summary becomes a drawer.

Minimum supported viewport width: 320 px.

## 12. Accessibility Requirements

- Keyboard navigable.
- Focus states visible.
- Form fields have labels.
- Buttons have accessible names.
- Graph controls have keyboard alternatives.
- Text must not overlap in English, Urdu, or Gujarati.

