# NekoPlanner

A local-first, open-source social media content planner built with Angular 19.

## Architecture

NekoPlanner uses a feature-oriented Angular architecture based on Standalone Components, with separated core, shared, layout and feature layers.

- **Core**: Contains models, services, state, storage, and utility functions used globally.
- **Shared**: Contains reusable UI components, directives, and pipes.
- **Layout**: Contains structural shell components like the App Shell, Sidebar, and Mobile Navigation.
- **Features**: Contains independent business domains (Dashboard, Calendar, Posts, Ideas, Analytics, Settings).
