# App Directory

This folder contains all Next.js routes.

Responsibilities:
- UI pages
- API routes
- Route groups
- Layouts
- Loading states
- Error pages

Rule:
Keep business logic out of this folder whenever possible.

Example:

app/
├── page.tsx
├── dashboard/
│   └── page.tsx
└── api/
    └── auth/
        └── register/
            └── route.ts