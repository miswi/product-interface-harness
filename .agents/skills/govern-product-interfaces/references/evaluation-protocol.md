# Generalization evaluation protocol

Evaluate methods, triggering, and outputs separately. Do not encode a project's expected defect as a universal rule.

## Test sets

1. **Known fixtures**: disclosed cases used to verify that the workflow can reproduce an understood result.
2. **Blind holdouts**: undisclosed real defects. Keep expected answers out of prompts, skill files, filenames, and accessible artifacts.
3. **Cross-domain transfers**: structurally similar tasks from at least two other domains, such as commerce, case management, publishing, healthcare operations, or logistics.
4. **Negative controls**: interfaces where the current placement is appropriate; the skill should avoid inventing changes.
5. **Trigger tests**: prompts that should activate one specialist, the router, or no skill.

## Score each run

Use a 0–2 score per dimension:

- Finds the material gap without being told the answer.
- Cites sufficient evidence and labels uncertainty.
- Distinguishes As-Is, To-Be, and inferred requirements.
- Proposes a legal, role-appropriate action and placement.
- Accounts for permissions, risk, side effects, and affected surfaces.
- Avoids button proliferation and speculative features.
- Produces testable acceptance criteria.

Record false positives as seriously as missed defects.

## Protect integrity

- Give the evaluator raw artifacts and a natural user request, not the suspected diagnosis.
- Do not reuse a conversation containing the expected answer for a blind run.
- Remove artifacts created by prior runs when they could leak conclusions.
- Treat the first disclosed issue as a fixture, not proof of generalization.
- Preserve at least one real issue as a blind holdout until the skill set is frozen for that evaluation round.

## Run both evaluation layers

1. Run `npm run check:harness` from the repository root to validate Skill structure, Harness behavior, known structural gaps, cross-domain structural transfers, and negative controls.
2. Run semantic forward tests in fresh agent sessions using raw artifacts and natural prompts. Use multiple trials, record trajectories and model versions, and grade the dimensions above.

Passing the deterministic Harness suite proves that completion gates and coverage rules behave as specified. It does not prove that an agent will discover every material business fact. Claim generalization only after the protected semantic holdout and cross-domain forward tests pass.
