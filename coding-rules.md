# Coding Rules — MCP Context7 Documentation Retrieval Policy

> **Version:** 1.0  
> **Last Updated:** 2026-03-05  
> **Target Audience:** AI coding agents (Antigravity, Cursor, AI Developer Agents)  
> **Scope:** All code contributions within this repository

---

## 1. Purpose

This document defines **when, how, and under what constraints** AI coding agents must use [MCP context7](https://context7.com) to retrieve library and framework documentation during development tasks.

The goal is to **maximize code correctness** by consulting authoritative, up-to-date documentation — while **minimizing token waste** from redundant or unnecessary retrieval calls.

---

## 2. Scope

These rules apply to **all AI-assisted coding tasks** including:

- Feature implementation
- Bug fixing and debugging
- Configuration and infrastructure changes
- Dependency upgrades and migrations
- Code review and refactoring involving external APIs

These rules do **not** apply to:

- Conversational responses or explanations
- Project management artifacts (task lists, plans)
- Documentation authoring unrelated to code generation

---

## 3. Documentation Retrieval Policy

### 3.1 — MUST Use Context7

The agent **MUST** call `resolve-library-id` → `query-docs` when **any** of the following conditions are true:

| # | Condition | Rationale |
|---|-----------|-----------|
| 1 | Implementing a feature using a library API the agent has not queried **in the current conversation** | Prevents hallucinated or outdated API usage |
| 2 | Debugging an error whose stack trace or message references a **third-party library** | Root-cause analysis requires accurate API contracts |
| 3 | Using an API the agent is **uncertain about** (parameter order, return type, side effects, deprecation status) | Uncertainty = retrieval is cheaper than a wrong implementation |
| 4 | Writing or modifying **configuration files** for external tools (ESLint, Vite, Tailwind, Prisma, Docker, etc.) | Config schemas change across versions; defaults are not safe to assume |
| 5 | Upgrading or migrating a **dependency to a new major version** | Breaking changes must be verified against official docs |
| 6 | First use of **any framework hook, utility, or component** not part of the base language (e.g., `useEffect`, `prisma.create`, `zod.object`) in the current conversation | Ensures correct usage patterns from the start |

### 3.2 — SHOULD NOT Use Context7

The agent **SHOULD NOT** call context7 when **all** of the following are true:

| # | Condition | Rationale |
|---|-----------|-----------|
| 1 | The task involves **pure algorithmic logic** (sorting, searching, data transformations) with no library dependency | No external API surface to verify |
| 2 | The task involves **basic language syntax** (loops, conditionals, type annotations, string manipulation) | Language fundamentals are stable and well-known |
| 3 | The task is a **small refactoring** (rename, extract function, move file, inline variable) that does not change API usage | Refactoring preserves existing behavior; no new API surface |
| 4 | The agent has **already retrieved documentation** for the same library and topic **in the current conversation** | Avoid duplicate retrieval (see §4.2) |
| 5 | The task involves **project-internal code** (custom hooks, utilities, components) with no external dependencies | Internal code is already in context via the codebase |

### 3.3 — Decision Flowchart

```
START: New coding task received
  │
  ├─ Does the task involve an external library or framework API?
  │   ├─ NO  → ❌ Skip context7
  │   └─ YES
  │       ├─ Have I already retrieved docs for this library+topic in this conversation?
  │       │   ├─ YES → ❌ Skip context7 (reuse cached knowledge)
  │       │   └─ NO
  │       │       ├─ Am I confident in the exact API signature, behavior, and current status?
  │       │       │   ├─ YES → ❌ Skip context7
  │       │       │   └─ NO  → ✅ MUST use context7
  │       └─ Is it a config file for an external tool?
  │           └─ YES → ✅ MUST use context7
```

### 3.4 — Browser & Search Usage

The use of `search_web` and `browser_subagent` is a **last-resort fallback** for when `context7` documentation is insufficient, missing, or fundamentally outdated.

| Rule | Instruction | Rationale |
|---|---|---|
| **One-Shot Only** | Max 1 search + 1 browser session per high-level task | Prevents deep rabbit holes and excessive latency |
| **Stable Over Live** | Prefer official static documentation over "live" website monitoring | Documentation is faster to parse and more reliable |
| **No Deep Scraping** | Avoid multi-page navigation or complex visual extraction unless critical | Browsing is the most time-consuming tool; use sparingly |
| **Context7 First** | Never use browser/search before attempting `resolve-library-id` | `context7` is optimized for AI speed; browser is not |

---

## 4. Token Efficiency Strategy

### 4.1 — Targeted Queries

- **Always query for a specific topic**, never the entire library.
- Write queries as natural-language questions scoped to the exact problem.

```
# ✅ GOOD — specific and scoped
query: "How to create a many-to-many relation in Prisma schema"

# ❌ BAD — too broad, wastes tokens
query: "Prisma"
```

### 4.2 — No Duplicate Retrieval

- **Track retrieved topics per conversation.** If documentation for `library X, topic Y` has already been retrieved in the current conversation, do NOT retrieve it again.
- If a follow-up task requires a **different topic** from the same library, a new retrieval is allowed.

### 4.3 — Resolve Before Query

- **Always call `resolve-library-id` first** to obtain the correct library ID.
- Cache the resolved library ID for the duration of the conversation to avoid redundant resolution calls.
- Do NOT call `resolve-library-id` more than **3 times per question**.

### 4.4 — Query Limit

- Do NOT call `query-docs` more than **3 times per question**.
- If 3 calls have been exhausted without finding the answer, **proceed with the best available information** and note the uncertainty in a code comment.

### 4.5 — Prefer Specificity Over Volume

- When a single query can cover the needed information, use **one call** instead of multiple.
- Combine related sub-questions into a single descriptive query.

```
# ✅ GOOD — one query covers both needs
query: "Next.js App Router dynamic route params and generateStaticParams"

# ❌ BAD — two separate calls for closely related topics
query1: "Next.js dynamic routes"
query2: "Next.js generateStaticParams"
```

---

## 5. Workflow for AI Agents

Follow this sequence for every coding task:

### Step 1 — Task Classification

Classify the task against §3.1 and §3.2 conditions.

- If **any** §3.1 condition is met → proceed to Step 2.
- If **all** §3.2 conditions are met → skip to Step 4.

### Step 2 — Library Resolution

```
call: resolve-library-id
  libraryName: "<package or framework name>"
  query: "<what you need to accomplish>"
```

Select the result with the best combination of:
1. Name match
2. Source reputation (High > Medium > Low)
3. Code snippet count
4. Benchmark score

### Step 3 — Documentation Query

```
call: query-docs
  libraryId: "<resolved library ID from Step 2>"
  query: "<specific, scoped question about the API or feature>"
```

- Parse the returned documentation.
- Extract only the relevant API signatures, patterns, or configuration options.
- Apply the retrieved knowledge to the implementation.

### Step 4 — Implement

Write the code using:
1. Retrieved documentation (if queried)
2. Existing codebase patterns
3. Language and framework knowledge

### Step 5 — Annotate (when applicable)

If documentation was retrieved, add a brief reference comment at the point of use:

```typescript
// Ref: context7 — Next.js App Router: generateStaticParams
export async function generateStaticParams() {
  // ...
}
```

This aids traceability and prevents duplicate retrieval in future conversations.

---

## 6. Examples

### Example A — Feature Implementation (MUST use context7)

**Task:** Add form validation using Zod in a Next.js server action.

```
# Step 1: Classification
# → Uses Zod library API → §3.1 condition 1 ✅ → MUST use context7

# Step 2: Resolve
resolve-library-id("zod", "schema validation with parse and safeParse")
# → Returns: /colinhacks/zod

# Step 3: Query
query-docs("/colinhacks/zod", "How to define a schema and use safeParse for form validation")
# → Returns: API docs with examples

# Step 4: Implement using retrieved docs
# Step 5: Add reference comment
```

---

### Example B — Pure Logic (SHOULD NOT use context7)

**Task:** Write a function to calculate the average of an array of numbers.

```
# Step 1: Classification
# → Pure algorithmic logic → §3.2 condition 1 ✅
# → Basic JS/TS syntax → §3.2 condition 2 ✅
# → No external library → §3.2 condition 5 ✅
# → All §3.2 conditions met → ❌ Skip context7

# Step 4: Implement directly
function average(nums: number[]): number {
  return nums.reduce((sum, n) => sum + n, 0) / nums.length;
}
```

---

### Example C — Debugging a Library Error (MUST use context7)

**Task:** Fix `PrismaClientKnownRequestError: Unique constraint failed on the fields: (email)`.

```
# Step 1: Classification
# → Error references Prisma library → §3.1 condition 2 ✅ → MUST use context7

# Step 2: Resolve
resolve-library-id("prisma", "handling unique constraint errors")
# → Returns: /prisma/prisma

# Step 3: Query
query-docs("/prisma/prisma", "How to handle PrismaClientKnownRequestError unique constraint violation with upsert or try-catch")

# Step 4: Implement fix based on retrieved patterns
```

---

### Example D — Refactoring (SHOULD NOT use context7)

**Task:** Extract a repeated API call into a shared utility function.

```
# Step 1: Classification
# → Small refactoring → §3.2 condition 3 ✅
# → Internal project code → §3.2 condition 5 ✅
# → No new API surface → All §3.2 met → ❌ Skip context7

# Step 4: Implement refactoring directly
```

---

### Example E — Repeated Query (SHOULD NOT use context7)

**Task:** Add another Zod schema in the same conversation where Zod docs were already retrieved.

```
# Step 1: Classification
# → Uses Zod API → §3.1 condition 1... BUT
# → Already retrieved Zod schema docs earlier in this conversation → §3.2 condition 4 ✅
# → ❌ Skip context7 (reuse cached knowledge)

# Step 4: Implement using previously retrieved patterns
```

---

## 7. Summary of Limits

| Constraint | Limit |
|------------|-------|
| `resolve-library-id` calls per question | ≤ 3 |
| `query-docs` calls per question | ≤ 3 |
| `search_web` calls per question | ≤ 1 |
| `browser_subagent` calls per question | ≤ 1 |
| Duplicate retrieval for same library+topic | Forbidden |
| Query specificity | Must be a natural-language question, not a single keyword |
| Fallback on exhausted calls | Proceed with best available info + uncertainty comment |

---

## 9. Efficiency Principle

**Prioritize Speed Over Hyper-Accuracy.**

In most coding tasks, 95% certainty delivered in 30 seconds is more valuable than 100% certainty delivered in 5 minutes. 

- **Avoid "Perfectionist Research"**: If the agent has a solid understanding of the API pattern from `context7`, do not use the browser to check for "minor" updates unless a build error occurs.
- **Fail Fast**: If a tool is slow or documentation is non-obvious, make an educated guess, implement with a `TODO` or `FIXME` comment, and move on.
- **Minimize Tool Chain**: Favor the tool that provides the most context with the fewest calls.

---

## 8. Compliance

AI agents operating in this repository **MUST**:

1. Follow the decision flowchart (§3.3) before every coding task.
2. Respect the token efficiency constraints (§4).
3. Never fabricate API signatures — when uncertain and retrieval limits are exhausted, flag the uncertainty explicitly.
4. Treat these rules as **deterministic policy**, not suggestions.

> **Violation:** Using a library API without retrieval when uncertain constitutes a policy violation and may produce incorrect code.  
> **Non-violation:** Skipping retrieval for well-understood, stable APIs when the agent is confident is acceptable and encouraged.
