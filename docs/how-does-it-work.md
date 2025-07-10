# How does it work?

npub.cash is a Lightning-Address powered by Cashu and nostr.
It allows you to receive Lightning payments on a LUD16 address without registration.

## Identity

npub.cash uses nostr identities. The public key becomes the address.
A npub.cash lightning address looks something like this

```email
npub1mhcr4j594hsrnen594d7700n2t03n8gdx83zhxzculk6sh9nhwlq7uc226@npub.cash
```

Therefore any nostr public key is a valid npub.cash address. The server simply saves
a received payment and associates it with the public key.

If a user wants to retrieve their saved payments, they request them
and provide a valid NIP-98 header. The server validates the header and
parses their public key from it. It then looks up saves payments for
the public key and returns them.

Thanks to this npub.cash does not require sign-up or setup. Any nostr user can
use it straight away

## Payments

Npub.cash uses Cashu to handle payments, eliminating the need for traditional payment rails.
When the server receives a Lightning address request, it asks a Cashu mint for a Bolt11
`quote`. The mint responds with an invoice, which the server redirects to the payer.

The mint will then respond with an invoice to pay, which gets redirected
to the payer by the server. The server then keeps check whether the invoice was paid.
Once it has been, the server saves the mint's quote in its database.
