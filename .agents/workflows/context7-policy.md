---
description: Mandatory efficiency rules for using MCP Context7.
---

# Context7 Policy (v2.0 - Optimized)

## 1. Usage Triggers (MUST query only if:)
- External API signature is unknown/uncertain.
- Debugging 3rd-party library errors.
- Configuring external tools (ESLint, Prisma, etc.).
- Migrating major dependency versions.

## 2. Efficiency Constraints
- **Targeted Queries**: Natural language questions, not keywords.
- **Cache**: Never query the same topic twice in one session.
- **Limits**: Max 3 `resolve` + 3 `query` calls per high-level task.
- **Fallback**: If limits hit, use best info + `// TODO` note.
- **Internal First**: Check `.agents/skills/` before calling Context7.

## 3. Browser Fallback
- Use `search_web`/`browser_subagent` **ONLY** if Context7 fails.
- Limit to 1 search + 1 browser session per task.

## 4. Skills updates
- Successful Context7 research **MUST** result in a new/updated `.agents/skills/[topic]/SKILL.md` to prevent future external calls.
