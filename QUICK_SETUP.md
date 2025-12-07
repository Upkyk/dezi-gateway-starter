# Quick Setup voor Demo Mode

Volg deze stappen om de demo mode te gebruiken:

## 1. Database Setup (SQLite - Simpelste optie)

Voor snelle lokale development kun je SQLite gebruiken in plaats van PostgreSQL:

### Optie A: SQLite (Aanbevolen voor demo)

1. **Update `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. **Update `.env`:**
   ```bash
   DATABASE_URL="file:./dev.db"
   SESSION_SECRET="demo-secret-key-min-32-chars-long"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Genereer en migreer:**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

### Optie B: PostgreSQL (Voor productie-achtige setup)

1. **Installeer PostgreSQL** (als je het nog niet hebt)

2. **Maak een database:**
   ```bash
   createdb dezi_gateway_dev
   ```

3. **Update `.env`:**
   ```bash
   DATABASE_URL="postgresql://jouw_username@localhost:5432/dezi_gateway_dev"
   SESSION_SECRET="demo-secret-key-min-32-chars-long"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Genereer en migreer:**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

## 2. Start de Server

```bash
npm run dev
```

## 3. Gebruik Demo Mode

1. Ga naar http://localhost:3000
2. Klik op **"Demo Dashboard"**
3. Je bent nu ingelogd met demo credentials!

## Troubleshooting

### "Database niet geconfigureerd" error
- Controleer of je stap 1 hebt voltooid
- Run `npx prisma generate` opnieuw
- Run `npx prisma migrate dev --name init` opnieuw

### "Failed to create demo session" error
- Check of de database draait (PostgreSQL)
- Controleer DATABASE_URL in `.env`
- Probeer SQLite optie voor snellere setup

### Port 3000 in gebruik
- Server draait op een andere port (bijv. 3001)
- Update NEXT_PUBLIC_APP_URL in `.env` naar de juiste port
