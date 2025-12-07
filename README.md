# Dezi Gateway Dev Starter

Een schone, goed gestructureerde starter kit voor het integreren van **Dezi** (Nederlandse zorg-identiteit) in moderne webapplicaties met behulp van OpenID Connect.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## Overzicht

Deze starter kit laat zien hoe je Dezi-authenticatie implementeert in een moderne JavaScript/TypeScript stack, met een volledige Next.js-referentie-implementatie.

Belangrijk: deze starter verwerkt alleen Dezi identiteitsgegevens (claims zoals dezi_nummer en rol), en geen medische dossiers of patiëntdata.

### Wat zit erin?

- **Dezi OIDC Integratie** - Volledige Authorization Code Flow met PKCE
- **JWE/JWS Verwerking** - Ontsleutelen en verifiëren van Dezi userinfo tokens
- **Sessiebeheer** - Veilige httpOnly cookie-gebaseerde sessies
- **Ontwikkelaar Dashboard** - Bekijk ingelogde gebruikersinfo en login geschiedenis
- **Audit Logging** - Automatische registratie van alle login events

### Waarom deze starter?

Dezi is de Nederlandse zorg-identiteitsoplossing die wordt gebruikt door zorgverleners. Het implementeren van Dezi-authenticatie vereist:

1. OpenID Connect met PKCE (verplicht voor NL GOV profielen)
2. JWE-ontsleuteling van de userinfo response
3. JWS-verificatie van de binnenste assertion
4. Correcte validatie van claims zoals `dezi_nummer`, `abonnee_nummer`, en rolgegevens

Deze starter kit biedt een werkende referentie-implementatie die je kunt gebruiken als basis voor je eigen applicatie.

---

## Status en wijzigingen Dezi-specificatie

Deze starter kit is gebaseerd op de op dit moment publiek beschikbare koppelvlakspecificaties van Dezi.  
Dezi en de onderliggende specificaties zijn nog in ontwikkeling, dus gedrag, endpoints of claims kunnen in de toekomst veranderen.  
Deze codebase is bedoeld als referentie-implementatie en biedt geen garantie op volledige toekomstbestendige compatibiliteit.

---

## Tech Stack

| Component | Technologie | Versie |
|-----------|-------------|--------|
| **Framework** | Next.js (App Router) | 14.x |
| **Taal** | TypeScript | 5.x |
| **Database** | PostgreSQL + Prisma ORM | 5.x |
| **Cryptografie** | jose | 5.x |
| **Styling** | Tailwind CSS | 3.x |

---

## Snelstart

### Vereisten

- **Node.js** 20.14 of hoger
- **PostgreSQL** database (lokaal of remote)
- **Dezi credentials** (client ID en private key van je Dezi registratie)

### Installatie

```bash
# 1. Clone of download dit project
git clone <repository-url>
cd dezi-gateway

# 2. Installeer dependencies
npm install

# 3. Kopieer environment variabelen
cp .env.example .env.local

# 4. Configureer .env.local (zie sectie hieronder)

# 5. Genereer Prisma client
npx prisma generate

# 6. Voer database migraties uit
npx prisma migrate dev --name init

# 7. Start de development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) om de landing page te bekijken.

### Demo Mode gebruiken

Deze starter bevat een optionele demo mode zodat je het dashboard en sessiebeheer kunt testen zonder echte Dezi-credentials.

Bekijk de volledige uitleg in:  
➡️ **[QUICK_SETUP.md](QUICK_SETUP.md)**

Demo mode gebruikt geen echte Dezi-verificatie en is alleen bedoeld voor lokale ontwikkeling en UI-tests. De demo mode is automatisch uitgeschakeld in productie.

### Environment Variabelen Configureren

Bewerk `.env.local` met je eigen waarden:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dezi_gateway"

# Sessie (genereer met: openssl rand -base64 32)
SESSION_SECRET="jouw-geheime-sleutel-minimaal-32-karakters"

# Applicatie URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Dezi OIDC configuratie
DEZI_ISSUER="https://auth.dezi.nl"
DEZI_CLIENT_ID="jouw-client-id"
DEZI_REDIRECT_URI="http://localhost:3000/auth/dezi/callback"

# Private key voor JWE ontsleuteling (PEM formaat)
DEZI_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

> **Let op**: De `DEZI_PRIVATE_KEY` moet in PEM formaat zijn met `\n` voor regelovergangen. De bijbehorende public key moet geregistreerd zijn bij Dezi.

---

## Projectstructuur

```
dezi-gateway/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Landing page (publiek)
│   │   ├── docs/page.tsx             # Documentatie pagina
│   │   ├── dashboard/page.tsx        # Gebruikersdashboard (beveiligd)
│   │   └── auth/
│   │       ├── dezi/
│   │       │   ├── login/route.ts    # Start OIDC flow
│   │       │   └── callback/route.ts # Verwerkt OIDC callback
│   │       └── logout/route.ts       # Beëindigt sessie
│   │
│   ├── lib/                          # Gedeelde libraries
│   │   ├── deziClient.ts             # Dezi OIDC client (herbruikbaar)
│   │   ├── session.ts                # Sessiebeheer
│   │   └── db.ts                     # Prisma client singleton
│   │
│   └── middleware.ts                 # Route beveiliging
│
├── prisma/
│   └── schema.prisma                 # Database schema
│
├── .env.example                      # Voorbeeld environment variabelen
└── README.md                         # Deze documentatie
```

---

## Authenticatie Flow

De authenticatie flow volgt het OpenID Connect Authorization Code Flow met PKCE patroon:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │     │  Dezi GW    │     │    Dezi     │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │ 1. Klik "Login"   │                   │
       │──────────────────>│                   │
       │                   │                   │
       │                   │ 2. Genereer PKCE  │
       │                   │    (verifier,     │
       │                   │     challenge)    │
       │                   │                   │
       │ 3. Redirect       │                   │
       │<──────────────────│                   │
       │                   │                   │
       │ 4. Authenticeer bij Dezi              │
       │──────────────────────────────────────>│
       │                   │                   │
       │ 5. Redirect met code                  │
       │<──────────────────────────────────────│
       │                   │                   │
       │ 6. Callback       │                   │
       │──────────────────>│                   │
       │                   │                   │
       │                   │ 7. Exchange code  │
       │                   │──────────────────>│
       │                   │                   │
       │                   │ 8. Tokens         │
       │                   │<──────────────────│
       │                   │                   │
       │                   │ 9. Fetch userinfo │
       │                   │──────────────────>│
       │                   │                   │
       │                   │ 10. JWE response  │
       │                   │<──────────────────│
       │                   │                   │
       │                   │ 11. Decrypt JWE   │
       │                   │     Verify JWS    │
       │                   │     Extract claims│
       │                   │                   │
       │ 12. Sessie cookie │                   │
       │<──────────────────│                   │
       │                   │                   │
       │ 13. Redirect naar │                   │
       │     dashboard     │                   │
       │<──────────────────│                   │
       │                   │                   │
```

### Stap-voor-stap uitleg

#### 1. Login Initiatie (`/auth/dezi/login`)

```typescript
// Genereer PKCE parameters
const codeVerifier = generateRandomString(32);
const codeChallenge = base64url(sha256(codeVerifier));
const state = generateUUID();
const nonce = generateUUID();

// Sla op in cookie voor callback
await storePKCESession({ codeVerifier, state, nonce });

// Redirect naar Dezi
redirect(`${authorizationEndpoint}?
  response_type=code&
  client_id=${clientId}&
  redirect_uri=${redirectUri}&
  scope=openid&
  state=${state}&
  nonce=${nonce}&
  code_challenge=${codeChallenge}&
  code_challenge_method=S256
`);
```

#### 2. Callback Verwerking (`/auth/dezi/callback`)

```typescript
// Valideer state
if (receivedState !== storedState) {
  throw new Error('State mismatch - mogelijke CSRF aanval');
}

// Wissel code voor tokens
const tokens = await exchangeCodeForTokens(code, codeVerifier);

// Haal userinfo op (JWE)
const jwe = await fetchUserInfo(tokens.access_token);

// Ontsleutel JWE met private key
const jws = await decryptJWE(jwe, privateKey);

// Verifieer JWS met Dezi's JWKS
const claims = await verifyJWS(jws, jwksUri);

// Extraheer Dezi claims
const { dezi_nummer, abonnee_nummer, rol_code, rol_naam } = claims;
```

#### 3. Sessie Aanmaken

```typescript
// Upsert gebruiker in database
const user = await prisma.user.upsert({
  where: { deziNummer: claims.dezi_nummer },
  update: { updatedAt: new Date() },
  create: { deziNummer: claims.dezi_nummer }
});

// Log login event
await prisma.loginEvent.create({
  data: {
    userId: user.id,
    abonneeNummer: claims.abonnee_nummer,
    deziRoleCode: claims.rol_code,
    deziRoleName: claims.rol_naam,
    ipAddress: request.ip
  }
});

// Maak sessie cookie
await createSession({
  userId: user.id,
  deziNummer: claims.dezi_nummer,
  // ... andere claims
});
```

---

## Beveiligingsmaatregelen

Deze starter implementeert beveiligingsbest practices geïnspireerd door NL GOV OIDC profielen:

### PKCE (Proof Key for Code Exchange)

```typescript
// Altijd S256 methode gebruiken
code_challenge_method: 'S256'
```

PKCE voorkomt authorization code interception attacks, zelfs als de code wordt onderschept.

### State & Nonce Validatie

| Parameter | Doel |
|-----------|------|
| `state` | Voorkomt CSRF aanvallen |
| `nonce` | Voorkomt replay aanvallen |

Beide worden gegenereerd als UUID v4 en gevalideerd bij de callback.

### Token Validatie

De JWS wordt gevalideerd op:

- **`iss`** - Issuer moet overeenkomen met `DEZI_ISSUER`
- **`aud`** - Audience moet overeenkomen met `DEZI_CLIENT_ID`
- **`exp`** - Token mag niet verlopen zijn
- **`nbf`** - Token mag niet vóór geldigheid gebruikt worden
- **`nonce`** - Moet overeenkomen met opgeslagen nonce

### Cookie Beveiliging

```typescript
{
  httpOnly: true,      // Niet toegankelijk via JavaScript
  secure: true,        // Alleen over HTTPS (in productie)
  sameSite: 'strict',  // Geen cross-site requests
  path: '/',
  maxAge: 8 * 60 * 60  // 8 uur
}
```

### Data Maskering

Gevoelige gegevens worden gemaskeerd in de UI:

```typescript
// "1234567890" wordt "******7890"
function maskSensitiveData(value: string): string {
  if (value.length <= 4) return '****';
  return '*'.repeat(value.length - 4) + value.slice(-4);
}
```

---

## Environment Variabelen

| Variabele | Beschrijving | Verplicht |
|-----------|--------------|-----------|
| `DATABASE_URL` | PostgreSQL connection string | Ja |
| `SESSION_SECRET` | Geheim voor sessie tokens (min. 32 karakters) | Ja |
| `NEXT_PUBLIC_APP_URL` | Basis URL van je applicatie | Ja |
| `DEZI_ISSUER` | Dezi OIDC issuer URL | Ja |
| `DEZI_CLIENT_ID` | Je Dezi client ID | Ja |
| `DEZI_CLIENT_SECRET` | Client secret (alleen voor confidential clients) | Nee |
| `DEZI_REDIRECT_URI` | OAuth callback URL | Ja |
| `DEZI_PRIVATE_KEY` | PEM private key voor JWE ontsleuteling | Ja |

### Sessie Secret Genereren

```bash
# macOS/Linux
openssl rand -base64 32

# Of met Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Database Schema

### User Model

Slaat geauthenticeerde gebruikers op:

```prisma
model User {
  id          String       @id @default(uuid())
  deziNummer  String       @unique  // Unieke Dezi identifier
  displayName String?               // Optionele weergavenaam
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  loginEvents LoginEvent[]          // Relatie naar login events

  @@map("users")
}
```

### LoginEvent Model

Audit log van alle logins:

```prisma
model LoginEvent {
  id            String   @id @default(uuid())
  userId        String
  abonneeNummer String   // Abonneenummer van de login
  deziRoleCode  String   // Rolcode (bijv. "01")
  deziRoleName  String   // Rolnaam (bijv. "Huisarts")
  ipAddress     String?  // IP adres (optioneel)
  userAgent     String?  // Browser user agent (optioneel)
  createdAt     DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([createdAt])
  @@map("login_events")
}
```

### Database Commando's

```bash
# Genereer Prisma client
npx prisma generate

# Maak en voer migratie uit
npx prisma migrate dev --name beschrijving

# Open Prisma Studio (database browser)
npx prisma studio

# Reset database (WAARSCHUWING: verwijdert alle data)
npx prisma migrate reset
```

---

## Dezi Client Library

De `deziClient.ts` module is ontworpen om herbruikbaar te zijn in andere projecten:

### Belangrijkste Functies

```typescript
// Haal OIDC discovery document op
const discovery = await fetchDiscoveryDocument(issuer);

// Genereer PKCE parameters
const pkce = await generatePKCEParams();

// Bouw authorization URL
const authUrl = buildAuthorizationUrl(endpoint, clientId, redirectUri, pkce);

// Wissel code voor tokens
const tokens = await exchangeCodeForTokens(endpoint, code, verifier, clientId, redirectUri);

// Verwerk userinfo (JWE -> JWS -> claims)
const claims = await processUserInfo(config, discovery, accessToken, nonce);
```

### Hergebruik in Andere Projecten

Je kunt `deziClient.ts` kopiëren naar andere projecten. De module heeft alleen `jose` en `uuid` als dependencies.

---

## Hoe verder?

Deze starter is bedoeld als referentie-implementatie voor Dezi-authenticatie. Je kunt de code aanpassen en uitbreiden in elke richting die jouw project nodig heeft. De implementatie laat zien hoe je veilig met Dezi OIDC integreert, maar schrijft geen specifieke applicatie-architectuur voor.

---

## Productie Overwegingen

Voordat je naar productie gaat:

### Beveiliging

- [ ] Gebruik een secret manager voor `DEZI_PRIVATE_KEY` (bijv. AWS Secrets Manager, HashiCorp Vault)
- [ ] Schakel HTTPS in en zet `secure: true` op alle cookies
- [ ] Configureer CORS en CSP headers
- [ ] Voeg rate limiting toe aan auth endpoints
- [ ] Implementeer proper error monitoring (bijv. Sentry)

### Performance

- [ ] Zet database connection pooling op
- [ ] Configureer caching voor OIDC discovery document
- [ ] Gebruik CDN voor statische assets

### Monitoring

- [ ] Zet logging op voor audit trail
- [ ] Monitor login failures voor security alerts
- [ ] Track sessie metrics

### Checklist

```bash
# Controleer environment variabelen
npm run build  # Moet zonder fouten bouwen

# Test de flow
1. Open http://localhost:3000
2. Klik "Inloggen met Dezi"
3. Authenticeer bij Dezi
4. Controleer of je op het dashboard komt
5. Controleer of login event is gelogd
```

---

## Veelgestelde Vragen

### Hoe krijg ik Dezi credentials?

Neem contact op met Dezi voor het registreren van je applicatie. Je ontvangt:
- Client ID
- Instructies voor het genereren van een keypair
- URL's voor de test- en productieomgeving

### Wat als de JWE ontsleuteling faalt?

Controleer:
1. Is de private key correct in PEM formaat?
2. Komt de public key overeen met wat bij Dezi is geregistreerd?
3. Gebruik je het juiste algoritme (RSA-OAEP-256)?

### Hoe test ik zonder echte Dezi omgeving?

Je kunt een mock OIDC provider opzetten met tools zoals:
- [oidc-provider](https://github.com/panva/node-oidc-provider)
- [Keycloak](https://www.keycloak.org/)

### Kan ik dit gebruiken met andere frameworks?

De `deziClient.ts` module is framework-agnostisch. Je kunt de OIDC logica hergebruiken in:
- Express.js
- Fastify
- NestJS
- Andere Node.js frameworks

---

## Licentie

MIT License - Copyright (c) 2025 Upkyk

Zie het [LICENSE](LICENSE) bestand voor volledige details.

---

## Bijdragen

Dit is een starter kit voor demonstratiedoeleinden. Voel je vrij om te forken en aan te passen voor je eigen behoeften.

### Issues Melden

Heb je een bug gevonden of een suggestie? Open een issue op GitHub.

### Pull Requests

Pull requests zijn welkom! Zorg ervoor dat:
- Code voldoet aan de bestaande stijl
- Tests slagen (indien aanwezig)
- Documentatie is bijgewerkt

---

## Disclaimer

Dit project is onafhankelijk ontwikkeld door Upkyk en is niet gelieerd aan, ondersteund door, of officieel goedgekeurd door Dezi. De naam "Dezi" wordt uitsluitend gebruikt om de authenticatiestandaard te beschrijven waarmee deze starter kit integreert.

---

## Contact

**Gemaakt en onderhouden door Upkyk**  
Een creatief bureau gespecialiseerd in moderne webapplicaties, identity integraties en digitale oplossingen.  
Meer info: https://upkyk.nl

Voor vragen over deze starter kit, open een issue op GitHub.

Voor vragen over Dezi zelf, neem contact op met [Dezi](https://dezi.nl).
