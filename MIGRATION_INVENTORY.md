# Angular 19 Migration Notes (#128)

This document tracks the ongoing Angular 19 migration effort for Helpline1097-UI.

While exploring the legacy Angular 4 codebase, I noted the major modules, shared services, and migration areas that may need attention during the modernization process. The goal is to create a rough inventory of the current structure and gradually track migration progress as more modules are ported to the new standalone architecture.

Note: This migration plan will likely evolve as more feature modules and dependencies are analyzed.

## Summary of Current Structure
*   **Components:** ~97 (Approximate count, may change as modules are split/combined)
*   **Services:** ~22
*   **Legacy Setup:** Monolithic `AppModule` with over 118 declarations.
*   **Styling:** Bootstrap 3 and ad-hoc CSS.
*   **Migration Goal:** Angular 19 Standalone + Zard UI + Tailwind CSS v4.

**Initial Observations:**
*   The current `AppModule` is extremely large, so migration will need to happen through gradual feature-level extraction.
*   Several dashboard-related components appear tightly coupled to shared services and might need better state separation during porting.
*   The project still relies on older `md2` components in several operations modules, which might require UI restructuring rather than just a direct port.

---

## Core Infrastructure (Completed)
*Status: Initialized in PR #75*

| Asset | Legacy Path | New Path (v19) | Notes |
| :--- | :--- | :--- | :--- |
| **App Scaffold** | Root | `/v19` | Standalone setup. |
| **Auth Service** | `services/authentication` | `core/services/auth` | Fixed session storage bypass. |
| **Session Storage** | `services/sessionStorageService`| `core/services/session`| Preserved AES wrapper logic. |
| **HTTP Interceptor**| `http.interceptor.ts` | `core/interceptors/auth`| Moved to functional interceptor. |
| **Login UI** | `login/` | `features/auth/login` | Migrated using Zard UI primitives. |

---

## Global Layout & Shared Services
*Goal: Port the application shell and global services.*

| Asset | Legacy Path | Proposed Replacement | Priority |
| :--- | :--- | :--- | :--- |
| **Dashboard Shell** | `dashboard/` | Zard Layout / App Shell | High |
| **Navigation** | `dashboard-navigation/` | Zard Sidebar / Nav | High |
| **Data Service** | `services/dataService` | `core/services/state` | High |
| **Socket Service** | `services/socketService` | `core/services/socket` | High |
| **Dialog System** | `services/dialog` | Zard Dialog Primitives | Medium |

---

## Core Business Modules
*Goal: Port the primary helpline operations logic.*

| Module | Component Count | Legacy Tech | Migration Strategy | Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Beneficiary Reg** | ~10 | Bootstrap 3 | Rebuild with Reactive Forms | **High-Risk** |
| **1097 Operations** | ~15 | `md2` components | Replace legacy md2 UI with Zard UI components | - |
| **Czentrix CTI** | ~5 | Legacy Telephony | TODO: Analyze telephony service deeper | **High-Risk** |
| **Everwell Integration**| ~8 | - | Feature-level extraction | - |
| **Grievance System** | ~12 | - | Feature-level extraction | - |

---

## Admin & Config Modules
*Goal: Port management and master data screens.*

| Module | Component Count | Proposed Replacement | Priority |
| :--- | :--- | :--- | :--- |
| **User Master** | 4 | Zard Data Table | Medium |
| **Service Master** | 4 | Zard Data Table | Medium |
| **Role Master** | 3 | Zard Data Table | Medium |
| **Language Master** | 2 | Zard Data Table | Medium |

---

## Migration Guidelines
1.  **Standalone First:** Use standalone components for everything. Avoid adding new Modules.
2.  **Logic Extraction:** Extract logic into services and use `inject()` where possible.
3.  **Tailwind Utilities:** Prefer Tailwind utilities unless custom styling is genuinely needed.
4.  **License Headers:** All new `.ts` files must include the AMRIT GPLv3 header.

---

## Progress Tracker
- [x] Phase 1: Core Infrastructure
- [ ] Phase 2: Global Layout & Navigation
- [ ] Phase 3: Core Business Modules
- [ ] Phase 4: Admin & Config
- [ ] Cleanup: Deprecate Legacy Root
