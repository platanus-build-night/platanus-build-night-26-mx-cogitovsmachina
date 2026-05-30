# Skill: Tesla Mental Prototyping

## Objective
Define the visual, behavioral, and structural execution plan before executing any mutations or applying code modifications.

## Rules
1. **No Cold Starts**: Never perform code changes or database migrations without first declaring a target state specification (`target_state_spec`).
2. **Deconstruct Dependency Chains**: Break down the objective into discrete nodes where every step explicitly declares its prerequisites.
3. **Establish Clear Validation Gates**: Each plan step must be accompanied by a deterministic validation criterion that can be programmatically tested.
4. **Token Budget Assessment**: Estimate the context footprint of the planned path and refuse execution if it threatens to collapse the model's optimal context limits.
5. **Safety Bounds Check**: Assess if any step triggers Human-In-The-Loop (HITL) alerts (e.g. schema drops, high-value transfers, system overrides).
