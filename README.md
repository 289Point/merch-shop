# Il Tuo Merch — sito vetrina

Sito con catalogo prodotti pubblico e pannello admin protetto, costruito con
Next.js e Supabase.

## Cosa fa

- Chiunque arrivi sul sito vede il catalogo (nome, prezzo, immagine, descrizione)
- Gli utenti possono registrarsi e accedere
- **Solo tu** (l'account con l'email che imposti come admin) vedi e usi il
  pannello `/admin` per aggiungere, modificare ed eliminare prodotti
- Non c'è carrello né pagamento: è solo una vetrina

## 1. Collegare Supabase

1. Apri il tuo progetto su supabase.com
2. Vai su **SQL Editor** → **New query**, incolla il contenuto di
   `supabase/schema.sql`
3. **Prima di eseguirlo**, sostituisci le 4 occorrenze di
   `tuaemail@esempio.com` con la tua email reale (quella con cui ti
   registrerai come admin)
4. Premi **Run**

Questo crea la tabella `products` e le regole di sicurezza: tutti possono
leggere i prodotti, ma solo la tua email può inserirli, modificarli o
eliminarli — anche se qualcuno aggirasse l'interfaccia e chiamasse
direttamente il database.

## 2. Configurare le variabili d'ambiente

1. Rinomina `.env.local.example` in `.env.local`
2. Vai su Supabase → **Project Settings** → **API**
3. Copia **Project URL** e **anon public key** nel file
4. Imposta `ADMIN_EMAIL` con la stessa email usata nello schema SQL

## 3. Avviare il progetto in locale

```bash
npm install
npm run dev
```

Apri http://localhost:3000

## 4. Diventare admin

1. Vai su `/register` e registrati con l'email che hai messo in
   `ADMIN_EMAIL` e nello schema SQL
2. Controlla la tua email e conferma l'account (Supabase invia un link)
3. Accedi da `/login`
4. Nel menu in alto vedrai ora la voce **Pannello admin** — è visibile solo
   a te

Chiunque altro si registri vedrà solo il catalogo, mai il pannello admin,
sia lato interfaccia sia lato database (grazie alle regole RLS).

## 5. Aggiungere prodotti

Dal pannello admin, per ogni prodotto inserisci nome, descrizione, prezzo e
un URL immagine (ad esempio un link a un'immagine caricata su un servizio
come Imgur, oppure — più avanti — su Supabase Storage).

## 6. Pubblicare online con un dominio

1. Crea un repository su GitHub e carica questo progetto
2. Vai su vercel.com → **Add New Project** → collega il repository
3. Nelle impostazioni del progetto Vercel, aggiungi le stesse variabili
   d'ambiente del tuo `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_EMAIL`)
4. Premi **Deploy**
5. Per un dominio personalizzato: Vercel → Project → **Settings** →
   **Domains**

## Struttura del progetto

```
app/
  page.tsx              catalogo pubblico
  product/[id]/page.tsx dettaglio prodotto
  login/page.tsx         login
  register/page.tsx      registrazione
  admin/page.tsx          pannello admin (protetto)
  admin/AdminProductForm.tsx  form aggiungi/modifica/elimina
  globals.css             stili
components/
  Header.tsx              barra di navigazione
  ProductCard.tsx         card prodotto nel catalogo
lib/supabase/            connessione a Supabase
middleware.ts             blocca /admin a chi non è admin
supabase/schema.sql        tabella prodotti + regole di sicurezza
```
