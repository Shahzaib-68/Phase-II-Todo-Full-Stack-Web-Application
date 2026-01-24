---
id: 1
title: "vip-frontend-spec"
stage: "spec"
date_iso: "2026-01-10"
surface: "agent"
model: "Qwen Code"
feature: "vip-frontend"
branch: "001-vip-frontend"
user: "user"
command: "sp.specify"
labels:
  - "specification"
  - "frontend"
  - "authentication"
  - "ui"
links:
  spec: "specs/001-vip-frontend/spec.md"
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "specs/001-vip-frontend/spec.md"
  - "specs/001-vip-frontend/checklists/requirements.md"
tests_yaml:
  - "spec-validation"
prompt_text: "don't write code only write spec # 🎯 Master Specification: VIP Todo Frontend (Phase II) ## 1. Project Overview A production-ready, high-performance web interface for the Todo application. The goal is to transform the backend functionality into a \"VIP\" experience characterized by sophisticated design, seamless transitions, and robust security. ## 2. Technical Stack - **Framework:** Next.js 16+ (App Router) - **Language:** TypeScript (Strict Mode) - **Styling:** Tailwind CSS + Shadcn/UI - **Animations:** Framer Motion - **Authentication:** Better Auth (JWT Plugin) - **API Communication:** Fetch API with custom Interceptor logic --- ## 3. VIP Design System & UI Requirements ### Visual Aesthetic (The \"VIP\" Look) - **Theme:** Default \"Deep Dark\" mode with a primary focus on accessibility and elegance. - **Glassmorphism:** Use of `backdrop-blur-md`, semi-transparent backgrounds (`bg-white/5`), and subtle borders to create depth. - **Components:** High-quality **Shadcn/UI** integration (Cards, Dialogs, Toasts, Skeletons, and Inputs). - **Layout:** - A responsive Sidebar for navigation and user profile. - A centered, clean dashboard area for task management. ### Micro-Interactions (Framer Motion) - **Staggered Lists:** Tasks should animate into the list one by one with a slight fade and slide-up effect. - **Hover States:** Interactive elements must have subtle scaling or glow effects. - **Loading:** Use **Shadcn Skeletons** that pulse gently to indicate content loading without jarring layout shifts. --- ## 4. Authentication & Security (Better Auth) - **Implementation:** Full client-side integration with Better Auth using the JWT plugin. - **Auth Flow:** - Custom Login and Signup pages with production-ready validation. - **Middleware:** Global protection for `/dashboard` routes. Unauthorized users are redirected to `/login`. - **JWT Management:** - The shared `BETTER_AUTH_SECRET` is used to verify session integrity. - The frontend automatically retrieves the JWT from the session to use in API headers. --- ## 5. Functional Features & Interactivity ### Task Management (CRUD) - **Read:** Efficient fetching of tasks based on the authenticated `user_id`. - **Create:** A minimalist \"Quick Add\" bar with keyboard shortcut support (e.g., Enter to save). - **Update/Patch:** - **Optimistic UI:** Toggle completion status instantly on the frontend. If the backend call fails, revert the state and show an error Toast. - Inline title editing for a faster user experience. - **Delete:** A sleek confirmation modal (Shadcn Alert Dialog) to prevent accidental deletions. ### Filtering & Organization - Real-time search bar to filter tasks by title. - Status tabs: **All**, **Pending**, and **Completed**. --- ## 6. API Client & Connectivity - **Base URL:** `http://localhost:8000/api` - **Logic:** A centralized `/lib/api.ts` utility that: 1. Injects `Authorization: Bearer <token>` into every request automatically. 2. Handles global error states (401 Unauthorized, 500 Server Error). 3. Triggers **Shadcn Toasts** for success/error feedback. - **CORS:** Must align with the backend's `ALLOWED_ORIGINS` configuration. --- ## 7. Development Guidelines (Qwen CLI Instructions) - **Code Quality:** Use functional components and React Server Components (RSC) where possible. - **Error Handling:** Every API interaction must have a `try-catch` block and user-facing feedback. - **Responsiveness:** Mobile-first approach. The dashboard must be fully functional on small screens."
response_text: "Created a comprehensive specification for the VIP Todo Frontend feature, including user scenarios, functional requirements, and success criteria. The specification focuses on user authentication, task management interface, and responsive design with VIP aesthetics, while maintaining technology-agnostic success criteria."
outcome: "Specification created successfully with all mandatory sections completed. Quality validated against checklist with all items passing. Ready for planning phase."
evaluation: "The specification meets all requirements with clear user stories, testable functional requirements, and measurable success criteria. No implementation details were included inappropriately, and all acceptance scenarios are well-defined."
---
