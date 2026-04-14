# frontpage-atproto-client

Generated schemas and API clients for the Frontpage lexicon.

## Building

After an update to a lexicon (in the root of this monorepo) run:

```sh
pnpm build
```

## Fetching latest lexicons

This is not needed often, only when the dependent lexicons are updated.

In the root of the monorepo, run:

```sh
pnpm exec lex install --updated && pnpm exec prettier --write lexicons/
```
