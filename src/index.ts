import type {
  AddressLookupArgs,
  AddressLookupResult,
  DomainLookupArgs,
  DomainLookupResult,
  OnNameLookupHandler,
} from '@metamask/snaps-sdk';
import type { AbstractProvider, AddressLike } from 'ethers';
import { BrowserProvider } from 'ethers';

const ENS_SUPPORTED_CHAINS = ['eip155:1', 'eip155:11155111', 'eip155:17000'];
const PROTOCOL_NAME = 'Ethereum Name Service';

/**
 * Tries to determine if an address is currently a contract.
 * When unknown it returns `true`.
 * @param provider - AbstractProvider - the provider for the network.
 * @param address - AddressLike - the address to check.
 * @returns Promise<boolean> - true if the given address has bytecode set.
 */
async function addressIsContract(
  provider: AbstractProvider,
  address: AddressLike,
) {
  try {
    const code = await provider.getCode(address, 'pending');
    return code !== '0x';
  } catch (error) {
    console.error(
      'Unable to determine if resolved ENS address is a contract. Assuming it is and returning nothing.',
    );
    return true; // err on the side of caution
  }
}

export const onNameLookup: OnNameLookupHandler = async (
  request: AddressLookupArgs | DomainLookupArgs,
): Promise<AddressLookupResult | DomainLookupResult | null> => {
  const { chainId, address, domain } = request;

  const chainIdInt = parseInt(chainId.split(':')[1] ?? '1', 10);
  const providerChainId = ENS_SUPPORTED_CHAINS.includes(chainId)
    ? chainIdInt
    : 1;

  // Ensure that we are on the correct chain, falling back to mainnet
  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: `0x${providerChainId.toString(16)}` }],
  });

  const provider = new BrowserProvider(ethereum, providerChainId);

  if (domain) {
    const ensResolver = await provider.getResolver(domain);

    if (ENS_SUPPORTED_CHAINS.includes(chainId)) {
      const ethAddress = await ensResolver?.getAddress();
      if (ethAddress) {
        return {
          resolvedAddresses: [
            {
              resolvedAddress: ethAddress,
              protocol: PROTOCOL_NAME,
              domainName: domain,
            },
          ],
        };
      }
    } else {
      // coin type conversion is done by ethers internally
      const coinAddress = await ensResolver?.getAddress(chainIdInt);
      if (coinAddress) {
        return {
          resolvedAddresses: [
            {
              resolvedAddress: coinAddress,
              protocol: PROTOCOL_NAME,
              domainName: domain,
            },
          ],
        };
      }
      const mainnetAddress = await ensResolver?.getAddress();
      if (mainnetAddress) {
        const isContract = await addressIsContract(provider, mainnetAddress);
        if (!isContract) {
          const networkName = (await provider.getNetwork()).name;
          return {
            resolvedAddresses: [
              {
                resolvedAddress: mainnetAddress,
                protocol: `⚠️ ${PROTOCOL_NAME} (${networkName})`,
                domainName: domain,
              },
            ],
          };
        }
      }
    }
  } else if (address) {
    const resolvedDomain = await provider.lookupAddress(address);
    if (resolvedDomain) {
      return {
        resolvedDomains: [{ resolvedDomain, protocol: PROTOCOL_NAME }],
      } as AddressLookupResult;
    }
  }

  return null;
};
