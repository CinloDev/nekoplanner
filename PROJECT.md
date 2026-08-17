# NekoPlanner — PROJECT.md

Este documento centraliza el roadmap, el estado de las issues, decisiones importantes y las reglas de arquitectura del proyecto. 
**Importante**: Debe mantenerse actualizado durante toda la vida del proyecto para reflejar cualquier decisión arquitectónica relevante.

---

## 1. Product Overview
- **Nombre**: NekoPlanner
- **Tipo**: Aplicación web open source.
- **Propósito**: Planificación visual y gestión de contenido para redes sociales.
- **Público objetivo**: Usuarios hispanohablantes que necesitan organizar contenido para redes sociales.
- **Enfoque**: Simple, visual, local-first y extensible.
- **Idioma actual de la interfaz**: Español.
- **Idiomas futuros**: Posibles, pero sin implementar i18n todavía.

> NekoPlanner permite planificar, organizar y visualizar contenido para redes sociales desde una única interfaz.

---

## 2. Product Principles
- **Local-first**: Los datos deben funcionar localmente y no depender inicialmente de un backend.
- **Privacy-friendly**: Los datos del usuario deben permanecer bajo su control.
- **Open Source**: El proyecto debe poder ser estudiado, ejecutado y extendido por otros desarrolladores.
- **Simple before complex**: No introducir abstracciones, dependencias o arquitecturas complejas sin una necesidad real.
- **Reusable UI**: Los elementos visuales reutilizables deben formar parte del Design System.
- **Feature-oriented architecture**: Las features deben estar aisladas y evitar acoplamiento innecesario.
- **Progressive enhancement**: Primero construir una experiencia sólida y funcional. Después agregar funcionalidades avanzadas.

---

## 3. Technology Stack
- Angular 19
- TypeScript
- Standalone Components
- Angular Router
- SCSS
- CSS Custom Properties
- Angular Signals
- Angular CDK cuando sea necesario
- pnpm

---

## 4. Architecture
```text
src/app/
├── core/
├── shared/
├── layout/
└── features/
```

- **core**: Servicios y lógica transversal de aplicación (ej: storage, utilities, application-level services).
- **shared**: Elementos reutilizables entre features (ej: UI components, directives, pipes). *No mover lógica de negocio aquí.*
- **layout**: Estructura visual de la aplicación (ej: AppShell, Sidebar, Topbar, Mobile Navigation).
- **features**: Dominios funcionales independientes (dashboard, calendar, posts, ideas, analytics, settings).

---

## 5. Routing
Rutas actuales:
- `/dashboard`
- `/calendar`
- `/posts`
- `/ideas`
- `/analytics`
- `/settings`

Las features utilizan Angular Standalone Components y lazy loading mediante `loadComponent`. Las rutas deben mantenerse en inglés.

---

## 6. Localization / Language
NekoPlanner está orientado actualmente a usuarios hispanohablantes.

- **UI → Español**: Todo texto visible debe estar en español (navegación, títulos, botones, badges, mensajes, placeholders, tooltips, mensajes de error, labels, textos de ayuda, aria-label).
- **Código → Inglés**: Todo el código debe mantenerse en inglés (componentes, variables, interfaces, funciones, servicios, archivos, clases, rutas, propiedades técnicas). Ej: `NavigationItem`.

*No implementar i18n todavía.*

---

## 7. Design System
Basado en CSS Custom Properties. Identidad y tokens:
- **Primary brand**: `#14B8A6`
- **Categorías de tokens**: colors, typography, spacing, radius, shadows, semantic states, themes.
- **Temas**: Light / Dark (controlados vía `<html data-theme="light">` / `<html data-theme="dark">`).

*Regla: Los componentes deben consumir tokens. No hardcodear colores ni crear un "mini Tailwind" con utility classes genéricas.*

---

## 8. Shared UI Components
Ubicación: `src/app/shared/components/ui/`
Componentes actuales: `Button`, `Badge`, `Card`.
Variantes de botón: `primary`, `secondary`, `ghost`, `danger`.

*Regla: Crear nuevos componentes UI únicamente cuando exista una necesidad real de reutilización.*

---

## 9. App Shell
Estructura actual:
```text
AppShell
├── Sidebar
├── Main Area
│   ├── Topbar
│   └── Router Outlet
└── Mobile Navigation
```

- **Desktop**: Sidebar visible, Topbar visible, Mobile navigation oculta.
- **Mobile**: Sidebar oculta, Topbar visible, Mobile navigation visible. Hamburger menu en la Topbar para acceder a navegación completa a través de un drawer lateral.

---

## 10. Navigation
Centralizada en: `src/app/layout/navigation.config.ts`.
- Evitar duplicar rutas manualmente.
- `showInMobileNav` distingue la navegación rápida inferior en mobile vs la navegación completa del drawer lateral.

---

## 11. State Management
Enfoque previsto:
- Angular Signals
- `computed()`
- `effect()` (únicamente cuando exista un caso real)
- Evitar state management global innecesario. No introducir NgRx ni soluciones equivalentes sin una necesidad clara.

---

## 12. Persistence
Enfoque: **Local-first**.
La persistencia inicial utilizará almacenamiento local del navegador.
*Objetivos futuros*: Guardar datos localmente, exportar JSON, importar JSON, recuperar datos, permitir backups manuales. *No implementar backend en esta etapa.*

---

## 13. Features
- **Dashboard**: Placeholder (Solo UI preliminar)
- **Calendar**: Placeholder
- **Posts**: Placeholder
- **Ideas**: Placeholder
- **Analytics**: Placeholder
- **Settings**: Placeholder

---

## 14. Roadmap
v0.1 — Foundation
- [x] #001 Architecture Setup
- [x] #002 Design System
- [x] #003 App Shell & Navigation
- [x] #004 Project Documentation
- [x] #005 Domain Models
- [x] #006 Core & State
- [ ] #007 Dashboard
- [ ] #008 Calendar
- [ ] #009 Posts
- [ ] #010 Settings & Data
- [ ] #011 Responsive
- [ ] #012 Quality
- [ ] #013 Testing
- [ ] #014 Release

---

## 15. Development Rules
Para agentes y desarrolladores:
- Revisar `PROJECT.md` antes de modificar la arquitectura.
- Respetar las decisiones existentes.
- No introducir dependencias sin necesidad.
- No implementar funcionalidades fuera del scope de una issue.
- No modificar features no relacionadas.
- No crear abstracciones prematuras.
- Mantener componentes Standalone y TypeScript strict.
- Utilizar los Design Tokens.
- Mantener UI en español y código en inglés.
- Ejecutar `pnpm build` antes de finalizar una issue.
- No hacer commits automáticamente salvo que se solicite.
- Reportar decisiones técnicas relevantes. Si una decisión contradice `PROJECT.md`, detenerse y solicitar revisión.

---

## 16. Git Conventions
- **Branches**: `feat/XXX-description`, `fix/XXX-description`, `chore/XXX-description`, `refactor/XXX-description`.
- **Commits**: `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`.
*No crear commits automáticamente durante una issue salvo indicación explícita.*

---

## 17. Issue Workflow
Issue → Create branch → Implementation → Verification → Review → Commit → Push → Pull Request → Review → Merge
*Cada issue debe mantener un scope claro.*

---

## 18. Architectural Decision Log

### ADR-001 — Angular Standalone Components
- **Decision**: Use Angular Standalone Components instead of NgModules.
- **Reason**: Modern Angular architecture and reduced module-level coupling.
- **Status**: Accepted

### ADR-002 — Custom CSS Properties Design System
- **Decision**: Implement design system using vanilla SCSS with Custom Properties instead of a library like Tailwind.
- **Reason**: Precise control over tokens, avoidance of global utility soup, strict enforcement of design language.
- **Status**: Accepted

---

## 19. Current Project Status
- **Current version**: v0.1
- **Current phase**: Foundation
- **Completed issues**: #001, #002, #003, #004, #005, #006
- **Current focus**: Dashboard
