import type { OnNameLookupHandler } from '@metamask/snaps-sdk';
import { parseCaipChainId } from '@metamask/utils';

import { CAIP_CHAIN_ID_TO_SLIP_44_COIN_TYPE } from './constants';
import { resolveAddress, resolveDomain } from './resolvers';
import { configureProvider, isSupportedChain } from './utils';

/**
 * Handler for the `onNameLookup` method.
 * @param request - The name lookup request.
 * @returns The name lookup response or null if no resolution is found.
 */
export const onNameLookup: OnNameLookupHandler = async (request) => {
  const { chainId, address, domain } = request;
  const { namespace, reference } = parseCaipChainId(chainId);

  const chainIsSupported = isSupportedChain(chainId);

  const decimalChainId = parseInt(reference, 10);

  const coinType = CAIP_CHAIN_ID_TO_SLIP_44_COIN_TYPE[chainId];

  try {
    const provider = await configureProvider(
      chainIsSupported ? decimalChainId : 1,
    );

    if (domain) {
      const resolution = await resolveDomain(
        provider,
        namespace,
        domain,
        coinType,
        chainIsSupported ? undefined : decimalChainId,
      );

      if (resolution) {
        return {
          resolvedAddresses: [resolution],
        };
      }
    }

    if (address) {
      const resolution = await resolveAddress(provider, address);

      if (resolution) {
        return {
          resolvedDomains: [resolution],
        };
      }
    }

    return null;
  } catch (error) {
    console.error('[ENS Snap] Error during name lookup:', error);
    return null;
  }
};
