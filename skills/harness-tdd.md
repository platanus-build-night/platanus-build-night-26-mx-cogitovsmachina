# Skill: Osmani Self-Correction Harness (TDD)

## Objective
Enforce strict Test-Driven Development (TDD) validation loops. Failure is not an end state; it is input for the self-correction engine.

## Rules
1. **Red Stage (Test Failure)**:
   - Identify the target behavior or database constraint.
   - Run compilation or sandbox tests expecting them to fail, verifying the harness captures the precise error.
2. **Green Stage (Implementation)**:
   - Apply minimal correction adjustments (SQL queries, code edits) to make the verification test pass.
3. **Refactor Stage (Optimization)**:
   - Clean up schemas, queries, or type interfaces without changing behavior.
   - Ensure the verification harness remains active and passing.
4. **Self-Correction Feedback Loop**:
   - If tests fail, feed the exact stderr or compiler output directly back into the LLM context.
   - Formulate corrections deterministically, banning repeated attempts of identical payloads.
