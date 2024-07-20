import { describe, it } from '@jest/globals';
import * as dotenv from 'dotenv';
import type { Eip1193Provider, JsonRpcProvider } from 'ethers';
import { InfuraProvider } from 'ethers';

// load ENV before snap
dotenv.config();

// eslint-disable-next-line
import { onNameLookup } from '.';

class WrapProvider implements Eip1193Provider {
  provider: JsonRpcProvider;

  constructor(provider: JsonRpcProvider) {
    this.provider = provider;
  }

  async request(request: {
    method: string;
    params?: any[] | Record<string, any>;
  }): Promise<any> {
    return await this.provider.send(request.method, request.params ?? []);
  }
}

// TODO: use mocks instead of live networks!!!!!

// eslint-disable-next-line no-restricted-globals
const infuraProjectId = process.env.INFURA_PROJECT_ID;

describe('onNameLookup', () => {
  describe('with domain', () => {
    describe('on L2', () => {
      it('resolves EOA address from mainnet', async () => {
        const chainId = 59144;

        const result = await onNameLookup({
          domain: 'vitalik.eth',
          chainId: `eip155:${chainId}`,
        });

        expect(result?.resolvedAddresses?.[0].resolvedAddress).toMatch(
          /^0x.*$/u,
        );
        expect(result).toStrictEqual({
          resolvedAddresses: [
            {
              resolvedAddress: expect.any(String),
              protocol: '⚠️ Ethereum Name Service (mainnet)',
              domainName: 'vitalik.eth',
            },
          ],
        });
      });

      it('resolves network specific address on L2', async () => {
        const chainId = 8453;

        const result = await onNameLookup({
          domain: 'luc.eth',
          chainId: `eip155:${chainId}`,
        });

        expect(result?.resolvedAddresses?.[0].resolvedAddress).toMatch(
          /^0x.*$/u,
        );
        expect(result).toStrictEqual({
          resolvedAddresses: [
            {
              resolvedAddress: expect.any(String),
              protocol: 'Ethereum Name Service',
              domainName: 'luc.eth',
            },
          ],
        });
      });

      it('returns null when on L2 and mainnet address is a contract', async () => {
        const chainId = 59144;

        const result = await onNameLookup({
          domain: '1inch.eth',
          chainId: `eip155:${chainId}`,
        });

        expect(result).toBeNull();
      });
    });

    describe('on mainnet', () => {
      const chainId = 1;

      beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-restricted-globals
        global.ethereum = new WrapProvider(
          new InfuraProvider(chainId, infuraProjectId),
        );
      });

      afterAll(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-restricted-globals
        global.ethereum = undefined;
      });

      it('resolves EOA address on mainnet', async () => {
        const result = await onNameLookup({
          domain: 'luc.eth',
          chainId: `eip155:${chainId}`,
        });

        expect(result?.resolvedAddresses?.[0].resolvedAddress).toMatch(
          /^0x.*$/u,
        );
        expect(result).toStrictEqual({
          resolvedAddresses: [
            {
              resolvedAddress: expect.any(String),
              protocol: 'Ethereum Name Service',
              domainName: 'luc.eth',
            },
          ],
        });
      });

      it('resolves contract address on mainnet', async () => {
        const result = await onNameLookup({
          domain: '1inch.eth',
          chainId: `eip155:${chainId}`,
        });

        expect(result?.resolvedAddresses?.[0].resolvedAddress).toMatch(
          /^0x.*$/u,
        );
        expect(result).toStrictEqual({
          resolvedAddresses: [
            {
              resolvedAddress: expect.any(String),
              protocol: 'Ethereum Name Service',
              domainName: '1inch.eth',
            },
          ],
        });
      });
    });

    describe('on sepolia', () => {
      const chainId = 11155111;

      beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-restricted-globals
        global.ethereum = new WrapProvider(
          new InfuraProvider(chainId, infuraProjectId),
        );
      });

      afterAll(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-restricted-globals
        global.ethereum = undefined;
      });

      it('resolves EOA address on sepolia', async () => {
        const result = await onNameLookup({
          domain: 'luc.eth',
          chainId: `eip155:${chainId}`,
        });

        expect(result?.resolvedAddresses?.[0].resolvedAddress).toMatch(
          /^0x.*$/u,
        );
        expect(result).toStrictEqual({
          resolvedAddresses: [
            {
              resolvedAddress: expect.any(String),
              protocol: 'Ethereum Name Service',
              domainName: 'luc.eth',
            },
          ],
        });
      });

      it('resolves contract address on sepolia', async () => {
        const result = await onNameLookup({
          domain: '1inch.eth',
          chainId: `eip155:${chainId}`,
        });

        expect(result?.resolvedAddresses?.[0].resolvedAddress).toMatch(
          /^0x.*$/u,
        );
        expect(result).toStrictEqual({
          resolvedAddresses: [
            {
              resolvedAddress: expect.any(String),
              protocol: 'Ethereum Name Service',
              domainName: '1inch.eth',
            },
          ],
        });
      });
    });
  });

  describe('with address', () => {
    describe('on mainnet', () => {
      const chainId = 1;

      beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-restricted-globals
        global.ethereum = new WrapProvider(
          new InfuraProvider(chainId, infuraProjectId),
        );
      });

      afterAll(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-restricted-globals
        global.ethereum = undefined;
      });

      it('resolves domain on mainnet', async () => {
        const result = await onNameLookup({
          address: '0x225f137127d9067788314bc7fcc1f36746a3c3B5',
          chainId: `eip155:${chainId}`,
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
  });

  describe('with nothing', () => {
    const chainId = 11155111;

    beforeAll(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-restricted-globals
      global.ethereum = new WrapProvider(
        new InfuraProvider(chainId, infuraProjectId),
      );
    });

    afterAll(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-restricted-globals
      global.ethereum = undefined;
    });

    it('returns null if no domain or address', async () => {
      const request = {
        chainId: `eip155:${chainId}`,
      };

      // @ts-expect-error - Testing invalid request.
      expect(await onNameLookup(request)).toBeNull();
    });

    it('returns null if unknown domain', async () => {
      const request = {
        chainId: `eip155:${chainId}`,
        domain: 'unknown.domain',
      };

      // @ts-expect-error - Testing invalid request.
      expect(await onNameLookup(request)).toBeNull();
    });
  });
});
