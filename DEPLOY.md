# Lansera WÄXXEL — steg för steg

Allt kodrelaterat är klart. Det som återstår kräver dina egna konton (GitHub, Cloudflare) — jag kan inte skapa dem åt dig. Följ stegen i ordning.

## 1. Skapa ett GitHub-repo och pusha koden

1. Gå till [github.com/new](https://github.com/new), skapa ett **tomt** repo (inget README/gitignore) — t.ex. `waxxel-web`.
2. Kör i `web/`-mappen (byt ut URL:en mot din egen):
   ```bash
   git add -A
   git commit -m "Initial commit"
   git remote add origin https://github.com/DITT-ANVANDARNAMN/waxxel-web.git
   git branch -M main
   git push -u origin main
   ```

## 2. Koppla Cloudflare Pages

1. Skapa konto på [dash.cloudflare.com](https://dash.cloudflare.com) (gratis, inget kort krävs).
2. **Workers & Pages → Create → Pages → Connect to Git** → välj repot du just skapade.
3. Build-inställningar:
   - **Framework preset:** Next.js (Static HTML Export)
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
4. Deploy. Ni får en gratis `https://waxxel-web.pages.dev`-länk direkt.

## 3. Skapa en GitHub OAuth App (krävs för att logga in på /admin)

1. Gå till [github.com/settings/developers](https://github.com/settings/developers) → **New OAuth App**.
2. Fyll i:
   - **Homepage URL:** `https://waxxel-web.pages.dev` (eller er riktiga subdomän när ni satt upp den)
   - **Authorization callback URL:** `https://waxxel-web.pages.dev/api/callback`
3. Efter skapande: kopiera **Client ID**, generera och kopiera en **Client Secret**.

## 4. Lägg till miljövariabler i Cloudflare Pages

I Cloudflare Pages-projektet: **Settings → Environment variables** → lägg till för **Production** (och Preview om ni vill testa PR-förhandsgranskningar):

| Namn | Värde |
|---|---|
| `GITHUB_CLIENT_ID` | Client ID från steg 3 |
| `GITHUB_CLIENT_SECRET` | Client Secret från steg 3 |

Redeploya efter att ni sparat (Cloudflare gör detta automatiskt, eller trigga manuellt under **Deployments**).

## 5. Uppdatera config.yml med rätt repo

Öppna [public/admin/config.yml](public/admin/config.yml) och byt:
```yaml
repo: DITT-ANVANDARNAMN/waxxel-web
base_url: https://waxxel-web.pages.dev
```
Committa och pusha ändringen (eller redigera direkt på github.com — det är den enda fil ni behöver röra i kod).

## 6. Testa adminpanelen

Besök `https://waxxel-web.pages.dev/admin`, logga in med GitHub. Ni ska se två sektioner: **Bakgrundslåt** och **Events**. Lägg till ett test-event, spara — sidan byggs om automatiskt (tar ~1 minut) och eventet syns live.

## 7. Peka en subdomän mot Cloudflare Pages (när ni är redo)

Enligt tidigare beslut: testa på en subdomän innan ni rör waxxel.com:
1. I Cloudflare Pages-projektet: **Custom domains → Add** → t.ex. `new.waxxel.com`.
2. Lägg till den CNAME-post Cloudflare visar hos er nuvarande DNS-leverantör för waxxel.com (var den nu sköts idag — inte nödvändigtvis Cloudflare).
3. Vänta på DNS-propagering (oftast minuter, ibland upp till någon timme), besök `new.waxxel.com`.

Att sedan ersätta hela `waxxel.com` (byta bort WordPress) är ett separat, medvetet steg ni tar när ni är nöjda — hör av er så går vi igenom det tillsammans.

## Lokal utveckling

```bash
cd web
npm install
npm run dev
```
Öppna `http://localhost:3000`. `/admin` fungerar inte fullt ut lokalt (kräver den deployade OAuth-proxyn), men sajten i övrigt går att testa direkt.

## Ljudfilen

`public/assets/audio/taek-style.wav` är fortfarande originalfilen (~64 MB) — samma rekommendation som tidigare gäller: komprimera till mp3 (~192 kbps) innan skarp lansering för snabbare start på mobil. Byt antingen filen direkt (behåll namnet `taek-style.wav`→`.mp3` och uppdatera `content/track.json` → `audioFile`), eller ladda upp en ny fil via adminpanelens ljudfil-fält när den är klar.
