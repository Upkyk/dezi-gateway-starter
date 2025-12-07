"use client";

import Link from "next/link";
import { useState } from "react";

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

// Navigation sections
const sectionsNL = [
  { id: "overzicht", title: "Overzicht" },
  { id: "snelstart", title: "Snelstart" },
  { id: "authenticatie", title: "Authenticatie Flow" },
  { id: "configuratie", title: "Configuratie" },
  { id: "beveiliging", title: "Beveiliging" },
  { id: "database", title: "Database" },
  { id: "uitbreiden", title: "Uitbreiden" },
];

const sectionsEN = [
  { id: "overview", title: "Overview" },
  { id: "quickstart", title: "Quick Start" },
  { id: "authentication", title: "Authentication Flow" },
  { id: "configuration", title: "Configuration" },
  { id: "security", title: "Security" },
  { id: "database", title: "Database" },
  { id: "extending", title: "Extending" },
];

export default function DocsPage() {
  const [language, setLanguage] = useState<"nl" | "en">("nl");
  const sections = language === "nl" ? sectionsNL : sectionsEN;
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpenIcon className="w-7 h-7 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {language === "nl" ? "Documentatie" : "Documentation"}
              </h1>
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
                {language === "nl" ? "Home" : "Home"}
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
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {language === "nl" ? "Inhoud" : "Contents"}
              </p>
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
            {/* Overview / Overzicht */}
            <section id={language === "nl" ? "overzicht" : "overview"} className="card p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {language === "nl" ? "Overzicht" : "Overview"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {language === "nl" 
                  ? "De Dezi Gateway Dev Starter is een referentie-implementatie voor het integreren van Dezi (Nederlandse zorg-identiteit) in moderne webapplicaties met OpenID Connect."
                  : "The Dezi Gateway Dev Starter is a reference implementation for integrating Dezi (Dutch healthcare identity) into modern web applications using OpenID Connect."
                }
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">OIDC + PKCE</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    {language === "nl"
                      ? "Authorization Code Flow met Proof Key for Code Exchange"
                      : "Authorization Code Flow with Proof Key for Code Exchange"
                    }
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">JWE/JWS</h4>
                  <p className="text-sm text-green-800 dark:text-green-400">
                    {language === "nl"
                      ? "Ontsleuteling en verificatie van Dezi tokens"
                      : "Decryption and verification of Dezi tokens"
                    }
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
                    {language === "nl" ? "Sessiebeheer" : "Session Management"}
                  </h4>
                  <p className="text-sm text-purple-800 dark:text-purple-400">
                    {language === "nl"
                      ? "Veilige httpOnly cookies met JWT"
                      : "Secure httpOnly cookies with JWT"
                    }
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">
                    {language === "nl" ? "Audit Logging" : "Audit Logging"}
                  </h4>
                  <p className="text-sm text-orange-800 dark:text-orange-400">
                    {language === "nl"
                      ? "Automatische registratie van login events"
                      : "Automatic registration of login events"
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* Snelstart */}
            <section id="snelstart" className="card p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Snelstart</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Vereisten</h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                    <li>Node.js 20.14 of hoger</li>
                    <li>PostgreSQL database</li>
                    <li>Dezi credentials (client ID + private key)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Installatie</h3>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300 font-mono">{`# Clone en installeer
git clone <repository-url>
cd dezi-gateway
npm install

# Configureer environment
cp .env.example .env.local
# Bewerk .env.local met je waarden

# Database setup
npx prisma generate
npx prisma migrate dev --name init

# Start development server
npm run dev`}</pre>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Projectstructuur</h3>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-700 dark:text-gray-300 font-mono">{`src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── docs/page.tsx         # Deze pagina
│   ├── dashboard/page.tsx    # Beveiligd dashboard
│   └── auth/
│       ├── dezi/login/       # Start OIDC flow
│       ├── dezi/callback/    # Verwerk callback
│       └── logout/           # Beëindig sessie
├── lib/
│   ├── deziClient.ts         # OIDC client
│   ├── session.ts            # Sessiebeheer
│   └── db.ts                 # Prisma client
└── middleware.ts             # Route beveiliging`}</pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Authenticatie Flow */}
            <section id="authenticatie" className="card p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Authenticatie Flow</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                De authenticatie volgt het OpenID Connect Authorization Code Flow met PKCE patroon.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Login Initiatie</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Gebruiker klikt op &quot;Inloggen met Dezi&quot;. De applicatie genereert PKCE parameters 
                      (code_verifier, code_challenge), state en nonce, slaat deze op in een cookie, 
                      en redirect naar Dezi&apos;s authorization endpoint.
                    </p>
                    <div className="bg-gray-900 rounded-lg p-3 mt-2 overflow-x-auto">
                      <code className="text-xs text-gray-300">{`GET /auth/dezi/login → Redirect naar Dezi`}</code>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Authenticatie bij Dezi</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Gebruiker logt in bij Dezi met hun credentials. Na succesvolle authenticatie 
                      redirect Dezi terug met een authorization code.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Callback Verwerking</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      De callback route valideert de state, wisselt de code voor tokens, 
                      haalt userinfo op (JWE), ontsleutelt met de private key, en verifieert de JWS.
                    </p>
                    <div className="bg-gray-900 rounded-lg p-3 mt-2 overflow-x-auto">
                      <code className="text-xs text-gray-300">{`GET /auth/dezi/callback?code=...&state=...`}</code>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Sessie Aanmaken</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Na succesvolle verificatie wordt de gebruiker opgeslagen/bijgewerkt in de database, 
                      een login event gelogd, en een sessie cookie aangemaakt.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Dezi Claims</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">Na succesvolle authenticatie ontvang je deze claims:</p>
                <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                  <li><code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">dezi_nummer</code> - Unieke Dezi identifier</li>
                  <li><code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">abonnee_nummer</code> - Abonneenummer</li>
                  <li><code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">rol_code</code> - Rolcode (bijv. &quot;01&quot;)</li>
                  <li><code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">rol_naam</code> - Rolnaam (bijv. &quot;Huisarts&quot;)</li>
                </ul>
              </div>
            </section>

            {/* Configuratie */}
            <section id="configuratie" className="card p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Configuratie</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Alle configuratie gebeurt via environment variabelen in <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">.env.local</code>.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Variabele</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Beschrijving</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Verplicht</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 dark:text-gray-400">
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-2 font-mono text-xs">DATABASE_URL</td>
                      <td className="py-3 px-2">PostgreSQL connection string</td>
                      <td className="py-3 px-2">Ja</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-2 font-mono text-xs">SESSION_SECRET</td>
                      <td className="py-3 px-2">Geheim voor sessie tokens (min. 32 karakters)</td>
                      <td className="py-3 px-2">Ja</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-2 font-mono text-xs">NEXT_PUBLIC_APP_URL</td>
                      <td className="py-3 px-2">Basis URL van je applicatie</td>
                      <td className="py-3 px-2">Ja</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-2 font-mono text-xs">DEZI_ISSUER</td>
                      <td className="py-3 px-2">Dezi OIDC issuer URL</td>
                      <td className="py-3 px-2">Ja</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-2 font-mono text-xs">DEZI_CLIENT_ID</td>
                      <td className="py-3 px-2">Je Dezi client ID</td>
                      <td className="py-3 px-2">Ja</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-2 font-mono text-xs">DEZI_REDIRECT_URI</td>
                      <td className="py-3 px-2">OAuth callback URL</td>
                      <td className="py-3 px-2">Ja</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-mono text-xs">DEZI_PRIVATE_KEY</td>
                      <td className="py-3 px-2">PEM private key voor JWE ontsleuteling</td>
                      <td className="py-3 px-2">Ja</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Sessie Secret Genereren</h4>
                <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                  <code className="text-xs text-gray-300">openssl rand -base64 32</code>
                </div>
              </div>
            </section>

            {/* Beveiliging */}
            <section id="beveiliging" className="card p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Beveiliging</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Deze starter implementeert beveiligingsbest practices conform NL GOV OIDC profielen.
              </p>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">PKCE (Proof Key for Code Exchange)</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Altijd S256 methode. Voorkomt authorization code interception attacks.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">State & Nonce Validatie</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    State voorkomt CSRF, nonce voorkomt replay attacks. Beide als UUID v4.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Token Validatie</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Verificatie van issuer, audience, expiration, not-before, en nonce claims.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Cookie Beveiliging</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    httpOnly, secure (productie), sameSite=strict. Sessieduur: 8 uur.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Data Maskering</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Gevoelige identifiers worden gemaskeerd in UI en logs (alleen laatste 4 karakters zichtbaar).
                  </p>
                </div>
              </div>
            </section>

            {/* Database */}
            <section id="database" className="card p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Database</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                PostgreSQL met Prisma ORM. Twee modellen: User en LoginEvent.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">User Model</h3>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300 font-mono">{`model User {
  id          String   @id @default(uuid())
  deziNummer  String   @unique
  displayName String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  loginEvents LoginEvent[]
}`}</pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">LoginEvent Model</h3>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300 font-mono">{`model LoginEvent {
  id            String   @id @default(uuid())
  userId        String
  abonneeNummer String
  deziRoleCode  String
  deziRoleName  String
  ipAddress     String?
  userAgent     String?
  createdAt     DateTime @default(now())
  user          User     @relation(...)
}`}</pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Handige Commando&apos;s</h3>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
                    <div><code className="font-mono">npx prisma generate</code> - Genereer Prisma client</div>
                    <div><code className="font-mono">npx prisma migrate dev</code> - Voer migraties uit</div>
                    <div><code className="font-mono">npx prisma studio</code> - Open database browser</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Uitbreiden */}
            <section id="uitbreiden" className="card p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Uitbreiden</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Deze starter is ontworpen om uitgebreid te worden naar een multi-tenant SaaS.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Multi-tenancy</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Voeg Organization model toe en implementeer tenant isolatie.
                  </p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">RBAC</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Breid sessie uit met permissies en voeg middleware checks toe.
                  </p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">API Layer</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Voeg REST of GraphQL API toe voor externe integraties.
                  </p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Management</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Gebruik HSM of secret manager voor productie key storage.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Herbruikbare Module</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  De <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">deziClient.ts</code> module is 
                  framework-agnostisch en kan worden hergebruikt in Express, Fastify, NestJS, of andere Node.js frameworks.
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
