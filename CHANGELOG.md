# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0]

### Added

- Support ENS v2 ([#85](https://github.com/MetaMask/ens-resolver-snap/pull/85))
  - To support this, we now use `viem` instead of `ethers`

## [1.1.0]

### Changed

- Update the returned protocol name when resolving a layer 2 domain on mainnet ([#77](https://github.com/MetaMask/ens-resolver-snap/pull/77))

## [1.0.0]

### Added

- Add support for ENS resolution on non-EVM chains ([#69](https://github.com/MetaMask/ens-resolver-snap/pull/69))

### Changed

- Bump Snaps dependencies ([#72](https://github.com/MetaMask/ens-resolver-snap/pull/72))

### Fixed

- Re-enable resolution on all EVM networks ([#69](https://github.com/MetaMask/ens-resolver-snap/pull/69))

## [0.1.4]

### Fixed

- Add `chains` caveat to `name-lookup` endowment ([#65](https://github.com/MetaMask/ens-resolver-snap/pull/65))

## [0.1.3]

### Fixed

- Switch chain before making requests ([#62](https://github.com/MetaMask/ens-resolver-snap/pull/62))
- Move dependencies to dev dependencies ([#63](https://github.com/MetaMask/ens-resolver-snap/pull/63))

## [0.1.2]

### Fixed

- Fix Ethereum provider connection for non-mainnet ([#38](https://github.com/MetaMask/ens-resolver-snap/pull/38))

## [0.1.1]

### Changed

- Update a dependency that had a security vulnerability
  warning ([#29](https://github.com/MetaMask/ens-resolver-snap/pull/29))

## [0.1.0]

### Added

- Implement ENS resolver snap (based on snap monorepo
  template) ([#1](https://github.com/MetaMask/ens-resolver-snap/pull/1))

[Unreleased]: https://github.com/MetaMask/ens-resolver-snap/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/MetaMask/ens-resolver-snap/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/MetaMask/ens-resolver-snap/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/MetaMask/ens-resolver-snap/compare/v0.1.4...v1.0.0
[0.1.4]: https://github.com/MetaMask/ens-resolver-snap/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/MetaMask/ens-resolver-snap/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/MetaMask/ens-resolver-snap/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/MetaMask/ens-resolver-snap/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/MetaMask/ens-resolver-snap/releases/tag/v0.1.0
