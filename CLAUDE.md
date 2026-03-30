# Frontpage — Claude Code Instructions

See [AGENTS.md](./AGENTS.md) for universal project context (structure, commands, gotchas, feeds).

This file contains Claude Code-specific configuration only.

## Claude Code Plugins

Shared plugins are configured in `.claude/settings.json`. Skills live in `~/.claude/skills/` (personal) or `.claude/skills/` (project-specific, committed).

## Memory

Claude Code memory is stored in the project-level memory directory. Use it for user preferences, project context, and feedback — not for things derivable from the codebase.
