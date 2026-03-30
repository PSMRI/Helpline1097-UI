# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AMRIT Helpline 1097 UI -- an Angular-based call centre application for the 1097 helpline (health information and counselling). Supports multiple roles: CO (Counselling Officer), Supervisor, and Admin. Part of the AMRIT healthcare EHR platform by Piramal Swasthya. Licensed under GPL v3.

## Common Commands

```bash
npm start              # Dev server (opens browser automatically)
npm run build-prod     # Production build with AOT
npm run build-ci       # CI build (EJS template + env vars, copies WEB-INF to dist)
npm test               # Karma + Jasmine tests
npm run lint           # Lint
npm run e2e            # Protractor end-to-end tests
```

Note: `npm start` and `postinstall` run `node version.js` to generate `git-version.json`.

## Tech Stack

**Angular 4.x** (legacy) with Angular Material 2.x (Md-prefixed components). Uses both `@angular/http` (deprecated `Http` module) and `@angular/common/http` (`HttpClient`). CLI config is `.angular-cli.json` (not `angular.json`).

## Architecture

All components are eagerly loaded in a single `AppModule` -- no lazy-loaded feature modules. Uses `NgModule` pattern with `CUSTOM_ELEMENTS_SCHEMA`.

### Key Directories (under `src/app/`)

- **`1097/`** -- Main 1097 helpline component shell
- **`1097-co/`** -- Counselling Officer role view
- **`1097-supervisor/`** -- Supervisor role view
- **`1097-admin/`** -- Admin role view
- **`beneficiary-registration/`** -- Beneficiary registration
- **`beneficiary-history/`** -- Beneficiary history lookup
- **`co-counselling-services/`** -- Counselling services for CO role
- **`co-feedback-services/`** -- Feedback services for CO role
- **`co-information-services/`** -- Information services for CO role
- **`quality-audit/`** -- Quality audit component (with case sheet summary dialog)
- **`supervisor-grievance/`** -- Supervisor grievance handling
- **`supervisor-reports/`** -- Supervisor reports
- **`supervisor-configurations/`** -- Supervisor configurations
- **`supervisor-notifications/`** -- Supervisor notification management
- **`call-statistics/`** -- Call statistics dashboard
- **`block-unblock-number/`** -- Number blocking management
- **`dial-beneficiary/`** -- Outbound dialling
- **`closure/`** -- Call closure workflows
- **`captcha/`** -- CAPTCHA component
- **`admin-*` directories** -- Admin modules for language, role, screen, service, user management
- **`services/`** -- Shared services

### Common Patterns

- **HTTP Interceptor:** Custom `InterceptedHttp` class extending `Http` (via factory provider).
- **Dialogs:** Material dialog components (`CommonDialogComponent`, `CaseSheetSummaryDialogComponent`).
- **Validation:** Custom directives (`myPassword`, `myName`, etc.) in `directives/`.
- **Forms:** Mix of template-driven and reactive forms. `ng2-validation` and `ng2-custom-validation` for extended validators.
- **Pagination:** `ngx-pagination` for list views.

### Environment Configuration

Environment files in `src/environments/`. CI builds use `scripts/ci-prebuild.js` to generate `environment.ci.ts` from EJS template. WAR packaging copies `WEB-INF/` into `dist/`.

### Build / Deploy

Packaged as a WAR file via Maven (`pom.xml`). `WEB-INF/` directory is copied into dist during CI build.
