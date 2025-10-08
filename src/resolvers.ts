import type { CaipNamespace } from '@metamask/utils';
import { KnownCaipNamespace } from '@metamask/utils';
import type { BrowserProvider } from 'ethers';

import { PROTOCOL_NAME } from './constants';
import { addressIsContract } from './utils';

/**
 * Resolves the given domain to an Ethereum address.
 * @param provider - The browser provider.
 * @param namespace - The CAIP namespace.
 * @param domain - The ENS domain to resolve.
 * @param coinType - The SLIP-44 coin type (default is 60 for Ethereum).
 * @param chainId - The chain ID in decimal format.
 * @returns The resolved address or null if not found.
 */
export async function resolveDomain(
  provider: BrowserProvider,
  namespace: CaipNamespace,
  domain: string,
  coinType?: number,
  chainId?: number,
) {
  const ensResolver = await provider.getResolver(domain);

  if (!ensResolver) {
    return null;
  }

  if (namespace === KnownCaipNamespace.Eip155) {
    // ethers internally converts to coin type.
    const resolvedAddress = await ensResolver.getAddress(chainId);

    if (resolvedAddress) {
      return {
        resolvedAddress,
        protocol: PROTOCOL_NAME,
        domainName: domain,
      };
    }

    const mainnetAddress = await ensResolver.getAddress();

    if (
      !mainnetAddress ||
      (await addressIsContract(provider, mainnetAddress))
    ) {
      return null;
    }

    return {
      resolvedAddress: mainnetAddress,
      protocol: `⚠️ ${PROTOCOL_NAME} (${(await provider.getNetwork()).name})`,
      domainName: domain,
    };
  }

  // Prevent resolving unsupported coin types.
  if (coinType === undefined) {
    return null;
  }

  const resolvedAddress = await ensResolver.getAddress(coinType);

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
 * Resolves the given address to an ENS domain.
 * @param provider - The browser provider.
 * @param address - The address to resolve.
 * @returns The resolved domain or null if not found.
 */
export async function resolveAddress(
  provider: BrowserProvider,
  address: string,
) {
  const resolvedDomain = await provider.lookupAddress(address);

  if (!resolvedDomain) {
    return null;
  }

  return {
    resolvedDomain,
    protocol: PROTOCOL_NAME,
  };
}
