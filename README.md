# ENS resolver Snap

This Snap demonstrates forward and reverse name resolution based on
the [Ethereum Name Service protocol (ENS)](https://ens.domains).

## Building

You have to specify an `INFURA_PROJECT_ID` environment variable to build or test the project. It might work without one,
but it will be severely slow. Use the `.env.example` file in the `snap/` folder to set up your project ID.
This will change once there is a way for snaps to request a multi-network provider, since ENS resolution starts by
querying Ethereum mainnet.

```shell
yarn install && yarn start
```

This will start a local webapp that can be used to install the snap.
After installing it in [MetaMask Flask](https://metamask.io/flask/), use any address input field to type in an ENS name.

## Testing and Linting

Run `yarn test` to run the tests once.

Run `yarn lint` to run the linter, or run `yarn lint:fix` to run the linter and
fix any automatically fixable issues.

## CI

There are some automatic checks that run on Github workflows. Be mindful
of [using secrets in reusable workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows#using-inputs-and-secrets-in-a-reusable-workflow)
when setting up your `INFURA_PROJECT_ID`.
