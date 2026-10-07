# START CODEX PROMPT — EclipseGames Next

You are starting the redesign of EclipseGames Next.

Do not begin by coding the full application.

Read, in order:

1. `PRODUCT-CONTRACT.md`
2. `CURRENT-CAPABILITIES.md`
3. `REDESIGN-BRIEF.md`
4. `DESIGN-SYSTEM.md`
5. `MIGRATION-PLAN.md`
6. `ROADMAP.md`

The old EclipseGames repository is a reference implementation, not a visual template.

## Goal

Produce the first product/UX architecture for EclipseGames Next.

You may redesign navigation, information architecture, UI, UX, component structure, interaction flows and selected functionality where it clearly improves real classroom use.

You must preserve every invariant in `PRODUCT-CONTRACT.md`.

## First task

Before implementing the complete product:

1. audit the reference repository;
2. classify major modules as REUSE / ADAPT / REBUILD / DROP / DEFER;
3. identify the 5 highest-friction UX problems;
4. propose 3 concise visual/product directions;
5. recommend one;
6. define the information architecture;
7. define the primary teacher flow;
8. define the projection flow;
9. define a small prototype scope.

The prototype must include:
- login;
- group workspace;
- student quick panel;
- one quick XP/action flow;
- bulk RT flow;
- projection;
- Show Student;
- one narrative screen.

## Important

Do not:
- rewrite business rules casually;
- weaken privacy;
- introduce student accounts;
- introduce public rankings;
- mix academic, behaviour, gamification and narrative domains;
- inherit old operational complexity without evidence.

When proposing a functional change, include:
- current problem;
- proposed behaviour;
- user benefit;
- invariant/risk analysis.

## Output before coding

Return:
1. reference-repo audit;
2. reuse matrix;
3. UX problems;
4. three redesign directions;
5. selected direction;
6. information architecture;
7. key user flows;
8. prototype scope;
9. implementation plan;
10. explicit questions that truly require maintainer choice.

Stop before full implementation.
