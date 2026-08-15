# HSFAS Frontend – AI Context

## Project Overview

This is the frontend for HSFAS, an attendance management system.

The application allows users to:

- Log in to the system.
- Start an attendance session.
- Select or define the class scope.
- Upload or preview attendance images.
- Process images for attendance.
- View attendance results.
- Search and review individual attendance records.

## Primary Goal

Improve and modernize the user interface while preserving the existing application functionality.

UI changes may include:

- Colors
- Typography
- Spacing
- Cards
- Buttons
- Layout improvements
- Visual hierarchy
- Icons
- Minor UI interactions

Functional changes should only be made when explicitly requested.

## Design Direction

The desired design should feel:

- Modern
- Clean
- Professional
- Suitable for a university attendance system
- Consistent across all screens
- Visually polished without being overly complicated

Maintain Hindustan branding where it already exists.

## Architecture Notes

- Framework: Next.js
- Language: TypeScript
- Styling: Global styles are located in `src/app/globals.css`
- Pages use the Next.js App Router structure.
- Reusable UI components are located in `src/components/ui`.
- Layout components are located in `src/components/layout`.
- API communication is handled through `src/services`.
- Authentication state is managed through `src/context/AuthContext.tsx`.
- Attendance flow state is managed through `src/context/AttendanceFlowContext.tsx`.

## Important Rules

- Do not modify API services unless explicitly requested.
- Do not modify authentication logic.
- Do not modify attendance flow logic.
- Do not change routing unless explicitly requested.
- Preserve existing TypeScript types.
- Focus primarily on UI, styling, layout, and explicitly requested button/component changes.
- Reuse existing components where possible.

## Change Safety Rules

When modifying the project:

1. First inspect the provided files and understand their relationships.
2. Only modify files relevant to the requested screen or feature.
3. Do not rename, delete, or move files unless explicitly requested.
4. Preserve existing props, state, API calls, context usage, and TypeScript types unless a change is explicitly required.
5. Do not introduce unnecessary dependencies.
6. Reuse existing UI components such as `Button`, `Card`, `Input`, and `Checkbox` where appropriate.
7. Keep styling consistent with the rest of the application.
8. If additional files are required to safely make a change, identify them before writing code.
9. Do not rewrite an entire component when only a small change is required.

## Project Structure

```text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   │
│   ├── image-preview/
│   │   └── page.tsx
│   │
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── processing/
│   │   └── page.tsx
│   │
│   ├── result/
│   │   └── page.tsx
│   │
│   └── start-attendance/
│       └── page.tsx
│
├── components/
│   ├── common/
│   │   ├── AuthGuard.tsx
│   │   ├── ErrorState.tsx
│   │   └── LoadingSpinner.tsx
│   │
│   ├── image-preview/
│   │   ├── ClassScopeForm.tsx
│   │   └── ImageGrid.tsx
│   │
│   ├── layout/
│   │   ├── AppFooter.tsx
│   │   ├── AppHeader.tsx
│   │   └── HindustanBrandmark.tsx
│   │
│   ├── login/
│   │   └── LoginForm.tsx
│   │
│   ├── processing/
│   │   └── ProcessingTimeline.tsx
│   │
│   ├── result/
│   │   ├── AnnotatedImage.tsx
│   │   ├── AttendanceGroup.tsx
│   │   ├── AttendanceList.tsx
│   │   ├── AttendanceRow.tsx
│   │   ├── AttendanceSearchBar.tsx
│   │   └── SummaryCards.tsx
│   │
│   ├── start-attendance/
│   │   └── MethodCard.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Checkbox.tsx
│       └── Input.tsx
│
├── context/
│   ├── AttendanceFlowContext.tsx
│   └── AuthContext.tsx
│
├── hooks/
│   └── useProcessingAnimation.ts
│
├── lib/
│   ├── queryClient.ts
│   └── utils.ts
│
├── services/
│   ├── apiClient.ts
│   ├── attendanceService.ts
│   └── authService.ts
│
└── types/
    ├── attendance.ts
    └── auth.ts