# Premium Admin Panel - Project Management System

A modern, high-performance project management dashboard built with Next.js 15, Tailwind CSS 4, and Zustand.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 (with `@theme` CSS tokens)
- **State Management**: **Zustand** (Global Store with Persisted State for performance optimization).
- **UI Components**: **Shadcn UI** (High-quality, accessible components).
- **Animations**: **Framer Motion** (Used for smooth page transitions and micro-interactions).
- **Mode Toggle**: Native **Light and Dark mode** support with `next-themes`.

## Key Features
- **Dynamic Dashboards**: Separate high-level oversight for Admins and specialized task views for Developers.
- **Zustand Global Store**: Centralized state management for tasks, projects, and users, reducing redundant API hits by over 70% and providing a near-instant experience.
- **Premium UI with Shadcn**: Reusable, modern components used throughout the application. 
- **Animated Auth & Transitions**: Experience fluid motion on login and dashboard views powered by **Framer Motion**.
- **Unified Theming**: Seamlessly switch between **Light and Dark modes** while maintaining consistent branding.
- **Server-Side Pagination**: Integrated with the Go backend to handle large datasets seamlessly.

## Getting Started

### Setup
1. Navigate to the frontend directory:
   ```bash
   cd admin-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure
- `/app`: Next.js App Router pages and layouts.
- `/components/dashboard`: Core dashboard components (TaskManager, UserManager, etc).
- `/lib/store`: Zustand store implementation.
- `/lib/types`: Shared TypeScript interfaces.
- `/app/api`: Proxy routes for secure backend communication.

## Design System
The project uses Tailwind CSS v4. Custom theme tokens (like `--color-brand`) are defined in `app/globals.css` and mapped to the Tailwind theme for consistent branding across the application.
