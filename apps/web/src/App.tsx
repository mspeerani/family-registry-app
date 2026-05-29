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
import { useEffect, useMemo, useState } from "react";

import { localeMeta, t, type Locale } from "./i18n";

const people = [
  {
    birthDate: "1952-04-16",
    birthPlace: "Sample City",
    children: 4,
    confidence: "Confirmed",
    deathDate: "",
    fatherName: "Hassan Sample",
    fullName: "Ahmed Hassan",
    spouse: "Fatima Ahmed",
    surname: "Sample"
  },
  {
    birthDate: "1958-09-03",
    birthPlace: "Example Town",
    children: 3,
    confidence: "Likely",
    deathDate: "",
    fatherName: "Ibrahim Example",
    fullName: "Fatima Ibrahim",
    spouse: "Ahmed Hassan",
    surname: "Example"
  },
  {
    birthDate: "1931-01-28",
    birthPlace: "Demo Village",
    children: 6,
    confidence: "Approximate",
    deathDate: "2011-05-31",
    fatherName: "Yusuf Demo",
    fullName: "Hassan Yusuf",
    spouse: "",
    surname: "Demo"
  }
];

const reminders = {
  next: ["Ahmed Hassan - Birth", "Hassan Yusuf - Death"],
  past: ["Fatima Ibrahim - Birth"]
};

export default function App() {
  const [locale, setLocale] = useState<Locale>("en");
  const [query, setQuery] = useState("");

  const labels = useMemo(
    () => ({
      addPerson: t(locale, "addPerson"),
      appName: t(locale, "appName"),
      birthDate: t(locale, "birthDate"),
      birthPlace: t(locale, "birthPlace"),
      children: t(locale, "children"),
      confidence: t(locale, "confidence"),
      deathDate: t(locale, "deathDate"),
      export: t(locale, "export"),
      fatherName: t(locale, "fatherName"),
      filters: t(locale, "filters"),
      fullName: t(locale, "fullName"),
      graph: t(locale, "graph"),
      import: t(locale, "import"),
      language: t(locale, "language"),
      next5: t(locale, "next5"),
      past5: t(locale, "past5"),
      registry: t(locale, "registry"),
      reminders: t(locale, "reminders"),
      search: t(locale, "search"),
      spouse: t(locale, "spouse"),
      surname: t(locale, "surname"),
      tree: t(locale, "tree")
    }),
    [locale]
  );

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeMeta[locale].dir;
  }, [locale]);

  const filteredPeople = people.filter((person) => {
    const haystack = Object.values(person).join(" ").toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

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
          <button className="primary" type="button">
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
        </aside>

        <section className="registry" aria-label={labels.registry}>
          <div className="section-heading">
            <h1>{labels.registry}</h1>
            <span>{filteredPeople.length}</span>
          </div>

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
                  <th>{labels.spouse}</th>
                  <th>{labels.children}</th>
                  <th>{labels.confidence}</th>
                </tr>
              </thead>
              <tbody>
                {filteredPeople.map((person) => (
                  <tr key={`${person.fullName}-${person.fatherName}`}>
                    <td>{person.fullName}</td>
                    <td>{person.fatherName}</td>
                    <td>{person.surname}</td>
                    <td>{person.birthDate}</td>
                    <td>{person.birthPlace}</td>
                    <td>{person.deathDate || "-"}</td>
                    <td>{person.spouse || "-"}</td>
                    <td>{person.children}</td>
                    <td>{person.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="family-panel" aria-label={labels.tree}>
          <h2>{labels.tree}</h2>
          <div className="relation-list">
            <span>Hassan Yusuf</span>
            <strong>Ahmed Hassan</strong>
            <span>Fatima Ibrahim</span>
          </div>
        </aside>
      </main>

      <footer className="summary-bar">
        <section>
          <h2>{labels.past5}</h2>
          <ul>
            {reminders.past.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{labels.next5}</h2>
          <ul>
            {reminders.next.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </footer>
    </div>
  );
}

