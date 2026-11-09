# Imagine Collective

A full-stack e-commerce storefront for a clothing brand, built from scratch:
browsing and search, product pages, cart, Stripe checkout, accounts with order
history, and an admin page for managing the catalog.

> **Status: the live deployment is down.** The Render backend
> (`ecommerce-main-s1rb.onrender.com`) is suspended and
> `imagine-collective.tech` does not resolve, so the store currently runs in
> **demo mode**: the storefront serves a built-in sample catalog (see below)
> and browsing, search, and product pages all work with no backend. Cart,
> accounts, and checkout need the live API. To bring the store back, redeploy
> the backend (Render or Vercel, see `backend/vercel.json`) and point
> `VITE_PATH` at it.

## Layout

```
eCommerce-main/
├── frontend/   React + Vite storefront (the part customers see)
├── backend/    Express + MongoDB API (products, users, orders, payments)
├── package.json   vestigial root manifest (Tailwind deps only)
└── .env           repo-root env file for the backend (never commit it)
```

## Demo mode (no backend needed)

If the storefront cannot reach the API, it falls back to a built-in sample
catalog (`frontend/src/data/demoCatalog.js`): 8 sample products in 3 sections
(Men, Women, New Arrivals), with freely usable Unsplash photos. The fallback
lives in the data hooks (`useFetchSections`, `useFetchTopProducts`,
`useFetchProducts`, `returnProduct`): a failed fetch serves demo data and
marks the session, a successful fetch clears the mark. A banner across the
top of browse/search/product pages says the catalog is demo data.

What works in demo mode: home page featured sections, category browsing,
search, product pages (color/size selection, images). What does not: cart,
accounts, and checkout, which are server-side by design — add-to-cart asks
you to log in, and there is no fake checkout. Demo products are shaped
exactly like API products, so the same components render both.

## What the store does

- **Shopping** — home page with featured products, category browsing
  (`/s/`, `/new`, per-category routes), search (`/search`), filters, and
  product pages (`/p/:productName/:productId/:color?/:size?`) with color/size
  selection and product images.
- **Cart & checkout** — cart page, then Stripe Checkout. The backend creates
  the Checkout session, syncs products/prices to Stripe, and confirms orders
  through a Stripe webhook (`/api/stripe/webhook`).
- **Accounts** — register/login with server-side sessions (express-session
  stored in MongoDB via connect-mongo). Profile pages cover orders, settings,
  and password changes. Roles exist (`customer` vs admin).
- **Admin (`/dev`)** — create/edit products (name, SKU, colors, sizes, price,
  discount, tags, images) behind an admin-role check. Product images upload
  to AWS S3 from `productController.js`.
- **Content & mailing list** — About, Contact, FAQ, Feedback, Terms, and
  Privacy pages, plus a mailing-list signup handled by the backend.

## Stack

- Frontend: React 18, Vite 6, Tailwind CSS 3, React Router 7, Motion.
- Backend: Express 4, Mongoose 8 (MongoDB), Stripe, AWS S3 (`@aws-sdk/client-s3`
  + multer), Nodemailer, bcryptjs.
- Deploy configs in the repo: `frontend/vercel.json` and `backend/vercel.json`
  (Vercel), `frontend/firebase.json` (Firebase Hosting). The frontend dev
  server proxies `/api` to the Render-hosted backend
  (`ecommerce-main-s1rb.onrender.com`, see `frontend/vite.config.js`) — that
  service is currently suspended, which is why the storefront falls back to
  the demo catalog described above.

## Run it locally

```bash
# Frontend
cd frontend
npm install
npm run dev        # Vite dev server, http://localhost:5173

# Backend (second terminal)
cd backend
npm install
npm run server     # nodemon backend/index.js, port 2000 by default
```

Other frontend scripts: `npm run build` (`vite build`), `npm run preview`,
`npm run lint`. The backend has no test suite (`npm test` is the npm
placeholder that exits 1).

### Environment variables

Each side has an example file — copy it to `.env` in the same directory and
fill in real values (never commit `.env`):

- Frontend: `frontend/.env.example` → `frontend/.env` (loaded by Vite).
- Backend: `backend/.env.example` → `.env` at the **repo root**
  (`backend/index.js` loads `../.env`; the frontend's Vite config reads the
  root `.env` the same way).

| Variable | Used for |
| --- | --- |
| `MONGO_URI` | MongoDB connection string (backend) |
| `SESSION_SALT_SECRET` | Secret for express-session cookies (backend) |
| `STRIPE_SECRET` | Stripe secret key (backend) |
| `PORT` | Backend port (default `2000`) |
| `PROD` | `true` enables production cookie settings (secure, `imagine-collective.tech` domain) |
| `VITE_CLIENT_PATH` | Frontend base URL; also the backend's allowed CORS origin |
| `VITE_PATH` | Backend base URL the frontend calls |
| `REGION` (default `us-east-2`), `S3_BUCKET_NAME` | S3 bucket for product image uploads (backend). AWS credentials come from the environment (IAM role / AWS CLI profile), not from `.env`. |

The frontend also reads `VITE_CURSOR_INCREMENT` and `VITE_ENABLE_TEST`
(see `frontend/src`).
