import type { OnNameLookupHandler } from '@metamask/snaps-sdk';
import { parseCaipChainId } from '@metamask/utils';

import { ENS_SUPPORTED_CHAINS } from './constants';
import { resolveAddress, resolveDomain } from './resolvers';
import { configureProvider } from './utils';

export const onNameLookup: OnNameLookupHandler = async (request) => {
  const { chainId, address, domain } = request;
  const { namespace, reference } = parseCaipChainId(chainId);

  const isSupportedChain = ENS_SUPPORTED_CHAINS.includes(chainId);

  const decimalChainId = parseInt(reference ?? '1', 10);

  const provider = await configureProvider(
    isSupportedChain ? decimalChainId : 1,
  );

  if (domain) {
    const resolution = await resolveDomain(
      provider,
      namespace,
      domain,
      isSupportedChain ? undefined : decimalChainId,
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
};
