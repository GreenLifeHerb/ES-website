# Essence Source Strapi Domain Setup

This guide assumes:

- the public website is already mapped to `https://essencesourceusa.com`
- the website frontend runs as its own service
- Strapi still needs a public API domain for live form submissions

## Recommended structure

- Website: `https://essencesourceusa.com`
- Strapi CMS/API: `https://cms.essencesourceusa.com`

The website should submit inquiries to:

```text
https://cms.essencesourceusa.com/api/public/inquiries
```

## 1. Deploy Strapi as a separate service

Deploy the backend service to Cloud Run (or your container host of choice) as a dedicated service, for example:

- service name: `essence-source-cms`

Use the backend folder and its Dockerfile:

```text
backend/Dockerfile
```

## 2. Set production environment variables on Strapi

Use these values for the current mail setup:

```env
SMTP_HOST=s158d.chinaemail.cn
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=sales16@gl-herb.com
SMTP_PASS=your-real-password
MAIL_FROM=sales16@gl-herb.com
MAIL_TO=sales16@gl-herb.com
PUBLIC_BASE_URL=https://cms.essencesourceusa.com
FRONTEND_ORIGINS=https://essencesourceusa.com,https://www.essencesourceusa.com
```

You will also need your normal Strapi app and database secrets:

```env
APP_KEYS=...
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
JWT_SECRET=...
DATABASE_CLIENT=postgres
DATABASE_HOST=...
DATABASE_PORT=5432
DATABASE_NAME=...
DATABASE_USERNAME=...
DATABASE_PASSWORD=...
```

## 3. Bind a custom domain to Strapi

In Cloud Run:

1. Open the Strapi service
2. Go to `Manage Custom Domains`
3. Add:

```text
cms.essencesourceusa.com
```

Cloud Run will show the DNS records required for verification and routing.

## 4. Add the DNS record

At your DNS provider, add the record exactly as Cloud Run requests.

Typically this will be one of:

- a `CNAME` for `cms`
- or a Google-managed verification record plus routing records

Do not guess the target value. Use the exact value shown in Cloud Run for the custom domain mapping.

## 5. Point the website form proxy at Strapi

On the frontend service, set:

```env
INQUIRY_API_URL=https://cms.essencesourceusa.com/api/public/inquiries
```

This is the value used by the static site server proxy in:

```text
server.js
```

## 6. Test the final flow

After DNS and deployment are live:

1. Open `https://essencesourceusa.com/contact.html`
2. Submit a test inquiry
3. Confirm:
   - Strapi stores the inquiry
   - `sales16@gl-herb.com` receives the email

## Notes

- Keep the Strapi admin on the CMS domain, not on the public website domain.
- Do not commit real SMTP passwords to GitHub.
- If you later want everything behind one reverse proxy, you can also route `/api` from the main domain to Strapi, but the cleanest current setup is a separate CMS subdomain.
