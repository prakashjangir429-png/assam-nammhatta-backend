# Assam Nammhatta Backend

ES-module Node.js + Express + MongoDB + Razorpay backend designed to work with the supplied frontend API calls without changing their request/response contracts.

## 1. Install

```bash
npm install
```

## 2. Environment

Copy `.env.example` to `.env` and fill in:

- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `WHATSAPP_SENDER_ID`
- `WHATSAPP_AUTH_TOKEN`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Never put the Razorpay secret or WhatsApp auth token in the React frontend.

## 3. Create admin

```bash
npm run seed:admin
```

The seed reads `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME` from `.env`.

## 4. Run

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## API contract

### Public

`POST /api/admin/login`

`POST /api/donation/create-order`

`POST /api/donation`

`POST /api/devotees/create-order`

`POST /api/devotees/register`

### Admin JWT required

`GET /api/devotees`

`GET /api/devotees/:id`

`PUT /api/devotees/:id`

`DELETE /api/devotees/:id`

`GET /api/donation`

`GET /api/donation/:id`

`PUT /api/donation/:id`

`PATCH /api/donation/verify/:id`

`DELETE /api/donation/:id`

## Frontend URL change

Your frontend currently uses:

`https://assam-nammhatta-node.vercel.app/api`

After deploying this backend, only change that host to your new backend URL. The endpoint paths remain the same.

For local development:

`http://localhost:5000/api`

## Payment security

The frontend still opens Razorpay, but the backend creates the Razorpay order and verifies the Razorpay signature before saving a donation or registration. The Razorpay secret never reaches the browser.

## WhatsApp

WhatsApp receipt sending has moved to the backend. The frontend no longer needs to contain the WhatsApp auth token or call the WhatsApp API directly.

## Vercel deployment

This project includes `api/index.js` and `vercel.json`, so it can also be deployed as a Vercel Node function. Set all values from `.env` as Vercel Environment Variables. After deployment, your frontend API base can be:

`https://YOUR-BACKEND.vercel.app/api`

Keep the MongoDB cluster accessible from Vercel and do not commit `.env`.
