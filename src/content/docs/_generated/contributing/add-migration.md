---
title: "Add a store migration"
description: "Version and test forward SQLite migrations."
editUrl: "https://github.com/opensourceops/agentctl/edit/main/docs/development/ADD_MIGRATION.md"
---
The SQLite schema is versioned with `PRAGMA user_version`. Migrations are forward-only and run in order.

## 1. Define the compatibility change

State which persisted versions can upgrade, which runtime/checkpoint/effect formats change, and how older binaries fail. Never silently ignore a future version.

## 2. Add one migration

Increment `DATABASE_SCHEMA_VERSION`, add the next migration string in `agentctl-store`, and include it in the ordered list. Use SQLite operations supported by the bundled library. Keep the migration transactional.

## 3. Preserve failure behavior

A failed migration must leave the prior database usable or fail clearly without partial success. Serialization, checksum, foreign-key, and incompatible-state errors remain explicit.

## 4. Test forward paths

Create the previous schema in a temporary database, insert representative durable state, open it with the new store, and assert the new version and records. Test an already-current database, an empty database, a future version, corrupt state, and an intentional migration failure.

## 5. Document operator impact

Update the database reference, compatibility policy, release notes or status evidence, and backup guidance. Explain whether downgrade remains possible. Run the complete store tests and `cargo xtask verify`.
> Canonical source: [`docs/development/ADD_MIGRATION.md`](https://github.com/opensourceops/agentctl/blob/main/docs/development/ADD_MIGRATION.md). Verified against agentctl commit `c6a031015eed6ea7188c02b4ce28f7b451ea94f8`.
