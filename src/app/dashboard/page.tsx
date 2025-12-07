import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { maskSensitiveData } from "@/lib/deziClient";

// Type for login events (matches Prisma schema)
interface LoginEventData {
  id: string;
  userId: string;
  abonneeNummer: string;
  deziRoleCode: string;
  deziRoleName: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

// Icons
function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function ArrowRightOnRectangleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
    </svg>
  );
}

function IdentificationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
    </svg>
  );
}

export default async function DashboardPage() {
  // Get session - redirect if not authenticated
  const session = await getSession();
  
  if (!session) {
    redirect("/");
  }

  // Fetch user with recent login events
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      loginEvents: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("nl-NL", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
              <span className="font-semibold text-lg text-gray-900 dark:text-white">Dezi Gateway</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {session.displayName || session.rolNaam}
              </span>
              <Link
                href="/auth/logout"
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Uitloggen
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welkom, {session.displayName || session.rolNaam}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Je bent ingelogd via Dezi. Hieronder zie je je gegevens en recente login activiteit.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* User Info Card */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Gebruikersgegevens
              </h2>
            </div>

            <dl className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <dt className="text-sm text-gray-600 dark:text-gray-400">Dezi Nummer</dt>
                <dd className="text-sm font-mono text-gray-900 dark:text-white">
                  {maskSensitiveData(session.deziNummer)}
                </dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <dt className="text-sm text-gray-600 dark:text-gray-400">Abonnee Nummer</dt>
                <dd className="text-sm font-mono text-gray-900 dark:text-white">
                  {maskSensitiveData(session.abonneeNummer)}
                </dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <dt className="text-sm text-gray-600 dark:text-gray-400">Rol Code</dt>
                <dd className="text-sm font-mono text-gray-900 dark:text-white">
                  {session.rolCode}
                </dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <dt className="text-sm text-gray-600 dark:text-gray-400">Rol Naam</dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {session.rolNaam}
                </dd>
              </div>
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm text-gray-600 dark:text-gray-400">Account aangemaakt</dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {formatDate(user.createdAt)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Dezi Claims Card (Debug) */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <IdentificationIcon className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Dezi Claims (Debug)
              </h2>
            </div>

            <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs text-gray-300 font-mono">
{JSON.stringify({
  dezi_nummer: maskSensitiveData(session.deziNummer),
  abonnee_nummer: maskSensitiveData(session.abonneeNummer),
  rol_code: session.rolCode,
  rol_naam: session.rolNaam,
  user_id: session.userId,
  session_created: new Date(session.createdAt).toISOString(),
  session_expires: new Date(session.expiresAt).toISOString(),
}, null, 2)}
              </pre>
            </div>

            <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
              * Gevoelige gegevens zijn gemaskeerd voor veiligheid. In productie worden deze 
              gegevens nooit in logs of debug output getoond.
            </p>
          </div>
        </div>

        {/* Login Events */}
        <div className="card p-6 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recente Login Activiteit
            </h2>
          </div>

          {user.loginEvents.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Geen login events gevonden.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Datum</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Rol</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Abonnee</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">IP Adres</th>
                  </tr>
                </thead>
                <tbody>
                  {user.loginEvents.map((event: LoginEventData) => (
                    <tr 
                      key={event.id} 
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {formatDate(event.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                          {event.deziRoleName}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-600 dark:text-gray-400">
                        {maskSensitiveData(event.abonneeNummer)}
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-600 dark:text-gray-400">
                        {event.ipAddress || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
