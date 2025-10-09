import { afterEach, describe, expect, it } from '@jest/globals';

import { onNameLookup } from '.';
import {
  bitcoinAddressMock,
  l2AddressOnL2Mock,
  mainnetAddressMock,
  mainnetAddressOnL2Mock,
  mainnetContractMock,
  mainnetContractOnL2Mock,
  mainnetDomainMock,
  resetEthereumRequestMock,
  sepoliaAddressMock,
  sepoliaContractMock,
  setupEthereumRequestMock,
  solanaAddressMock,
  tronAddressMock,
  unknownDomainMock,
} from './test/mocks';

describe('onNameLookup', () => {
  describe('domain resolution', () => {
    describe('on layer 2', () => {
      afterEach(() => {
        resetEthereumRequestMock();
      });

      it('resolves an EOA address from mainnet', async () => {
        const requestSpy = setupEthereumRequestMock(mainnetAddressOnL2Mock);

        const result = await onNameLookup({
          domain: 'nick.eth',
          chainId: `eip155:59114`,
        });

        expect(requestSpy).toHaveBeenNthCalledWith(1, {
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        });

        expect(result).toStrictEqual({
          resolvedAddresses: [
            {
              resolvedAddress: '0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5',
              protocol: '⚠️ Ethereum Name Service (mainnet)',
              domainName: 'nick.eth',
            },
          ],
        });
      });

      it('resolves a network specific address on L2', async () => {
        const requestSpy = setupEthereumRequestMock(l2AddressOnL2Mock);

        const result = await onNameLookup({
          domain: 'luc.eth',
          chainId: `eip155:8453`,
        });

        expect(requestSpy).toHaveBeenNthCalledWith(1, {
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        });

        expect(result).toStrictEqual({
          resolvedAddresses: [
            {
              resolvedAddress: '0x225f137127d9067788314bc7fcc1f36746a3c3B5',
              protocol: 'Ethereum Name Service',
              domainName: 'luc.eth',
            },
          ],
        });
      });

      it('does not resolve a mainnet contract address on a layer 2', async () => {
        const requestSpy = setupEthereumRequestMock(mainnetContractOnL2Mock);

        const result = await onNameLookup({
          domain: '1inch.eth',
          chainId: `eip155:59144`,
        });

        expect(requestSpy).toHaveBeenNthCalledWith(1, {
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        });

        expect(result).toBeNull();
      });
    });

    describe('on mainnet', () => {
      afterEach(() => {
        resetEthereumRequestMock();
      });

      it('resolves an EOA address on mainnet', async () => {
        const requestSpy = setupEthereumRequestMock(mainnetAddressMock);

        const result = await onNameLookup({
          domain: 'luc.eth',
          chainId: `eip155:1`,
        });

        expect(requestSpy).toHaveBeenNthCalledWith(1, {
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        });

        expect(result).toStrictEqual({
          resolvedAddresses: [
            {
              resolvedAddress: '0x225f137127d9067788314bc7fcc1f36746a3c3B5',
              protocol: 'Ethereum Name Service',
              domainName: 'luc.eth',
            },
          ],
        });
      });

      it('resolves a contract address on mainnet', async () => {
        const requestSpy = setupEthereumRequestMock(mainnetContractMock);

        const result = await onNameLookup({
          domain: '1inch.eth',
          chainId: `eip155:1`,
        });

        expect(requestSpy).toHaveBeenNthCalledWith(1, {
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        });

        expect(result).toStrictEqual({
          resolvedAddresses: [
            {
              resolvedAddress: '0x1111111254EEB25477B68fb85Ed929f73A960582',
              protocol: 'Ethereum Name Service',
              domainName: '1inch.eth',
            },
          ],
        });
      });

      it('returns null for an unknown domain', async () => {
        const requestSpy = setupEthereumRequestMock(unknownDomainMock);

        const result = await onNameLookup({
          chainId: `eip155:1`,
          domain: 'unknown.domain',
        });

        expect(requestSpy).toHaveBeenNthCalledWith(1, {
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        });

        expect(result).toBeNull();
      });

      it('returns null if an error occurs', async () => {
        setupEthereumRequestMock();

        const result = await onNameLookup({
          chainId: `eip155:1`,
          domain: 'mnhsu.xyz',
        });

        expect(result).toBeNull();
      });
    });

    describe('on sepolia', () => {
      afterEach(() => {
        resetEthereumRequestMock();
      });

      it('resolves an EOA address', async () => {
        const requestSpy = setupEthereumRequestMock(sepoliaAddressMock);

        const result = await onNameLookup({
          domain: 'luc.eth',
          chainId: `eip155:11155111`,
        });

        expect(requestSpy).toHaveBeenNthCalledWith(1, {
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });

        expect(result).toStrictEqual({
          resolvedAddresses: [
            {
              resolvedAddress: '0x225f137127d9067788314bc7fcc1f36746a3c3B5',
              protocol: 'Ethereum Name Service',
              domainName: 'luc.eth',
            },
          ],
        });
      });

      it('resolves a contract address', async () => {
        const requestSpy = setupEthereumRequestMock(sepoliaContractMock);

        const result = await onNameLookup({
          domain: '1inch.eth',
          chainId: `eip155:11155111`,
        });

        expect(requestSpy).toHaveBeenNthCalledWith(1, {
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });

        expect(result).toStrictEqual({
          resolvedAddresses: [
            {
              resolvedAddress: '0x03d5003bf0e79C5F5223588F347ebA39AfbC3818',
              protocol: 'Ethereum Name Service',
              domainName: '1inch.eth',
            },
          ],
        });
      });
    });

    describe('on non-evm networks', () => {
      afterEach(() => {
        resetEthereumRequestMock();
      });

      it('resolves an address on bitcoin mainnet', async () => {
        const requestSpy = setupEthereumRequestMock(bitcoinAddressMock);

        const result = await onNameLookup({
          domain: 'ricmoo.eth',
          chainId: `bip122:000000000019d6689c085ae165831e93`,
        });

        expect(requestSpy).toHaveBeenNthCalledWith(1, {
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        });

        expect(result).toStrictEqual({
          resolvedAddresses: [
            {
              resolvedAddress: '1RicMooMWxqKczuRCa5D2dnJaUEn9ZJyn',
              protocol: 'Ethereum Name Service',
              domainName: 'ricmoo.eth',
            },
          ],
        });
      });

      it('resolves an address on solana mainnet', async () => {
        const requestSpy = setupEthereumRequestMock(solanaAddressMock);

        const result = await onNameLookup({
          domain: 'solscan.eth',
          chainId: `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`,
        });

        expect(requestSpy).toHaveBeenNthCalledWith(1, {
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        });

        expect(result).toStrictEqual({
          resolvedAddresses: [
            {
              resolvedAddress: '39XDnriEDTWF9axxNxBg7fRfFAthFVU5K8cYEes3BrZx',
              protocol: 'Ethereum Name Service',
              domainName: 'solscan.eth',
            },
          ],
        });
      });

      it('resolves an address on tron mainnet', async () => {
        const requestSpy = setupEthereumRequestMock(tronAddressMock);

        const result = await onNameLookup({
          domain: 'trontest.eth',
          chainId: `tron:728126428`,
        });

        expect(requestSpy).toHaveBeenNthCalledWith(1, {
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        });

        expect(result).toStrictEqual({
          resolvedAddresses: [
            {
              resolvedAddress: 'TNa2QgNxjzBhNPzPBgLFqKC8VjGG8yMufg',
              protocol: 'Ethereum Name Service',
              domainName: 'trontest.eth',
            },
          ],
        });
      });
    });
  });

  describe('address resolution', () => {
    describe('on mainnet', () => {
      afterEach(() => {
        resetEthereumRequestMock();
      });

      it('resolves domain on mainnet', async () => {
        const requestSpy = setupEthereumRequestMock(mainnetDomainMock);

        const result = await onNameLookup({
          address: '0x225f137127d9067788314bc7fcc1f36746a3c3B5',
          chainId: `eip155:1`,
        });

        expect(requestSpy).toHaveBeenNthCalledWith(1, {
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        });

        expect(result).toStrictEqual({
          resolvedDomains: [
            {
              resolvedDomain: 'luc.eth',
              protocol: 'Ethereum Name Service',
            },
          ],
        });
      });
    });

    describe('on unsupported chain', () => {
      afterEach(() => {
        resetEthereumRequestMock();
      });

      it('returns null for unsupported chain', async () => {
        setupEthereumRequestMock();

        const result = await onNameLookup({
          address: '39XDnriEDTWF9axxNxBg7fRfFAthFVU5K8cYEes3BrZx',
          chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
        });

        expect(result).toBeNull();
      });
    });
  });
});
