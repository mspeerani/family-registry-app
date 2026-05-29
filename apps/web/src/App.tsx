import {
  Bell,
  Database,
  Download,
  GitBranch,
  Network,
  Plus,
  Search,
  Upload
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";

import {
  advancedSearchPeople,
  archivePerson,
  createRelationship,
  createPerson,
  fetchFamilyProfile,
  fetchPeople,
  fetchReminderWindow,
  updatePerson,
  type FamilyProfile,
  type Person,
  type ReminderWindow
} from "./api";
import {
  applyDocumentLocale,
  getStoredLocale,
  localeMeta,
  persistLocale,
  t,
  type Locale
} from "./i18n";
import { emptyPersonForm, formFromPerson, toPersonPayload, type PersonForm } from "./personForm";

type Mode = "view" | "edit" | "new";

export default function App() {
  const [locale, setLocale] = useState<Locale>(() =>
    getStoredLocale(typeof window === "undefined" ? undefined : window.localStorage)
  );
  const [query, setQuery] = useState("");
  const [missingBirthDate, setMissingBirthDate] = useState(false);
  const [missingFatherName, setMissingFatherName] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<PersonForm>(emptyPersonForm);
  const [profile, setProfile] = useState<FamilyProfile | null>(null);
  const [reminders, setReminders] = useState<ReminderWindow>({ future: [], past: [] });
  const [mode, setMode] = useState<Mode>("new");
  const [relatedPersonId, setRelatedPersonId] = useState("");
  const [relationshipType, setRelationshipType] = useState("father");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const labels = useMemo(
    () => ({
      addPerson: t(locale, "addPerson"),
      appName: t(locale, "appName"),
      archive: t(locale, "archive"),
      biography: t(locale, "biography"),
      birthDate: t(locale, "birthDate"),
      birthPlace: t(locale, "birthPlace"),
      cancel: t(locale, "cancel"),
      children: t(locale, "children"),
      confidence: t(locale, "confidence"),
      confidenceApproximate: t(locale, "confidenceApproximate"),
      confidenceConfirmed: t(locale, "confidenceConfirmed"),
      confidenceLikely: t(locale, "confidenceLikely"),
      confidenceUnknown: t(locale, "confidenceUnknown"),
      deathDate: t(locale, "deathDate"),
      deathPlace: t(locale, "deathPlace"),
      edit: t(locale, "edit"),
      error: t(locale, "error"),
      export: t(locale, "export"),
      fatherName: t(locale, "fatherName"),
      filters: t(locale, "filters"),
      fullName: t(locale, "fullName"),
      grandchildren: t(locale, "grandchildren"),
      graph: t(locale, "graph"),
      import: t(locale, "import"),
      language: t(locale, "language"),
      missingBirthDate: t(locale, "missingBirthDate"),
      missingFatherName: t(locale, "missingFatherName"),
      next5: t(locale, "next5"),
      noRecords: t(locale, "noRecords"),
      parents: t(locale, "parents"),
      past5: t(locale, "past5"),
      profile: t(locale, "profile"),
      registry: t(locale, "registry"),
      relatedPerson: t(locale, "relatedPerson"),
      relationshipType: t(locale, "relationshipType"),
      relationshipChild: t(locale, "relationshipChild"),
      relationshipFather: t(locale, "relationshipFather"),
      relationshipGuardian: t(locale, "relationshipGuardian"),
      relationshipMother: t(locale, "relationshipMother"),
      relationshipOther: t(locale, "relationshipOther"),
      relationshipSibling: t(locale, "relationshipSibling"),
      relationshipSpouse: t(locale, "relationshipSpouse"),
      relationships: t(locale, "relationships"),
      reminders: t(locale, "reminders"),
      save: t(locale, "save"),
      search: t(locale, "search"),
      spouse: t(locale, "spouse"),
      surname: t(locale, "surname"),
      tree: t(locale, "tree")
    }),
    [locale]
  );

  useEffect(() => {
    applyDocumentLocale(locale, document.documentElement);
    persistLocale(locale, window.localStorage);
  }, [locale]);

  async function loadPeopleRecords() {
    if (missingBirthDate || missingFatherName) {
      return advancedSearchPeople({
        missingBirthDate,
        missingFatherName,
        query
      });
    }

    return fetchPeople(query);
  }

  useEffect(() => {
    let isCurrent = true;

    setIsLoading(true);
    loadPeopleRecords()
      .then((records) => {
        if (!isCurrent) {
          return;
        }

        setPeople(records);
        setError(null);

        if (records.length > 0 && !selectedId) {
          setSelectedId(records[0].id);
          setForm(formFromPerson(records[0]));
          setMode("view");
        }
      })
      .catch((caught: unknown) => {
        if (isCurrent) {
          setError(caught instanceof Error ? caught.message : "Unable to load people.");
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [query, selectedId, missingBirthDate, missingFatherName]);

  useEffect(() => {
    fetchReminderWindow()
      .then(setReminders)
      .catch((caught: unknown) => {
        setError(caught instanceof Error ? caught.message : "Unable to load reminders.");
      });
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setProfile(null);
      return;
    }

    let isCurrent = true;

    fetchFamilyProfile(selectedId)
      .then((nextProfile) => {
        if (isCurrent) {
          setProfile(nextProfile);
        }
      })
      .catch((caught: unknown) => {
        if (isCurrent) {
          setError(caught instanceof Error ? caught.message : "Unable to load profile.");
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [selectedId]);

  const selectedPerson = people.find((person) => person.id === selectedId) ?? null;
  const isReadOnly = mode === "view";

  function updateForm<K extends keyof PersonForm>(key: K, value: PersonForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startNewPerson() {
    setSelectedId(null);
    setForm(emptyPersonForm);
    setProfile(null);
    setMode("new");
  }

  function selectPerson(person: Person) {
    setSelectedId(person.id);
    setForm(formFromPerson(person));
    setMode("view");
  }

  async function reloadPeople(nextSelectedId?: string) {
    const records = await loadPeopleRecords();
    setPeople(records);

    if (nextSelectedId) {
      const nextPerson = records.find((person) => person.id === nextSelectedId);
      if (nextPerson) {
        selectPerson(nextPerson);
      }
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const payload = toPersonPayload(form);
      const saved =
        mode === "edit" && form.id
          ? await updatePerson(form.id, payload)
          : await createPerson(payload);

      await reloadPeople(saved.id);
      setMode("view");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save person.");
    }
  }

  async function handleArchive() {
    if (!selectedPerson) {
      return;
    }

    setError(null);

    try {
      await archivePerson(selectedPerson.id);
      setSelectedId(null);
      setForm(emptyPersonForm);
      setProfile(null);
      setMode("new");
      await reloadPeople();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to archive person.");
    }
  }

  async function handleCreateRelationship() {
    if (!selectedPerson || !relatedPersonId) {
      return;
    }

    setError(null);

    try {
      await createRelationship({
        confidence: "confirmed",
        personId: selectedPerson.id,
        relatedPersonId,
        relationshipType
      });
      setRelatedPersonId("");
      setProfile(await fetchFamilyProfile(selectedPerson.id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to link relationship.");
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <Database aria-hidden="true" size={19} />
          <span>{labels.appName}</span>
        </div>

        <nav className="nav" aria-label="Primary">
          <button type="button">{labels.registry}</button>
          <button type="button">
            <GitBranch aria-hidden="true" size={16} />
            {labels.tree}
          </button>
          <button type="button">
            <Network aria-hidden="true" size={16} />
            {labels.graph}
          </button>
          <button type="button">
            <Bell aria-hidden="true" size={16} />
            {labels.reminders}
          </button>
        </nav>

        <div className="actions">
          <button className="primary" type="button" onClick={startNewPerson}>
            <Plus aria-hidden="true" size={16} />
            {labels.addPerson}
          </button>
          <button type="button" title={labels.import} aria-label={labels.import}>
            <Upload aria-hidden="true" size={16} />
          </button>
          <button type="button" title={labels.export} aria-label={labels.export}>
            <Download aria-hidden="true" size={16} />
          </button>
          <label className="language-select">
            <span>{labels.language}</span>
            <select
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
            >
              {Object.entries(localeMeta).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <main className="workspace">
        <aside className="filters" aria-label={labels.filters}>
          <h2>{labels.filters}</h2>
          <label className="search-field">
            <span>{labels.search}</span>
            <div>
              <Search aria-hidden="true" size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={labels.search}
              />
            </div>
          </label>
          <label className="check-field">
            <input
              checked={missingBirthDate}
              type="checkbox"
              onChange={(event) => setMissingBirthDate(event.target.checked)}
            />
            <span>{labels.missingBirthDate}</span>
          </label>
          <label className="check-field">
            <input
              checked={missingFatherName}
              type="checkbox"
              onChange={(event) => setMissingFatherName(event.target.checked)}
            />
            <span>{labels.missingFatherName}</span>
          </label>
        </aside>

        <section className="registry" aria-label={labels.registry}>
          <div className="section-heading">
            <h1>{labels.registry}</h1>
            <span>{people.length}</span>
          </div>

          {error ? (
            <p className="error-line">
              {labels.error}: {error}
            </p>
          ) : null}

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{labels.fullName}</th>
                  <th>{labels.fatherName}</th>
                  <th>{labels.surname}</th>
                  <th>{labels.birthDate}</th>
                  <th>{labels.birthPlace}</th>
                  <th>{labels.deathDate}</th>
                  <th>{labels.deathPlace}</th>
                  <th>{labels.confidence}</th>
                </tr>
              </thead>
              <tbody>
                {people.map((person) => (
                  <tr
                    key={person.id}
                    className={person.id === selectedId ? "selected-row" : undefined}
                    onClick={() => selectPerson(person)}
                  >
                    <td>{person.fullName}</td>
                    <td>{person.fatherName || "-"}</td>
                    <td>{person.surname || "-"}</td>
                    <td>{person.birthDateGregorian || "-"}</td>
                    <td>{person.birthPlace || "-"}</td>
                    <td>{person.deathDateGregorian || "-"}</td>
                    <td>{person.deathPlace || "-"}</td>
                    <td>{person.dataConfidence}</td>
                  </tr>
                ))}
                {!isLoading && people.length === 0 ? (
                  <tr>
                    <td colSpan={8}>{labels.noRecords}</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="family-panel" aria-label={labels.profile}>
          <div className="panel-heading">
            <h2>{labels.profile}</h2>
            {mode === "view" && selectedPerson ? (
              <button type="button" onClick={() => setMode("edit")}>
                {labels.edit}
              </button>
            ) : null}
          </div>

          <form className="person-form" onSubmit={handleSave}>
            <label>
              <span>{labels.fullName}</span>
              <input
                required
                readOnly={isReadOnly}
                value={form.fullName}
                onChange={(event) => updateForm("fullName", event.target.value)}
              />
            </label>
            <label>
              <span>{labels.fatherName}</span>
              <input
                readOnly={isReadOnly}
                value={form.fatherName}
                onChange={(event) => updateForm("fatherName", event.target.value)}
              />
            </label>
            <label>
              <span>{labels.surname}</span>
              <input
                readOnly={isReadOnly}
                value={form.surname}
                onChange={(event) => updateForm("surname", event.target.value)}
              />
            </label>
            <label>
              <span>{labels.birthDate}</span>
              <input
                readOnly={isReadOnly}
                value={form.birthDateGregorian}
                onChange={(event) => updateForm("birthDateGregorian", event.target.value)}
              />
            </label>
            <label>
              <span>{labels.birthPlace}</span>
              <input
                readOnly={isReadOnly}
                value={form.birthPlace}
                onChange={(event) => updateForm("birthPlace", event.target.value)}
              />
            </label>
            <label>
              <span>{labels.deathDate}</span>
              <input
                readOnly={isReadOnly}
                value={form.deathDateGregorian}
                onChange={(event) => updateForm("deathDateGregorian", event.target.value)}
              />
            </label>
            <label>
              <span>{labels.deathPlace}</span>
              <input
                readOnly={isReadOnly}
                value={form.deathPlace}
                onChange={(event) => updateForm("deathPlace", event.target.value)}
              />
            </label>
            <label>
              <span>{labels.confidence}</span>
              <select
                disabled={isReadOnly}
                value={form.dataConfidence}
                onChange={(event) => updateForm("dataConfidence", event.target.value)}
              >
                <option value="unknown">{labels.confidenceUnknown}</option>
                <option value="approximate">{labels.confidenceApproximate}</option>
                <option value="likely">{labels.confidenceLikely}</option>
                <option value="confirmed">{labels.confidenceConfirmed}</option>
              </select>
            </label>
            <label>
              <span>{labels.biography}</span>
              <textarea
                readOnly={isReadOnly}
                value={form.biography}
                onChange={(event) => updateForm("biography", event.target.value)}
              />
            </label>

            {mode !== "view" ? (
              <div className="form-actions">
                <button className="primary" type="submit">
                  {labels.save}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedPerson) {
                      selectPerson(selectedPerson);
                    } else {
                      startNewPerson();
                    }
                  }}
                >
                  {labels.cancel}
                </button>
              </div>
            ) : null}

            {mode === "view" && selectedPerson ? (
              <>
                <section className="family-links">
                  <h3>{labels.relationships}</h3>
                  <FamilyList label={labels.parents} people={profile?.parents ?? []} />
                  <FamilyList label={labels.spouse} people={profile?.spouses ?? []} />
                  <FamilyList label={labels.children} people={profile?.children ?? []} />
                  <FamilyList label={labels.grandchildren} people={profile?.grandchildren ?? []} />
                </section>

                <div className="relationship-form">
                  <label>
                    <span>{labels.relationshipType}</span>
                    <select
                      value={relationshipType}
                      onChange={(event) => setRelationshipType(event.target.value)}
                    >
                      <option value="father">{labels.relationshipFather}</option>
                      <option value="mother">{labels.relationshipMother}</option>
                      <option value="spouse">{labels.relationshipSpouse}</option>
                      <option value="child">{labels.relationshipChild}</option>
                      <option value="sibling">{labels.relationshipSibling}</option>
                      <option value="guardian">{labels.relationshipGuardian}</option>
                      <option value="other">{labels.relationshipOther}</option>
                    </select>
                  </label>
                  <label>
                    <span>{labels.relatedPerson}</span>
                    <select
                      value={relatedPersonId}
                      onChange={(event) => setRelatedPersonId(event.target.value)}
                    >
                      <option value="">-</option>
                      {people
                        .filter((person) => person.id !== selectedPerson.id)
                        .map((person) => (
                          <option key={person.id} value={person.id}>
                            {person.fullName}
                          </option>
                      ))}
                    </select>
                  </label>
                  <button type="button" onClick={handleCreateRelationship}>
                    {labels.save}
                  </button>
                </div>

                <button className="danger" type="button" onClick={handleArchive}>
                  {labels.archive}
                </button>
              </>
            ) : null}
          </form>
        </aside>
      </main>

      <footer className="summary-bar">
        <section>
          <h2>{labels.past5}</h2>
          <ul>
            {reminders.past.map((item) => (
              <li key={`${item.personId}-${item.eventType}-${item.occurrenceDate}`}>
                {item.personName} - {item.eventType}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{labels.next5}</h2>
          <ul>
            {reminders.future.map((item) => (
              <li key={`${item.personId}-${item.eventType}-${item.occurrenceDate}`}>
                {item.personName} - {item.eventType}
              </li>
            ))}
          </ul>
        </section>
      </footer>
    </div>
  );
}

function FamilyList({ label, people }: { label: string; people: Person[] }) {
  return (
    <div className="family-list">
      <span>{label}</span>
      {people.length > 0 ? (
        <ul>
          {people.map((person) => (
            <li key={person.id}>{person.fullName}</li>
          ))}
        </ul>
      ) : (
        <p>-</p>
      )}
    </div>
  );
}
