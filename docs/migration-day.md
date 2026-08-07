---
title: "Migration day, everything you need to know"
description: "Live guidance for the August 7, 2026 npub.cash v2 migration."
outline: deep
---

# Migration day, everything you need to know <Badge type="danger" text="August 7, 2026" />

Today, `npub.cash` moves from the v1 service to v2. This page is the day-of
overview: what is happening, when it happens, and what you need to do.

::: danger Current status: scheduled
The cutover is scheduled for **15:00 UTC (17:00 CEST)** today. Until then,
`npub.cash` serves v1 and `npubx.cash` serves v2.
:::

For implementation details, recovery guidance, and the full collection flow,
use the [production migration guide](/docs/migration).

## At a glance

| | |
| --- | --- |
| **Cutover** | August 7, 2026 at 15:00 UTC |
| **What changes** | `npub.cash` becomes the canonical v2 service |
| **Who must act** | Every integration still using the v1 API |
| **Compatibility domain** | `npubx.cash` remains available through December 31, 2026 |
| **Important limitation** | The v1 and v2 APIs are not backward compatible |

## What is happening today

### Before 15:00 UTC

- `npub.cash` continues to serve v1.
- `npubx.cash` serves the v2 service that will remain after the cutover.
- Integrations can run both flows in parallel to avoid a release at exactly
  the cutoff.

### At 15:00 UTC

- `npub.cash` switches to v2.
- The v1 API stops being available through `npub.cash`.
- Both domains point to the same v2 service.

### After the cutover

- Use `https://npub.cash` as the canonical API base URL.
- Use `npub.cash` for new Lightning addresses.
- Treat `npubx.cash` as a temporary compatibility domain and migrate away from
  it by December 31, 2026.

## User funds

Funds held by the legacy npub.cash service will be migrated **gradually and
automatically after the cutoff**. You do not need to trigger the migration, but
you should not expect all funds to appear immediately.

npub.cash was already running before v1 and has undergone many changes since
its initial release. We will thoroughly scan the old database and check the
state of every proof. This includes looking for recoverable sats that may have
been considered lost when a user initiated a withdrawal but never claimed the
associated proofs.

This will be a slow, deliberate process. The dataset is large, and verifying
proof states requires communication with the mint. Moving gradually allows us
to be thorough while also preserving npub.cash users' privacy with respect to
the mint.

## What you need to do

### I use the v1 API at `npub.cash`

Your integration must move to v2. This is more than a base-URL change: v2
returns paid mint quotes, and your wallet is responsible for minting and
durably storing the proofs.

1. Add the [v2 quote collection flow](/docs/migration#required-v2-collection-flow).
2. Run it against `https://npubx.cash` before the cutover.
3. Keep the v1 and v2 flows separate while both are active.
4. After the cutover, use `https://npub.cash` and retire the v1 adapter once
   the migration is confirmed.

If your client cannot support the v2 flow, disable its npub.cash integration
until it can. Do not treat v2 as a drop-in replacement for v1.

### I already use v2 at `npubx.cash`

The API behavior does not change. After the cutover:

1. Change the API base URL to `https://npub.cash`.
2. Publish new Lightning addresses using the `npub.cash` domain.
3. Generate new NIP-98 events for the new URLs.
4. Reconnect WebSocket subscriptions through `npub.cash`.
5. Smoke-test authentication and quote retrieval.

You can move the Lightning-address domain and API domain separately during the
compatibility period.

### I maintain a wallet or SDK integration

Verify these behaviors before declaring the migration complete:

- paid quotes are fetched with pagination;
- the mint is selected from each quote's `mintUrl`;
- proofs and completion state survive a restart;
- a completed quote cannot be minted twice;
- interrupted mint attempts are reconciled safely; and
- HTTP, WebSocket, and NIP-98 authentication use one consistent API base URL.

See the [migration checklist](/docs/migration#if-you-use-npub-cash-v1) for the
complete technical guidance.

## Migration updates

The newest update should be added at the top of this table. Times are UTC.

| Time | Status | Update |
| --- | --- | --- |
| Before 15:00 | Scheduled | Cutover remains scheduled for 15:00 UTC. |

<!--
Day-of maintainers: update the status callout near the top of this page and add
new entries above the existing row. Suggested states: Scheduled, In progress,
Monitoring, Complete, or Incident.
-->

## If something goes wrong

- Retry timeouts and `5xx` responses; they may be temporary.
- Handle authentication failures through the normal remediation flow.
- Do not use a single `404`, `410`, timeout, or `5xx` response as proof that v1
  has been retired.
- If you temporarily query both v2 domains, deduplicate quotes by
  `(mintUrl, quoteId)`, not by API hostname.
- Reconcile an interrupted mint attempt with the mint before retrying it.

## Key links

- [Full production migration guide](/docs/migration)
- [API endpoints](/docs/api/endpoints)
- [Authentication and NIP-98](/docs/api/authentication)
- [TypeScript SDK](/docs/sdk/npubcash-sdk)
