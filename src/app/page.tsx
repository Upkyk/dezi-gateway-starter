import Link from "next/link";

// Icons as simple SVG components
function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  );
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
    </svg>
  );
}

function ServerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 0 0-.12-1.03l-2.268-9.64a3.375 3.375 0 0 0-3.285-2.602H7.923a3.375 3.375 0 0 0-3.285 2.602l-2.268 9.64a4.5 4.5 0 0 0-.12 1.03v.228m19.5 0a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3m19.5 0a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3m16.5 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Z" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );
}

export default function Home({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  const error = searchParams.error;
  const errorMessage = searchParams.message;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
              <span className="font-semibold text-lg">Dezi Gateway</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/docs" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium">
                Documentatie
              </Link>
              <Link href="/auth/dezi/login" className="btn-primary text-sm py-2 px-4">
                Inloggen met Dezi
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mx-4 mt-4 max-w-7xl lg:mx-auto">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-400">
                <strong>Fout:</strong> {errorMessage || "Er is een fout opgetreden bij het inloggen."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                Dezi Gateway
                <span className="block text-blue-600">Dev Starter</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Een schone, goed gestructureerde starter kit voor het integreren van{" "}
                <strong>Dezi</strong> (Nederlandse zorg-identiteit) in moderne webapplicaties 
                met behulp van OpenID Connect.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/dezi/login" className="btn-primary">
                  <KeyIcon className="w-5 h-5 mr-2" />
                  Inloggen met Dezi
                </Link>
                <Link href="/auth/demo/login" className="btn-secondary">
                  <ShieldCheckIcon className="w-5 h-5 mr-2" />
                  Demo Dashboard
                </Link>
                <Link href="/docs" className="btn-secondary">
                  <DocumentIcon className="w-5 h-5 mr-2" />
                  Documentatie
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                💡 Gebruik &quot;Demo Dashboard&quot; om de UI te bekijken zonder Dezi credentials
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Wat zit er in deze starter?
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Alles wat je nodig hebt om Dezi-authenticatie te implementeren
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="card p-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Dezi OIDC Integratie
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Volledige implementatie van Authorization Code Flow met PKCE, 
                  conform NL GOV profielen voor maximale veiligheid.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card p-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                  <KeyIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  JWE + JWS Validatie
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Veilige verwerking van versleutelde en ondertekende tokens 
                  met de jose library. Inclusief JWKS endpoint validatie.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card p-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <ServerIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Sessie Management
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Veilige httpOnly cookies voor sessiebeheer met een 
                  voorbeeld dashboard voor het tonen van gebruikersgegevens.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Hoe werkt het?
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Gebruiker klikt op &quot;Inloggen met Dezi&quot;</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">De applicatie genereert PKCE parameters en redirect naar Dezi.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Authenticatie bij Dezi</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">De gebruiker logt in met hun Dezi-credentials.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Token Exchange & Validatie</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">De callback ontvangt een code, wisselt deze voor tokens, en valideert de JWE/JWS.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Sessie Aanmaken</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Een veilige applicatie-sessie wordt aangemaakt en de gebruiker wordt doorgestuurd naar het dashboard.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card p-6 bg-gray-900 dark:bg-gray-950">
                <pre className="text-sm text-gray-300 overflow-x-auto">
                  <code>{`// Voorbeeld: Dezi claims na succesvolle login
{
  "dezi_nummer": "****1234",
  "abonnee_nummer": "****5678",
  "rol_code": "01",
  "rol_naam": "Huisarts",
  "iss": "https://dezi.nl",
  "aud": "your-client-id",
  "exp": 1699999999,
  "iat": 1699996399
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <ShieldCheckIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Dezi Gateway Dev Starter</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500 max-w-2xl">
              Een starter kit voor Dezi OIDC integratie. Niet voor productiegebruik zonder aanpassingen.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 max-w-3xl">
              Onafhankelijk ontwikkeld door <a href="https://upkyk.nl" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 dark:hover:text-gray-400 underline">Upkyk</a>. 
              Niet gelieerd aan of ondersteund door Dezi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
