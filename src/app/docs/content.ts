// Documentation content in both languages

export const content = {
  nl: {
    title: "Documentatie",
    home: "Home",
    contents: "Inhoud",
    sections: {
      overview: {
        title: "Overzicht",
        description: "De Dezi Gateway Dev Starter is een referentie-implementatie voor het integreren van Dezi (Nederlandse zorg-identiteit) in moderne webapplicaties met OpenID Connect.",
        features: {
          oidc: {
            title: "OIDC + PKCE",
            description: "Authorization Code Flow met Proof Key for Code Exchange"
          },
          jwe: {
            title: "JWE/JWS",
            description: "Ontsleuteling en verificatie van Dezi tokens"
          },
          session: {
            title: "Sessiebeheer",
            description: "Veilige httpOnly cookies met JWT"
          },
          audit: {
            title: "Audit Logging",
            description: "Automatische registratie van login events"
          }
        }
      },
      quickstart: {
        title: "Snelstart",
        requirements: {
          title: "Vereisten",
          items: [
            "Node.js 20.14 of hoger",
            "PostgreSQL database",
            "Dezi credentials (client ID + private key)"
          ]
        },
        installation: {
          title: "Installatie",
          code: `# Clone en installeer
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
npm run dev`
        },
        structure: {
          title: "Projectstructuur",
          code: `src/
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
└── middleware.ts             # Route beveiliging`
        }
      },
      authentication: {
        title: "Authenticatie Flow",
        description: "De authenticatie volgt het OpenID Connect Authorization Code Flow met PKCE patroon.",
        steps: [
          {
            title: "Login Initiatie",
            description: 'Gebruiker klikt op "Inloggen met Dezi". De applicatie genereert PKCE parameters (code_verifier, code_challenge), state en nonce, slaat deze op in een cookie, en redirect naar Dezi\'s authorization endpoint.',
            code: "GET /auth/dezi/login → Redirect naar Dezi"
          },
          {
            title: "Authenticatie bij Dezi",
            description: "Gebruiker logt in bij Dezi met hun credentials. Na succesvolle authenticatie redirect Dezi terug met een authorization code."
          },
          {
            title: "Callback Verwerking",
            description: "De callback route valideert de state, wisselt de code voor tokens, haalt userinfo op (JWE), ontsleutelt met de private key, en verifieert de JWS.",
            code: "GET /auth/dezi/callback?code=...&state=..."
          },
          {
            title: "Sessie Aanmaken",
            description: "Na succesvolle verificatie wordt de gebruiker opgeslagen/bijgewerkt in de database, een login event gelogd, en een sessie cookie aangemaakt."
          }
        ],
        claims: {
          title: "Dezi Claims",
          description: "Na succesvolle authenticatie ontvang je deze claims:",
          items: [
            { key: "dezi_nummer", description: "Unieke Dezi identifier" },
            { key: "abonnee_nummer", description: "Abonneenummer" },
            { key: "rol_code", description: 'Rolcode (bijv. "01")' },
            { key: "rol_naam", description: 'Rolnaam (bijv. "Huisarts")' }
          ]
        }
      },
      configuration: {
        title: "Configuratie",
        description: "Alle configuratie gebeurt via environment variabelen in .env.local.",
        secretGeneration: {
          title: "Sessie Secret Genereren",
          code: "openssl rand -base64 32"
        },
        variables: [
          { name: "DATABASE_URL", description: "PostgreSQL connection string", required: true },
          { name: "SESSION_SECRET", description: "Geheim voor sessie tokens (min. 32 karakters)", required: true },
          { name: "NEXT_PUBLIC_APP_URL", description: "Basis URL van je applicatie", required: true },
          { name: "DEZI_ISSUER", description: "Dezi OIDC issuer URL", required: true },
          { name: "DEZI_CLIENT_ID", description: "Je Dezi client ID", required: true },
          { name: "DEZI_REDIRECT_URI", description: "OAuth callback URL", required: true },
          { name: "DEZI_PRIVATE_KEY", description: "PEM private key voor JWE ontsleuteling", required: true }
        ]
      },
      security: {
        title: "Beveiliging",
        description: "Deze starter implementeert beveiligingsbest practices conform NL GOV OIDC profielen.",
        features: [
          {
            title: "PKCE (Proof Key for Code Exchange)",
            description: "Altijd S256 methode. Voorkomt authorization code interception attacks.",
            color: "blue"
          },
          {
            title: "State & Nonce Validatie",
            description: "State voorkomt CSRF, nonce voorkomt replay attacks. Beide als UUID v4.",
            color: "green"
          },
          {
            title: "Token Validatie",
            description: "Verificatie van issuer, audience, expiration, not-before, en nonce claims.",
            color: "purple"
          },
          {
            title: "Cookie Beveiliging",
            description: "httpOnly, secure (productie), sameSite=strict. Sessieduur: 8 uur.",
            color: "orange"
          },
          {
            title: "Data Maskering",
            description: "Gevoelige identifiers worden gemaskeerd in UI en logs (alleen laatste 4 karakters zichtbaar).",
            color: "red"
          }
        ]
      },
      database: {
        title: "Database",
        description: "PostgreSQL met Prisma ORM. Twee modellen: User en LoginEvent.",
        userModel: {
          title: "User Model",
          code: `model User {
  id          String   @id @default(uuid())
  deziNummer  String   @unique
  displayName String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  loginEvents LoginEvent[]
}`
        },
        loginEventModel: {
          title: "LoginEvent Model",
          code: `model LoginEvent {
  id            String   @id @default(uuid())
  userId        String
  abonneeNummer String
  deziRoleCode  String
  deziRoleName  String
  ipAddress     String?
  userAgent     String?
  createdAt     DateTime @default(now())
  user          User     @relation(...)
}`
        },
        commands: {
          title: "Handige Commando's",
          items: [
            { command: "npx prisma generate", description: "Genereer Prisma client" },
            { command: "npx prisma migrate dev", description: "Voer migraties uit" },
            { command: "npx prisma studio", description: "Open database browser" }
          ]
        }
      },
      extending: {
        title: "Hoe verder?",
        description: "Deze starter is bedoeld als referentie-implementatie voor Dezi-authenticatie. Je kunt de code aanpassen en uitbreiden in elke richting die jouw project nodig heeft.",
        note: "De implementatie laat zien hoe je veilig met Dezi OIDC integreert, maar schrijft geen specifieke applicatie-architectuur voor.",
        reusable: {
          title: "Herbruikbare Module",
          description: "De deziClient.ts module is framework-agnostisch en kan worden hergebruikt in Express, Fastify, NestJS, of andere Node.js frameworks."
        }
      }
    }
  },
  en: {
    title: "Documentation",
    home: "Home",
    contents: "Contents",
    sections: {
      overview: {
        title: "Overview",
        description: "The Dezi Gateway Dev Starter is a reference implementation for integrating Dezi (Dutch healthcare identity) into modern web applications using OpenID Connect.",
        features: {
          oidc: {
            title: "OIDC + PKCE",
            description: "Authorization Code Flow with Proof Key for Code Exchange"
          },
          jwe: {
            title: "JWE/JWS",
            description: "Decryption and verification of Dezi tokens"
          },
          session: {
            title: "Session Management",
            description: "Secure httpOnly cookies with JWT"
          },
          audit: {
            title: "Audit Logging",
            description: "Automatic registration of login events"
          }
        }
      },
      quickstart: {
        title: "Quick Start",
        requirements: {
          title: "Requirements",
          items: [
            "Node.js 20.14 or higher",
            "PostgreSQL database",
            "Dezi credentials (client ID + private key)"
          ]
        },
        installation: {
          title: "Installation",
          code: `# Clone and install
git clone <repository-url>
cd dezi-gateway
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your values

# Database setup
npx prisma generate
npx prisma migrate dev --name init

# Start development server
npm run dev`
        },
        structure: {
          title: "Project Structure",
          code: `src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── docs/page.tsx         # This page
│   ├── dashboard/page.tsx    # Protected dashboard
│   └── auth/
│       ├── dezi/login/       # Start OIDC flow
│       ├── dezi/callback/    # Process callback
│       └── logout/           # End session
├── lib/
│   ├── deziClient.ts         # OIDC client
│   ├── session.ts            # Session management
│   └── db.ts                 # Prisma client
└── middleware.ts             # Route protection`
        }
      },
      authentication: {
        title: "Authentication Flow",
        description: "The authentication follows the OpenID Connect Authorization Code Flow with PKCE pattern.",
        steps: [
          {
            title: "Login Initiation",
            description: 'User clicks "Login with Dezi". The application generates PKCE parameters (code_verifier, code_challenge), state and nonce, stores them in a cookie, and redirects to Dezi\'s authorization endpoint.',
            code: "GET /auth/dezi/login → Redirect to Dezi"
          },
          {
            title: "Authentication at Dezi",
            description: "User logs in at Dezi with their credentials. After successful authentication, Dezi redirects back with an authorization code."
          },
          {
            title: "Callback Processing",
            description: "The callback route validates the state, exchanges the code for tokens, fetches userinfo (JWE), decrypts with the private key, and verifies the JWS.",
            code: "GET /auth/dezi/callback?code=...&state=..."
          },
          {
            title: "Session Creation",
            description: "After successful verification, the user is saved/updated in the database, a login event is logged, and a session cookie is created."
          }
        ],
        claims: {
          title: "Dezi Claims",
          description: "After successful authentication you receive these claims:",
          items: [
            { key: "dezi_nummer", description: "Unique Dezi identifier" },
            { key: "abonnee_nummer", description: "Subscriber number" },
            { key: "rol_code", description: 'Role code (e.g. "01")' },
            { key: "rol_naam", description: 'Role name (e.g. "General Practitioner")' }
          ]
        }
      },
      configuration: {
        title: "Configuration",
        description: "All configuration is done via environment variables in .env.local.",
        secretGeneration: {
          title: "Generate Session Secret",
          code: "openssl rand -base64 32"
        },
        variables: [
          { name: "DATABASE_URL", description: "PostgreSQL connection string", required: true },
          { name: "SESSION_SECRET", description: "Secret for session tokens (min. 32 characters)", required: true },
          { name: "NEXT_PUBLIC_APP_URL", description: "Base URL of your application", required: true },
          { name: "DEZI_ISSUER", description: "Dezi OIDC issuer URL", required: true },
          { name: "DEZI_CLIENT_ID", description: "Your Dezi client ID", required: true },
          { name: "DEZI_REDIRECT_URI", description: "OAuth callback URL", required: true },
          { name: "DEZI_PRIVATE_KEY", description: "PEM private key for JWE decryption", required: true }
        ]
      },
      security: {
        title: "Security",
        description: "This starter implements security best practices according to NL GOV OIDC profiles.",
        features: [
          {
            title: "PKCE (Proof Key for Code Exchange)",
            description: "Always S256 method. Prevents authorization code interception attacks.",
            color: "blue"
          },
          {
            title: "State & Nonce Validation",
            description: "State prevents CSRF, nonce prevents replay attacks. Both as UUID v4.",
            color: "green"
          },
          {
            title: "Token Validation",
            description: "Verification of issuer, audience, expiration, not-before, and nonce claims.",
            color: "purple"
          },
          {
            title: "Cookie Security",
            description: "httpOnly, secure (production), sameSite=strict. Session duration: 8 hours.",
            color: "orange"
          },
          {
            title: "Data Masking",
            description: "Sensitive identifiers are masked in UI and logs (only last 4 characters visible).",
            color: "red"
          }
        ]
      },
      database: {
        title: "Database",
        description: "PostgreSQL with Prisma ORM. Two models: User and LoginEvent.",
        userModel: {
          title: "User Model",
          code: `model User {
  id          String   @id @default(uuid())
  deziNummer  String   @unique
  displayName String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  loginEvents LoginEvent[]
}`
        },
        loginEventModel: {
          title: "LoginEvent Model",
          code: `model LoginEvent {
  id            String   @id @default(uuid())
  userId        String
  abonneeNummer String
  deziRoleCode  String
  deziRoleName  String
  ipAddress     String?
  userAgent     String?
  createdAt     DateTime @default(now())
  user          User     @relation(...)
}`
        },
        commands: {
          title: "Useful Commands",
          items: [
            { command: "npx prisma generate", description: "Generate Prisma client" },
            { command: "npx prisma migrate dev", description: "Run migrations" },
            { command: "npx prisma studio", description: "Open database browser" }
          ]
        }
      },
      extending: {
        title: "What's Next?",
        description: "This starter is intended as a reference implementation for Dezi authentication. You can adapt and extend the code in any direction your project needs.",
        note: "The implementation shows how to securely integrate with Dezi OIDC, but does not prescribe a specific application architecture.",
        reusable: {
          title: "Reusable Module",
          description: "The deziClient.ts module is framework-agnostic and can be reused in Express, Fastify, NestJS, or other Node.js frameworks."
        }
      }
    }
  }
};
