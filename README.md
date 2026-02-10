# TaskFlow Frontend - Task Management Solution

This repository contains the solution for the Senior/Semi-Senior Angular Technical Challenge. It is a collaborative task management application built with **Angular 16+ = It's Build whit Angular v.21** and modern frontend practices.

## 🚀 Project Overview

TaskFlow is designed to be a scalable, maintainable, and responsive application. It features a complete task dashboard with advanced filtering, sorting, and pagination capabilities, along with a simulated authentication flow mimicking enterprise integrations.

### Key Features Implemented:

- **Authentication**: Simulated Azure AD B2C integration (Login, Logout, Token Management).
- **Security**: Protected routes via `AuthGuard` and HTTP Interceptors for Bearer token injection.
- **Task Management**:
  - Full CRUD operations (mocked via JSONPlaceholder).
  - Client-side pagination (10 items per page).
  - Advanced filtering (By Status: Completed/Pending).
  - Real-time search with debouncing (300ms).
  - Sorting by Title and Date.
- **Architecture**:
  - **Standalone Components**: Fully modular architecture without NgModules.
  - **Reactive State Management**: Utilizing RxJS `BehaviorSubject` for local state and optimistic UI updates.
  - **OnPush Strategy**: Optimized change detection for performance.
- **UI/UX**:
  - Fully responsive layout (Mobile, Tablet, Desktop) using SCSS Grid/Flexbox.
  - Custom task card components with priority indicators.

## 📋 Challenge Requirements Fulfilled

This project addresses all core requirements specified in the technical test:

1.  **Authentication**: Implementation of `AuthService`, `AuthGuard`, and `AuthInterceptor` handling JWT-like token flows and auto-logout on expiration.
2.  **Dashboard**: A robust task list view handling asynchronous data streams, error states, and loading indicators.
3.  **Component Design**: Creation of reusable `TaskCardComponent` with strictly typed Input/Outputs.
4.  **Styling**: Custom SCSS implementation using variables, mixins, and responsive breakpoints (no UI libraries used, as requested).
5.  **Quality Assurance**: Unit tests covering critical paths in Authentication services and Component interactions.

## 🛠️ Tech Stack

- **Framework**: Angular (16+) => v21 (Standalone APIs)
- **Language**: TypeScript
- **Styling**: SCSS (Custom architecture)
- **State Management**: RxJS (Reactive programming)
- **Testing**: Jasmine & Karma

## 💻 Installation & Setup

Follow these steps to get the project running locally:

### 1. Clone the repository

```bash
git clone <https://github.com/elkingutierrex/mock-task-challenge>
cd mock-task-challenge
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### 4. Run Tests

```bash
ng test
```

## 🔐 Usage Credentials

Since the backend is simulated:

- **Email**: Any valid email format (e.g., `admin@taskflow.com`)
- **Password**: Any string with 6+ characters.

## 🧠 Technical Decisions & Answers

### Architecture

The project follows a **Feature-Based Architecture**:

- `core/`: Singleton services, guards, and interceptors.
- `features/`: Smart components (pages) like Login and Dashboard.
- `shared/`: Reusable dumb components, models, and utilities.

### Q&A (From Challenge)

**1. How would you handle refresh tokens with Azure AD B2C?**
I would utilize the **MSAL (Microsoft Authentication Library)** which handles the token lifecycle automatically. The library's interceptor attempts to acquire tokens silently. If the access token is expired, it uses the cached refresh token to request a new one from the identity provider without interrupting the user experience.

**2. Strategy for caching Task API responses?**
For this specific requirement, I would implement an HTTP Interceptor that keys responses by URL and parameters.

- **Read**: Check a `Map` cache; if valid and fresh, return `of(cachedResponse)`, else proceed with the HTTP request.
- **Write**: On `POST`, `PUT`, `DELETE` operations, invalidate the relevant cache entries to ensure data consistency.
  Alternatively, using **TanStack Query (Angular Query)** would be the modern standard solution for server-state management.

**3. Server-Side Rendering (SSR) Implementation?**
I would use Angular Universal (or the new `@angular/ssr` package in Angular 17+).

- **Implementation**: Run `ng add @angular/ssr` to scaffold the Express server.
- **Benefits**:
  - **SEO**: Crucial for public tasks to be indexed by search engines.
  - **LCP (Largest Contentful Paint)**: Faster initial load perception as HTML is delivered pre-rendered.
  - **Social Sharing**: Link previews (Open Graph tags) would render correctly on platforms like Slack or Twitter.
