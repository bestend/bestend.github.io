# Decisions - site-renewal

## Technical Stack Decisions

| Decision | Reason | Date |
|----------|--------|------|
| Astro over Hugo | Better for interactive components + Islands architecture | 2026-01-27 |
| Tailwind CSS | Fast development, Astro integration | 2026-01-27 |
| MP3 over Web Audio API | Simpler, more stable for basic SFX | 2026-01-27 |
| Free assets over custom | Time-saving, no pixel art skills needed | 2026-01-27 |
| Korean only | Target audience is Korean | 2026-01-27 |
| Manual QA only | Blog site, minimal business logic | 2026-01-27 |

## Content Strategy
- New blog posts: Will write from scratch (NOT migrating 4 Hugo posts)
- About: Reference content/about.md for career details
- Projects: Reference content/_index.md for project list

## Phase Strategy
- Each phase ends with deployable state
- Phase 1: Core foundation (Astro + pages)
- Phase 2: Interactive features (can be parallel)
- Phase 3: Gamification (can be partially parallel)
