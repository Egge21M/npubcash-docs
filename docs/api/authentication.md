# Authentication

Most endpoints of the API are protected and accept either one of two authentication headers

## NIP-98 Auth

NIP-98 Auth is the basic authentication method inside npub.cash.
It requires a valid NIP-98 header on every request.
The exact format of the header is specified in the [nips repository](https://github.com/nostr-protocol/nips/blob/master/98.md).

The generated token is then included as `Authentication` header in the request

```
GET /api/v2/wallet/quotes
Authentication: Nostr eyJpZCI6ImZlOTY0ZTc1ODkwMzM...
```

:::warning
NIP-98 headers need to be recreated for every request.
If you are using a signing extension, this can lead to a lot of pop-ups.
Consider using JWT Auth instead.
:::

## JWT Auth

With JWT Auth users obtain a bearer authentication token that can then be used to
authenticate subsequent requests. The initial request for the token needs to be authenticated
with a [NIP-98](#nip-98-auth) Auth header.

```
GET /api/v2/auth/nip98
Authentication: Nostr eyJpZCI6ImZlOTY0ZTc1ODkwMzM...
```

The server will respond with a JSON payload including the token:

```json
{
  "error": false,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR..."
  }
}
```

The bearer token retrieved from this endpoint must then be used to authenticate subsequent
requests, by including it as `Authentication` header.

```
GET /api/v2/wallet/quotes
Authentication: Bearer eyJhbGciOiJIUzI1NiIsInR...
```
