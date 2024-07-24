# ENS resolver Snap

This Snap demonstrates forward and reverse name resolution based on
the [Ethereum Name Service protocol (ENS)](https://ens.domains).

## Development

You have to specify an `INFURA_PROJECT_ID` environment variable to build or test the project. It might work without one,
but it will be severely slow. Use the `.env.example` file in the `snap/` folder to set up your project ID.
This will change once there is a way for snaps to request a multi-network provider, since ENS resolution starts by
querying Ethereum mainnet.

After installing the snap in [MetaMask Flask](https://metamask.io/flask/), use any address input field to type in an ENS
name.

```shell
yarn install && yarn build
```

## Testing and Linting

Run `yarn test` to run the jest tests once.

Run `yarn lint` to run the linter, or run `yarn lint:fix` to run the linter and
fix any automatically fixable issues.

This can also be manually tested, by using the `build/preinstalled-snap.json` file in your
local [Metamask extension build](https://github.com/MetaMask/metamask-extension/blob/be1c107fd323112a6677e05e2714b6602c4367ab/app/scripts/snaps/preinstalled-snaps.ts#L3)

## CI

There are some automatic checks that run on Github workflows. Be mindful
of [using secrets in reusable workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows#using-inputs-and-secrets-in-a-reusable-workflow)
when setting up your `INFURA_PROJECT_ID`.
