"use client";

import Link from "next/link";
import { useState } from "react";
import { content } from "./content";

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

const sectionsNL = [
  { id: "overzicht", title: "Overzicht" },
  { id: "snelstart", title: "Snelstart" },
  { id: "authenticatie", title: "Authenticatie Flow" },
  { id: "configuratie", title: "Configuratie" },
  { id: "beveiliging", title: "Beveiliging" },
  { id: "database", title: "Database" },
  { id: "hoe-verder", title: "Hoe verder?" },
];

const sectionsEN = [
  { id: "overview", title: "Overview" },
  { id: "quickstart", title: "Quick Start" },
  { id: "authentication", title: "Authentication Flow" },
  { id: "configuration", title: "Configuration" },
  { id: "security", title: "Security" },
  { id: "database", title: "Database" },
  { id: "whats-next", title: "What's Next?" },
];

export default function DocsPage() {
  const [language, setLanguage] = useState<"nl" | "en">("nl");
  const sections = language === "nl" ? sectionsNL : sectionsEN;
  const t = content[language];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpenIcon className="w-7 h-7 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setLanguage("nl")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    language === "nl"
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  title="Nederlands"
                >
                  <span className="text-base">🇳🇱</span>
                  <span>NL</span>
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    language === "en"
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  title="English"
                >
                  <span className="text-base">🇬🇧</span>
                  <span>EN</span>
                </button>
              </div>
              <Link href="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                {t.home}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t.contents}</p>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="space-y-12">
            {/* Overview */}
            <section id={sections[0].id} className="card p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t.sections.overview.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{t.sections.overview.description}</p>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">{t.sections.overview.features.oidc.title}</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-400">{t.sections.overview.features.oidc.description}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">{t.sections.overview.features.jwe.title}</h4>
                  <p className="text-sm text-green-800 dark:text-green-400">{t.sections.overview.features.jwe.description}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">{t.sections.overview.features.session.title}</h4>
                  <p className="text-sm text-purple-800 dark:text-purple-400">{t.sections.overview.features.session.description}</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">{t.sections.overview.features.audit.title}</h4>
                  <p className="text-sm text-orange-800 dark:text-orange-400">{t.sections.overview.features.audit.description}</p>
                </div>
              </div>
            </section>

            {/* Quick Start */}
            <section id={sections[1].id} className="card p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t.sections.quickstart.title}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t.sections.quickstart.requirements.title}</h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                    {t.sections.quickstart.requirements.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t.sections.quickstart.installation.title}</h3>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300 font-mono">{t.sections.quickstart.installation.code}</pre>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t.sections.quickstart.structure.title}</h3>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-700 dark:text-gray-300 font-mono">{t.sections.quickstart.structure.code}</pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Authentication Flow */}
            <section id={sections[2].id} className="card p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t.sections.authentication.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{t.sections.authentication.description}</p>
              
              <div className="space-y-6">
                {t.sections.authentication.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{step.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{step.description}</p>
                      {step.code && (
                        <div className="bg-gray-900 rounded-lg p-3 mt-2 overflow-x-auto">
                          <code className="text-xs text-gray-300">{step.code}</code>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">{t.sections.authentication.claims.title}</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">{t.sections.authentication.claims.description}</p>
                <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                  {t.sections.authentication.claims.items.map((claim, i) => (
                    <li key={i}>
                      <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">{claim.key}</code> - {claim.description}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Configuration */}
            <section id={sections[3].id} className="card p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t.sections.configuration.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{t.sections.configuration.description}</p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">{language === "nl" ? "Variabele" : "Variable"}</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">{language === "nl" ? "Beschrijving" : "Description"}</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">{language === "nl" ? "Verplicht" : "Required"}</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 dark:text-gray-400">
                    {t.sections.configuration.variables.map((v, i) => (
                      <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-2 font-mono text-xs">{v.name}</td>
                        <td className="py-3 px-2">{v.description}</td>
                        <td className="py-3 px-2">{v.required ? (language === "nl" ? "Ja" : "Yes") : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">{t.sections.configuration.secretGeneration.title}</h4>
                <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                  <code className="text-xs text-gray-300">{t.sections.configuration.secretGeneration.code}</code>
                </div>
              </div>
            </section>

            {/* Security */}
            <section id={sections[4].id} className="card p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t.sections.security.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{t.sections.security.description}</p>

              <div className="space-y-6">
                {t.sections.security.features.map((feature, i) => (
                  <div key={i} className={`border-l-4 border-${feature.color}-500 pl-4`}>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Database */}
            <section id={sections[5].id} className="card p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t.sections.database.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{t.sections.database.description}</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t.sections.database.userModel.title}</h3>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300 font-mono">{t.sections.database.userModel.code}</pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t.sections.database.loginEventModel.title}</h3>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300 font-mono">{t.sections.database.loginEventModel.code}</pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t.sections.database.commands.title}</h3>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
                    {t.sections.database.commands.items.map((cmd, i) => (
                      <div key={i}>
                        <code className="font-mono">{cmd.command}</code> - {cmd.description}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* What's Next */}
            <section id={sections[6].id} className="card p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t.sections.extending.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{t.sections.extending.description}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{t.sections.extending.note}</p>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">{t.sections.extending.reusable.title}</h4>
                <p className="text-sm text-blue-800 dark:text-blue-400">{t.sections.extending.reusable.description}</p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
