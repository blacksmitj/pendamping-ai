---
description: Core procedural rules for token-efficient development.
---

# General Rules (Token Efficient)

Follow these rules to minimize token usage and maximize correctness:

## 1. Minimal Context loading
- **NEVER** preload all skills or `.docs` automatically.
- **LOAD ONLY** necessary skills when specific triggers are met.
- **IGNORE** `.docs` unless explicitly asked or for architectural planning.
- Prefer repository code/types over documentation for API reference.

## 2. No Hallucinations
- Strict adherence to `package.json` versions.
- If unsure: **Read Skill** -> **Context7 (Last resort)**.
- Never guess API signatures or types.

## 3. Procedural Workflow
1. **Analyze**: Identify minimal requirements for the task.
2. **Context**: Load **one** relevant skill if mandatory.
3. **Execute**: Implement directly using codebase patterns.
4. **Skills**: Create/Update `.agents/skills/[topic]/SKILL.md` for new patterns discovered via Context7.

## 4. Output Standards
- Remove all `console.log` and unused imports.
- Ensure strict TypeScript compliance.
- Keep responses concise and focused on the code change.
