# Production migration <Badge type="danger" text="Action required by July 31, 2026" />

We plan to consolidate the two public npub.cash services by the end of
**July 2026**. After the cutover, both `npub.cash` and `npubx.cash` will point to
the v2 service that currently serves `npubx.cash`.

## What is changing

| Domain | Before the cutover | After the cutover |
| --- | --- | --- |
| `npub.cash` | v1 service | v2 service |
| `npubx.cash` | v2 service | The same v2 service |

The v1 and v2 APIs are **not backward compatible**. The v1 API will no longer
be available through `npub.cash` after the cutover.

The consumer API continues to use `/api/v2` on both domains.

## If you use `npub.cash` (v1)

You must migrate to v2 before the cutover. This is not only an endpoint change:
the consumer becomes responsible for minting and storing proofs.

| Consumer concern | v1 | v2 |
| --- | --- | --- |
| What npub.cash returns | A token containing proofs | Paid mint quote metadata |
| Who turns payment into proofs | npub.cash before the consumer claims | **The consumer, directly with the mint** |
| Where proofs are stored | npub.cash until claimed | **The consumer's wallet** |
| How collection is tracked | npub.cash claim and withdrawal state | **The consumer records minted quotes and wallet balance** |

There is no v2 replacement for `/api/v1/claim` that returns a Cashu token, and
the v1 balance model does not carry over. In v2, npub.cash reports paid quotes;
the consumer's wallet is the source of truth for proofs and spendable balance.

### Required v2 collection flow

For each authenticated user, the consumer must:

1. Fetch paid quotes from `GET /api/v2/wallet/quotes`, following pagination.
   Synchronize on startup and periodically. WebSocket updates can reduce
   latency, but they are non-durable hints; retry if an updated quote is not
   immediately visible through HTTP.
2. For each quote not completed locally, use its `mintUrl` and `quoteId` with a
   Cashu wallet to mint proofs directly from that mint.
3. If `locked` is `true`, use a wallet that supports NUT-20 and can provide the
   required signatures.
4. Durably store the resulting proofs in the consumer's wallet.
5. Record `(mintUrl, quoteId)` as completed only after the proofs are stored.
   Store both atomically where possible.
6. Reconcile interrupted mint attempts with the mint before retrying.

npub.cash continues returning paid quotes after they have been minted or spent,
and their state may remain `PAID`. Do not try to mint every quote again during
each synchronization; use the consumer's durable completion state.

The npub.cash SDK retrieves quotes and sends update notifications. It does not
mint quotes into proofs or store those proofs for the consumer. Use a Cashu
wallet library for that part of the flow.

Before the cutover:

1. Integrate and test against `https://npubx.cash`, which already provides the
   v2 service that will remain after the cutover.
2. Replace the v1 claim and balance flow with the collection flow above, then
   integrate the [v2 quote endpoint](/docs/api/endpoints#get-quotes) and
   [v2 authentication](/docs/api/authentication).
3. Test multiple mints if supported; select the wallet using each quote's
   `mintUrl` rather than assuming one configured mint.
4. Verify that proofs survive a restart, completed quotes are not minted twice,
   and interrupted mint attempts recover safely.
5. Make the service base URL configurable and stop v1 traffic before the
   end-of-July cutover.

Funds held by the v1 service will be returned out of band. They will not be
transferred through the v2 API.

If your client cannot support this flow before the cutover, disable its
npub.cash integration until it supports v2.

## If you use `npubx.cash` (v2)

No API migration is required. You may keep `https://npubx.cash` as your base
URL after the cutover.

Before the cutover:

1. Confirm that the client uses `/api/v2`.
2. Smoke-test authentication and quote retrieval, and use normal HTTP retry and
   WebSocket reconnect behavior during the cutover.

## Choosing domains after the cutover

The Lightning address domain and the wallet's API domain are independent. An
incoming quote is associated with the recipient's Nostr public key, not the
domain used in the Lightning address. The wallet retrieves that quote by
authenticating as the same public key.

After the cutover, both domains reach the same service. This means a payment to
`<user>@npub.cash` can be retrieved through the API at `https://npubx.cash`, and
a payment to `<user>@npubx.cash` can be retrieved through
`https://npub.cash`. Users may publish either Lightning address, and wallets may
use either API domain.

Using the same domain for the Lightning address and API base URL can make a
configuration easier to understand, but it is not required.

NIP-98 events authorize an exact URL. When changing between `npubx.cash` and
`npub.cash`, generate new NIP-98 events and reconnect WebSocket subscriptions
through the new host. Within a wallet, use one API base URL consistently for
HTTP, WebSocket, and authentication calls. Clients using the TypeScript SDK
must give the same base URL to `NPCClient` and `JWTAuthProvider`; the provider
will obtain a JWT as needed.
