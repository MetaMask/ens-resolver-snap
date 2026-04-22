import type { CaipChainId } from '@metamask/utils';
import { numberToHex } from '@metamask/utils';
import { BrowserProvider } from 'ethers';
import type { AbstractProvider, AddressLike } from 'ethers';

import { ENS_SUPPORTED_CHAINS } from './constants';
import { NonEvmCoinPlugin } from './plugins';
/**
 * Tries to determine if an address is currently a contract.
 *
 * @param provider - The provider for the network.
 * @param address - The address to check.
 * @returns True if the given address has bytecode set or if an error occurs. False otherwise.
 */
export async function addressIsContract(
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

/**
 * Checks if the given chain ID is supported by ENS.
 *
 * @param chainId - The chain ID in CAIP format.
 * @returns True if the chain is supported, false otherwise.
 */
export function isSupportedChain(chainId: CaipChainId) {
  return ENS_SUPPORTED_CHAINS.includes(chainId);
}

/**
 * Configures and returns a provider for the given chain ID.
 * Defaults to ethereum mainnet if the chain is unsupported.
 *
 * @param chainId - The chain ID in decimal format.
 * @returns The configured provider.
 */
export async function configureProvider(chainId: number) {
  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: numberToHex(chainId) }],
  });

  const provider = new BrowserProvider(ethereum, chainId, {
    staticNetwork: true,
  });

  provider.attachPlugin(new NonEvmCoinPlugin());

  return provider;
}
