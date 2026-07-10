# Engineering Behaviour Standard

> "Engineering excellence is defined not only by what is built, but by how it is built."

---

# Purpose

The Engineering Behaviour Standard defines the expected behaviour of every AI assistant, engineer, architect, reviewer, and contributor working on the Sunnah Remedies platform.

It establishes universal engineering principles that apply regardless of the task, technology, or AI model being used.

These standards apply equally to:

- Claude
- Cursor
- ChatGPT
- Future AI assistants
- Human engineers
- Technical reviewers

This document is technology-independent and should remain stable even as tools evolve.

---

# Engineering Philosophy

Every engineering decision should prioritise:

- Simplicity
- Clarity
- Maintainability
- Scalability
- Security
- Accessibility
- Performance
- Documentation
- Long-term sustainability

Engineering is the process of solving problems deliberately—not simply producing code.

---

# Core Behaviour Principles

## 1. Understand Before Acting

Never begin implementation without first understanding:

- The business objective.
- The engineering objective.
- The existing implementation.
- The architectural context.
- The expected outcome.

Read before writing.

Think before changing.

---

## 2. Audit Before Modifying

Before making any change:

- Review the existing implementation.
- Understand current behaviour.
- Identify reusable code.
- Identify dependencies.
- Identify affected modules.

Never assume.

Always investigate first.

---

## 3. Respect the Architecture

Every change must align with:

- Engineering Handbook
- Enterprise Architecture
- Architecture Decision Records (ADRs)
- Repository Structure
- Module Boundaries

Architecture is authoritative.

Implementation should never contradict architecture.

---

## 4. Stay Within Scope

Implement only the approved work.

Do not:

- Add unrelated features.
- Redesign existing systems without approval.
- Introduce unnecessary abstractions.
- Change behaviour outside the requested scope.

Scope discipline reduces risk.

---

## 5. Prefer Reuse Over Creation

Before creating anything new:

Ask:

Can an existing solution be reused?

Reuse:

- Components
- Services
- Hooks
- Utilities
- Schemas
- Types
- Queries

Duplication should be avoided.

---

## 6. Prefer Simplicity

Choose the simplest solution that satisfies the requirements.

Avoid:

- Clever code
- Unnecessary abstractions
- Premature optimisation
- Over-engineering

Simple systems are easier to maintain.

---

## 7. Separate Responsibilities

Each module should have one clear responsibility.

Separate:

- Business logic
- Presentation
- Data access
- Content management
- Configuration

Clear boundaries improve maintainability.

---

## 8. Treat Content as Content

Business content belongs in the CMS.

Do not hardcode:

- Products
- Courses
- Ingredients
- Prices
- Articles
- Testimonials
- Team members
- Marketing copy

Content should remain editable.

---

## 9. Write for Humans

Code is read far more often than it is written.

Prioritise:

- Readability
- Clarity
- Explicit naming
- Predictable structure

Optimise for future maintainers.

---

## 10. Verify Before Reporting Success

Implementation is never complete until it has been verified.

Verification includes:

- Build
- Type Check
- Lint
- Runtime testing
- Browser verification
- Responsive testing
- Accessibility review
- Documentation review

Never assume success.

Verify success.

---

## 11. Document Alongside Development

Every significant engineering change should update the appropriate documentation.

Possible updates include:

- README
- ADR
- Schema documentation
- Decision Log
- Release Notes
- Engineering Handbook

Documentation is part of implementation.

---

## 12. Surface Risks Early

If uncertainty exists:

- State assumptions.
- Highlight risks.
- Explain trade-offs.
- Recommend options.

Do not hide uncertainty.

---

## 13. Protect Production

Production stability is more important than implementation speed.

Every change should minimise:

- Breaking changes
- Downtime
- Regressions
- Data loss

Engineering should favour safe progress.

---

## 14. Leave the System Better Than You Found It

Whenever practical:

- Improve readability.
- Remove duplication.
- Simplify code.
- Improve documentation.
- Strengthen consistency.

Continuous improvement is expected.

---

## 15. Think Long Term

Every decision should consider:

- Future maintainability
- Scalability
- Editorial workflows
- Internationalisation
- Team growth
- AI collaboration

Build for years—not days.

---

Principle 16 — Evidence Before Conclusion

> AI should never state that work is complete based solely on code changes. Completion must be supported by observable evidence such as successful builds, passing type checks, verified UI changes, updated documentation, and completed verification reports. Assertions should be backed by evidence wherever practical.

---

# AI-Specific Behaviour

AI should always:

- Read documentation before responding.
- Follow approved standards.
- Explain recommendations.
- State assumptions explicitly.
- Ask for clarification when required.
- Produce structured outputs.
- Respect architectural boundaries.
- Verify work before completion.

AI should never:

- Guess missing requirements.
- Invent undocumented behaviour.
- Ignore project standards.
- Modify unrelated systems.
- Claim verification without evidence.

---

# Engineering Decision Hierarchy

When documentation appears to conflict, follow this order of precedence:

1. Engineering Handbook
2. Enterprise Architecture
3. Architecture Decision Records (ADRs)
4. Engineering Execution Plan
5. Approved Feature Specification
6. Module Documentation
7. AI Toolkit Standards
8. Prompt Instructions
9. Existing Implementation

Higher-level documents take precedence over lower-level documents.

---

# Standard Engineering Workflow

Business Requirement

↓

Understand the Objective

↓

Read Documentation

↓

Audit Existing System

↓

Review Architecture

↓

Plan the Solution

↓

Implement

↓

Verify

↓

Update Documentation

↓

Produce Verification Report

↓

Await Approval

No step should be skipped without explicit approval.

---

# Engineering Quality Mindset

Before considering work complete, ask:

- Is it correct?
- Is it simple?
- Is it maintainable?
- Is it reusable?
- Is it documented?
- Is it secure?
- Is it accessible?
- Is it performant?
- Has it been verified?
- Would another engineer understand it in six months?

If the answer to any question is "No", continue improving.

---

# Behaviour When Uncertain

If uncertainty exists:

1. Stop implementation.
2. Explain the uncertainty.
3. Identify missing information.
4. Present available options.
5. Recommend the preferred option.
6. Wait for clarification if the decision materially affects architecture or scope.

Never fabricate missing requirements.

---

# Continuous Improvement

Every completed task should consider:

- Can documentation be improved?
- Can duplication be removed?
- Can naming be improved?
- Can architecture be simplified?
- Can performance be improved?
- Can accessibility be improved?
- Can future maintenance become easier?

Engineering should improve the platform incrementally.

---

# Principles Summary

1. Understand before acting.
2. Audit before modifying.
3. Respect the architecture.
4. Stay within approved scope.
5. Reuse before creating.
6. Prefer simplicity over complexity.
7. Separate responsibilities clearly.
8. Keep editable content in the CMS.
9. Write for future maintainers.
10. Verify before reporting success.
11. Document every significant change.
12. Surface risks and assumptions early.
13. Protect production stability.
14. Leave the codebase better than you found it.
15. Build for the long term.

---

# Engineering Commitment

> We believe that outstanding software is created through disciplined behaviour rather than isolated technical skill. Every engineering decision should demonstrate clarity, integrity, respect for established architecture, and a commitment to continuous improvement. Whether work is performed by a human engineer or an AI assistant, these behavioural principles define the standard expected throughout the Sunnah Remedies Engineering System.

---

## Document Metadata

**Document Type:** Engineering Behaviour Standard

**Version:** 1.0.0

**Status:** Approved

**Owner:** Sunnah Remedies Engineering

**Review Cycle:** Every 6 months or after significant engineering process changes

---

## Change History

| Version | Date | Summary |

|---------|------|---------|

| 1.0.0 | Initial Release | Established universal engineering behaviour standards |
