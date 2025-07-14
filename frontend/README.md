# Setup

## 1. Copy & configure your environment file

```bash
cp .env.example .env
# then open .env in your editor and set:
# NEXT_PUBLIC_API_URL=http://localhost:8000
# other vars…
```

## 2. Install dependencies

```bash
npm install
```

This will pull down all the packages listed in `package.json`.

## 3. Start the development server

```bash
npm run dev
```

By default the app will launch at [http://localhost:3000](http://localhost:3000).

---

### Commands

- **Type-checking & linting:**

  ```bash
  npm run lint
  npm run typecheck
  ```

- **Building for production:**

  ```bash
  npm run build
  ```

- **Previewing the production build locally:**

  ```bash
  npm run preview
  ```
