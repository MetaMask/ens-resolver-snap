import type { CaipNamespace } from '@metamask/utils';
import { KnownCaipNamespace } from '@metamask/utils';

import { PROTOCOL_NAME, PROTOCOL_NAME_MAINNET } from './constants';
import { addressIsContract } from './utils';
import { PublicClient, toCoinType } from 'viem';
import { normalize } from 'viem/ens'

/**
 *
 */
type DomainResolution = {
  /**
   * The resolved address for the given domain.
   */
  resolvedAddress: string;

  /**
   * The protocol used for resolution (e.g., "Ethereum Name Service").
   */
  protocol: string;

  /**
   * The original domain name that was resolved.
   */
  domainName: string;
};

/**
 * Resolves the given domain to an Ethereum address.
 *
 * @param provider - The browser provider.
 * @param namespace - The CAIP namespace.
 * @param domain - The ENS domain to resolve.
 * @param coinType - The SLIP-44 coin type (default is 60 for Ethereum).
 * @param chainId - The chain ID in decimal format.
 * If not provided, it assumes that the request is a natively supported ENS chain.
 * @returns The resolved address or null if not found.
 */
export async function resolveDomain(
  client: any,
  namespace: CaipNamespace,
  domain: string,
  coinType?: number,
  chainId?: number,
): Promise<DomainResolution | null>  {
  /**const ensResolver = await client.getResolver(domain);

  if (!ensResolver) {
    return null;
  }**/

    const normalizedDomain =  normalize(domain);

  if (namespace === KnownCaipNamespace.Eip155) {
    // ethers internally converts to coin type.
    const resolvedAddress = await client.getEnsAddress({ name: normalizedDomain, coinType: chainId && toCoinType(chainId) });

    console.log(resolvedAddress);

    if (resolvedAddress) {
      return {
        resolvedAddress,
        protocol: PROTOCOL_NAME,
        domainName: domain,
      };
    }

    // Prevent resolving twice on mainnet.
    if (!chainId) {
      return null;
    }

    const mainnetAddress = await client.getEnsAddress({ name: normalizedDomain });
    
    console.log(mainnetAddress)

    if (
      !mainnetAddress ||
      (await addressIsContract(client, mainnetAddress))
    ) {
      return null;
    }

    return {
      resolvedAddress: mainnetAddress,
      protocol: PROTOCOL_NAME_MAINNET,
      domainName: domain,
    };
  }

  // Prevent resolving unsupported coin types.
  if (coinType === undefined) {
    return null;
  }

  const resolvedAddress = await client.getEnsAddress({ name: normalizedDomain, coinType });

  if (!resolvedAddress) {
    return null;
  }

  return {
    resolvedAddress,
    protocol: PROTOCOL_NAME,
    domainName: domain,
  };
}

/**
 *
 */
type AddressResolution = {
  /**
   * The resolved ENS domain for the given address.
   */
  resolvedDomain: string;

  /**
   * The protocol used for resolution (e.g., "Ethereum Name Service").
   */
  protocol: string;
};

/**
 * Resolves the given address to an ENS domain.
 *
 * @param provider - The browser provider.
 * @param address - The address to resolve.
 * @returns The resolved domain or null if not found.
 */
export async function resolveAddress(
  client: any,
  address: string,
): Promise<AddressResolution | null> {
  const resolvedDomain = await client.getEnsName({ address });

  if (!resolvedDomain) {
    return null;
  }

  return {
    resolvedDomain,
    protocol: PROTOCOL_NAME,
  };
}
