# NextGen Build Labs - Agency Infrastructure Documentation

## 1. Directory Structure

```text
/
├── server.ts            # Production Express entry point
├── vite.config.ts       # Frontend build configuration
├── firebase-blueprint.json # Database architecture
├── .env.production      # Managed service credentials
├── src/
│   ├── components/      # UI Modular pattern
│   │   ├── admin/       # Super Admin (Agency) views
│   │   ├── client/      # Client Dashboard views
│   │   └── shared/      # Common UI elements
│   ├── services/        # Logic & Data fetching
│   ├── types/           # Production type safety
│   └── App.tsx          # Application routing
```

## 2. Database Schema (Firestore)

### Users Collection
- `uid`: string (Primary Key)
- `email`: string
- `role`: enum ['SUPER_ADMIN', 'CLIENT_ADMIN', 'CLIENT_USER']
- `agency_access`: boolean
- `suspended`: boolean
- `client_id`: string (Reference to Clients)

### Clients Collection
- `id`: string
- `brand_name`: string
- `subscription_tier`: string
- `active_projects`: array
- `billing_status`: string

### Projects Collection
- `id`: string
- `client_id`: string
- `status`: string
- `progress`: number
- `managed_by`: string (Always "NextGen Build Labs")

## 3. Access Control Strategy

1. **Super Admin (NextGen Build Labs)**:
   - Full bypass on all resources.
   - Capability to suspend/revoke any client index.
   - Access to global logs and secret management.

2. **Client Admin**:
   - Manage their own `CLIENT_USER` seats.
   - View project progress and download data.
   - Manage local client settings.

3. **Client User**:
   - Least privilege.
   - View only specific project tasks assigned.

## 4. Deployment Guide

1. **Environment Setup**: Ensure `.env.production` variables are mirrored in the target platform (e.g., Google Cloud, AWS, Vercel).
2. **Build**: Run `npm run build`.
3. **Migrate**: Ensure Firebase Security Rules are deployed using `npm run firebase:deploy`.
4. **Maintenance**: NextGen Build Labs maintains Master Control through the Agency Portal.

## 5. Future SaaS Upgrade Path

The architecture is multi-tenant by design. To transition to a full SaaS:
- Move from single Firestore instance to multi-instance or logical partition.
- Implement Stripe Connect for automated sub-merchant billing.
- Introduce "Agency Whitelabel" addon for clients.
