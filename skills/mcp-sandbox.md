# Skill: MCP Database Sandboxing & Memory Syncer

## Objective
Enable autonomous tool-calling to manipulate isolated database states and coordinate cross-session episodic history.

## Rules
1. **Disposable Isolation**:
   - Always fork databases via `ghost.build` before running DDL or DML updates.
   - Banned: Executing modifications directly on primary production instances.
2. **Deterministic MCP Interfaces**:
   - Interact with database engines solely using standard Model Context Protocol (MCP) JSON-RPC tool specifications.
   - Provide clean parameter schemas for schema inspections and queries.
3. **Cross-Session Memory Stitching**:
   - Sync critical milestones and schemas to `memory.build`.
   - Retrieve relevant historical contexts during initial Planning stages to prevent institutional amnesia.
4. **Discard on Completion**:
   - Once migrations or validations succeed, push updates to main, then systematically discard sandbox forks to minimize resources.
