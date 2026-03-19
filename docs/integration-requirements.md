# Integration Requirements — performa-studio ↔ performa-edu

## Overview

Replace all dummy/mock data in **performa-studio** (TanStack Start frontend) with real API calls to the **performa-edu** backend (`/api/v1/*`).

**Backend base URL:** `http://localhost:3000/api` (configurable via `VITE_API_URL`)

---

## 1. Authentication

### Current State
- Cookie-based dummy auth in `src/server/auth.ts` with hardcoded users
- `loginFn` server function sets a JSON cookie with user data
- `getSession` reads from cookie, `requireAuth` redirects if no cookie
- `useAuthStore` (Zustand) holds a `token` but is never populated
- `api-client.ts` attaches Bearer token from `useAuthStore` but token is always null

### Target State

#### 1.1 Login Flow
- **Endpoint:** `POST /api/v1/auth/login`
- **Request:** `{ usernameOrEmail: string, password: string }`
- **Response:** `{ data: { accessToken: string, refreshToken: string, user?: { id, username, email } } }`
- On success:
  - Store `accessToken` and `refreshToken` in `useAuthStore`
  - Store tokens in httpOnly cookies via server function (for SSR auth checks)
  - Store user data in auth store
  - Redirect to `/dashboard`

#### 1.2 Session Management (Server Functions)
- `loginFn`: Call backend `/auth/login`, set tokens in httpOnly cookies, return user
- `getSession`: Read token from cookie → call `GET /api/v1/auth/getMe` to validate → return profile or null
- `logoutFn`: Clear cookies and reset auth store
- `requireAuth`: Validate session, redirect to `/login` if invalid

#### 1.3 Middleware (TanStack Start serverFn middleware)
- Create a `authMiddleware` using TanStack Start's `createMiddleware()` API
- Middleware reads token from cookies on the server side
- Attaches validated user context to the server function
- Used by all protected server functions

#### 1.4 Auth Store Updates
```ts
type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: { id: string; username: string; email: string } | null
  setAuth: (tokens: { accessToken: string; refreshToken: string }, user: User) => void
  logout: () => void
}
```

#### 1.5 API Client Updates
- `api-client.ts` already reads from `useAuthStore` and attaches Bearer token — this works once auth store is populated
- On 401: clear auth store, redirect to login (already implemented)

---

## 2. Protected Routes

### Current State
- `dashboard.tsx` calls `getSession()` server function in `beforeLoad` to check cookie

### Target State
- `dashboard.tsx` `beforeLoad` calls `getSession()` which validates token against backend `/auth/getMe`
- If token expired or invalid → redirect to `/login`
- Pass `user` profile from loader to dashboard layout and child routes

---

## 3. Profile / Settings

### Current State
- `settings.tsx` loader calls `getSession()` returning dummy user

### Target State
- **Endpoint:** `GET /api/v1/auth/getMe` (already used in session validation)
- **Response:** `{ data: { id, username, uniqueId, email, roles, fullName, dateOfBirth, phoneNumber, address, ... } }`
- Profile data is returned from the session/loader, consumed by `ProfileSection` and `AccountSection`
- Profile updates: Backend doesn't have a profile update endpoint yet → keep UI but show "coming soon" for save, or wire to customer update

---

## 4. Content — Studio List

### Current State
- `use-studio.ts` returns dummy `STUDIO_PROJECTS` after fake delay
- `StudioProject` type: `{ id, title, status, updatedAt, thumbnail, duration }`

### Target State
- **Endpoint:** `GET /api/v1/contents`
- **Query Params:** `{ page?, pageSize?, sortBy?, order?, search?, query? }`
- **Response:**
  ```json
  {
    "data": [
      {
        "id": "cuid",
        "title": "...",
        "body": "...",
        "year": 2026,
        "categoryId": "...",
        "status": 0,         // 0=DRAFT, 1=PUBLISHED, 2=ARCHIVED
        "userId": "...",
        "thumbnailUrl": "...",
        "previewUrl": "...",
        "createdAt": "...",
        "updatedAt": "...",
        "contentMedias": [...]
      }
    ],
    "meta": {
      "page": 0,
      "pageSize": 10,
      "itemCount": 50,
      "pageCount": 5,
      "hasPreviousPage": false,
      "hasNextPage": true
    }
  }
  ```

#### Changes Required

| File | Change |
|------|--------|
| `src/lib/api.ts` (new) | Add `contentApi.getAll(params)`, `contentApi.getById(id)`, etc. |
| `src/hooks/use-studio.ts` | Replace dummy fetch with `contentApi.getAll(...)` |
| `src/routes/(dashboard)/dashboard/studio.tsx` | Map backend `status` (0/1/2) to UI status, use `meta` for pagination |
| Types | Map backend Content type to frontend display types |

#### Status Mapping
| Backend | Frontend Display |
|---------|-----------------|
| `0` (DRAFT) | `draft` |
| `1` (PUBLISHED) | `published` |
| `2` (ARCHIVED) | `archived` |

---

## 5. Content — Studio Detail

### Current State
- `studio_.$contentId.tsx` loader calls `fetchContentDetail()` from dummy data

### Target State
- **Endpoint:** `GET /api/v1/contents/:id`
- **Response:**
  ```json
  {
    "data": {
      "content": {
        "id": "...",
        "title": "...",
        "body": "...",
        "year": 2026,
        "categoryId": "...",
        "status": 0,
        "thumbnailUrl": "...",
        "previewUrl": "...",
        "sections": [
          {
            "id": "...",
            "title": "...",
            "description": "...",
            "sortOrder": 0,
            "medias": [
              {
                "id": "...",
                "mediaType": 1,
                "originalUrl": "...",
                "hlsUrl": "...",
                "processingStatus": 2,
                "fileName": "...",
                "fileSize": "..."
              }
            ]
          }
        ]
      },
      "media": [...]
    }
  }
  ```

#### Changes Required

| File | Change |
|------|--------|
| `src/lib/api.ts` | Add `contentApi.getById(id)` |
| `src/routes/(dashboard)/dashboard/studio_.$contentId.tsx` | Replace `fetchContentDetail` with real API call |

---

## 6. Content Creation (Wizard — Two-Phase Upload)

### Current State
- 4-step wizard: General Details → Upload Media → Learning Sections → Finalization
- Store state in Zustand (`studio-store.ts`)
- Submit and save draft are dummy `setTimeout` calls

### Target State (Three-Phase Process)

#### Phase 1: Create Content + Get Upload URLs
- **Endpoint:** `POST /api/v1/contents/with-sections`
- **Request:**
  ```json
  {
    "title": "...",
    "categoryId": "...",
    "year": 2026,
    "body": "...",
    "status": 0,
    "sections": [
      {
        "title": "...",
        "description": "...",
        "sortOrder": 0,
        "videos": [
          { "title": "...", "sortOrder": 0, "fileName": "...", "mimeType": "video/mp4", "fileSize": 104857600 }
        ]
      }
    ],
    "thumbnail": { "fileName": "...", "mimeType": "image/jpeg", "fileSize": 512000 },
    "previewVideo": { "fileName": "...", "mimeType": "video/mp4", "fileSize": 20971520 }
  }
  ```
- **Response:** Content + sections + presigned S3 upload URLs for each media

#### Phase 2: Upload Files to S3
- For each upload URL returned in Phase 1:
  - POST multipart form data (fields + file) directly to S3
  - Track upload progress per file
- This happens client-side — no API gateway call; direct to S3/MinIO

#### Phase 3: Trigger Conversion
- **Endpoint:** `POST /api/v1/contents/:id/convert`
- **Request:** `{ callbackUrl?: string }` — optional, backend handles webhook internally
- **Response:** `{ data: { jobs: [{ mediaId, jobId }] } }`

#### Wizard Step Mapping

| Wizard Step | What Happens |
|-------------|-------------|
| Step 0: General Details | Collect title, year, category, description → store in Zustand |
| Step 1: Upload Media | Collect thumbnail file + preview video file → store in Zustand |
| Step 2: Learning Sections | Collect sections with video files → store in Zustand |
| Step 3: Finalization | Review → On submit: Phase 1 → Phase 2 → Phase 3 |

#### Changes Required

| File | Change |
|------|--------|
| `src/lib/api.ts` | Add `contentApi.createWithSections(data)`, `contentApi.startConversion(id)` |
| `src/hooks/use-content-creation.ts` (new) | Hook that orchestrates three-phase creation |
| `src/stores/studio-store.ts` | No major changes — store already holds all needed form data |
| `src/routes/.../studio_.create.tsx` | Wire `handleFinish` to use the creation hook |
| `src/components/studio/step-finalization.tsx` | Show upload progress during Phase 2 |

---

## 7. Content Update & Delete

### Target State
- **Update:** `PUT /api/v1/contents/:id` — `{ title?, body?, status? }`
- **Delete:** `DELETE /api/v1/contents/:id`

| File | Change |
|------|--------|
| `src/lib/api.ts` | Add `contentApi.update(id, data)`, `contentApi.delete(id)` |
| `src/routes/.../studio_.$contentId.tsx` | Wire Edit/Publish/Unpublish buttons to real API |

---

## 8. Dashboard Overview

### Current State
- Stats, activity, most watched, drafts all from `dummy-data.ts`

### Target State
- **Stats:** Derive from content list (total content count, etc.) — no dedicated analytics endpoint yet
- **Drafts:** Fetch `GET /api/v1/contents?status=0&pageSize=4` (draft content)
- **Most Watched / Activity:** Keep as dummy (analytics stay dummy per requirement)

---

## 9. Analytics

Analytics stays dummy — no changes.

---

## 10. Community

Community stays dummy — no dedicated backend endpoints yet.

---

## New Files to Create

| File | Purpose |
|------|---------|
| `src/lib/api.ts` | Centralized API endpoint definitions using `apiClient` |
| `src/lib/types.ts` | TypeScript types matching backend response shapes |
| `src/hooks/use-content-creation.ts` | Three-phase content creation orchestration hook |
| `src/server/middleware.ts` | TanStack Start `createMiddleware()` for auth |
| `docs/content-integration-flow.md` | Content creation integration flow doc |

## Files to Modify

| File | Change Summary |
|------|---------------|
| `src/server/auth.ts` | Replace dummy auth with real backend calls |
| `src/stores/auth-store.ts` | Add user object, accessToken, refreshToken |
| `src/hooks/use-studio.ts` | Replace dummy with `contentApi.getAll()` |
| `src/hooks/use-dashboard.ts` | Partially replace with real data (drafts) |
| `src/routes/(dashboard)/dashboard.tsx` | Use updated `getSession` for auth check |
| `src/routes/(auth)/login.tsx` | No change needed (uses LoginForm) |
| `src/components/login-form.tsx` | Update to use new `loginFn` that calls backend |
| `src/routes/(dashboard)/dashboard/studio.tsx` | Map backend types, server-side pagination |
| `src/routes/(dashboard)/dashboard/studio_.$contentId.tsx` | Real API content detail |
| `src/routes/(dashboard)/dashboard/studio_.create.tsx` | Wire submit to three-phase creation |
| `src/routes/(dashboard)/dashboard/settings.tsx` | Load real profile data |

---

## Implementation Order

1. **Auth layer** — `middleware.ts` → `auth.ts` → `auth-store.ts` → `login-form.tsx` → protected routes
2. **API layer** — `api.ts` (all endpoints) → `types.ts` (response types)
3. **Content list** — `use-studio.ts` → `studio.tsx` (search, filter, pagination)
4. **Content detail** — `studio_.$contentId.tsx`
5. **Content creation** — `use-content-creation.ts` → `studio_.create.tsx` (three-phase upload)
6. **Dashboard** — `use-dashboard.ts` (drafts from real data, rest stays dummy)
7. **Settings** — Profile from real `getMe` data

---

## API Endpoints Summary

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `POST` | `/api/v1/auth/login` | No | Login, get JWT tokens |
| `GET` | `/api/v1/auth/getMe` | Yes | Get authenticated user profile |
| `GET` | `/api/v1/contents` | Yes | List contents (paginated, filterable) |
| `GET` | `/api/v1/contents/:id` | Yes | Get content detail with sections & media |
| `POST` | `/api/v1/contents/with-sections` | Yes | Create content + get S3 upload URLs |
| `POST` | `/api/v1/contents/:id/convert` | Yes | Start HLS conversion for all pending videos |
| `PUT` | `/api/v1/contents/:id` | Yes | Update content fields |
| `DELETE` | `/api/v1/contents/:id` | Yes | Delete content |
