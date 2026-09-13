#!/bin/sh
# The database is only reachable on the private network, so provisioning runs
# in-container. Idempotent, and a failure must not stop the service starting.
set -u
echo "[entrypoint] provisioning operator account"
node dist/src/infrastructure/database/seed/account.seed.js || echo "[entrypoint] account seed failed, continuing"
echo "[entrypoint] starting user-service"
exec node dist/src/infrastructure/server.js
