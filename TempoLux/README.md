# TempoLux

TempoLux is a luxury watch monorepo with an Angular 21 frontend and a Spring Boot API.

## Experience

- `/` is an editorial home page with a TempoLux monogram, blog-style watchmaking stories and a scroll-driven real-photo watch assembly.
- `/catalogo` is the sales catalog with 10 watches loaded from the Spring Boot API.
- The interface supports Spanish and English through the global language switcher.

## Frontend

The Angular app uses Tailwind CSS through `src/styles.css`, with custom CSS only for the brand mark and scroll assembly effects.

```bash
npm install
npm start
```

Open `http://localhost:4200/`. Angular proxies `/api` requests to the Spring Boot API on `http://localhost:8080`.

## Backend

The API lives in `backend/` and requires Java 17+.

```bash
cd backend
mvn spring-boot:run
```

Endpoints:

- `GET /api/watches`
- `GET /api/watches/{slug}`

The catalog is static for v1 and returns localized names, descriptions, materials, local `.webp` image URLs, EUR prices and slugs.

## Tests

```bash
npm run build
npm test -- --watch=false
cd backend
mvn test
```

`npm test -- --watch=false --browsers=ChromeHeadless` requires an additional Vitest browser provider package in this Angular setup, so the included frontend tests run with the default Angular/Vitest test environment.

## Image Credits

Real watch photographs are stored locally as optimized `.webp` files under `public/assets/`. Source images are from Pexels and used under the [Pexels License](https://www.pexels.com/license/).

- `aurora-regulator.webp`: `https://www.pexels.com/photo/close-up-of-wristwatch-16093240/`
- `assembly-watch.webp`: `https://www.pexels.com/photo/close-up-of-wristwatch-16093240/`
- `hero-watch.webp`: `https://www.pexels.com/photo/12493041/`
- `obsidian-moonphase.webp`: `https://www.pexels.com/photo/close-up-shot-of-a-wristwatch-6230455/`
- `atlas-tourbillon.webp`: `https://www.pexels.com/photo/close-up-photo-of-a-watch-9561300/`
- `mariner-perpetual.webp`: `https://www.pexels.com/photo/luxury-watch-on-hand-15997560/`
- `solstice-chrono.webp`: `https://www.pexels.com/photo/person-wearing-a-wristwatch-14569229/`
- `eclipse-gmt.webp`: `https://www.pexels.com/photo/round-silver-colored-chronograph-watch-beside-compass-1034064/`
- `verdant-minute-repeater.webp`: `https://www.pexels.com/photo/a-close-up-of-a-wristwatch-32676127/`
- `polar-skeleton.webp`: `https://www.pexels.com/photo/a-close-up-of-a-wrist-watch-14778525/`
- `nocturne-ultrathin.webp`: `https://www.pexels.com/photo/close-up-shot-of-a-wristwatch-11981163/`
- `terra-annual-calendar.webp`: `https://www.pexels.com/photo/a-close-up-of-a-watch-17772377/`
