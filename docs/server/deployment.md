# Deploying npubcash-server

Deploying your own instance of npubcash-server is easy. All you need is a webserver to deploy to and a PostgreSQL DB to connect npubcash-server to.

## Step-by-step deployment (Docker)

1. Clone the repository and checkout the v2 branch

```sh
git clone https://github.com/cashubtc/npubcash-server.git
cd npubcash-server
git checkout v2
```

2. Build the docker image

```sh
# Build the image with a tag of your choice and set the hostname you will be running npubcash-server on as build argument
docker build . -t npubcash-server --build-arg HOSTNAME=https://npubx.cash
```

3. Create an `.env` file and add required environment variables

- MENMONIC: A bip39 mnemonic that required secrets will be derived from
- DATABASE_URL: The full postgres connection string / url to connect to

Optional

- NOSTR_ENABLED: Set to true if npubcash-server should allow zap requests
- DEFAULT_RELAYS: Require if nostr is enabled. Comma separated list of default relays used for zap receipts if none are specified in the request
- USERNAME_MINT: Mint URL of the required mint for Cashu-402 username purchases (Must be set to enable username purchases)
- USERNAME_COST: Amount in sats that usernames are sold for (Must be set to enable username purchases)
- API_MODE: Enable the npubcash frontend. Either "BOTH" or "API_ONLY"
- LOG_LEVEL: Log level used for the internal stdout logger
- LNURL_MAX_AMOUNT: Max amount in msat allowed by the lnurl endpoint
- LNURL_MIN_AMOUNT: Min amount in msat allowed by the lnurl endpoint

4. Run the docker image
   docker run -i npubcash-server --env-file ./.env
