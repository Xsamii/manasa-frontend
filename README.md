# Manasaty frontend

Angular 18 client for the Manasaty e-learning platform.

## Scripts

- `npm start` — development server with `/api` proxy to `localhost:3025`
- `npm run build` — production build
- `npm run test:ci` — headless unit tests

Environment files live in `src/environments`. Development uses `/api`; Docker
and production nginx proxy that path to the NestJS API.
