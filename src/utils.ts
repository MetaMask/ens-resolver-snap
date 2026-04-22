import type { CaipChainId, Hex } from '@metamask/utils';
import { numberToHex } from '@metamask/utils';
import type { PublicClient } from 'viem';
import { createPublicClient, custom } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

import { ENS_SUPPORTED_CHAINS } from './constants';

/**
 * Tries to determine if an address is currently a contract.
 *
 * @param provider - The provider for the network.
 * @param address - The address to check.
 * @returns True if the given address has bytecode set or if an error occurs. False otherwise.
 */
export async function addressIsContract(
  provider: PublicClient,
  address: Hex,
): Promise<boolean> {
  try {
    const code = await provider.getCode({ address, blockTag: 'pending' });
    return code !== undefined && code !== '0x';
  } catch {
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
export function isSupportedChain(chainId: CaipChainId): boolean {
  return ENS_SUPPORTED_CHAINS.includes(chainId);
}

/**
 * Configures and returns a provider for the given chain ID.
 * Defaults to ethereum mainnet if the chain is unsupported.
 *
 * @param chainId - The chain ID in decimal format.
 * @returns The configured provider.
 */
export async function configureProvider(
  chainId: number,
): Promise<PublicClient> {
  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: numberToHex(chainId) }],
  });

  const client = createPublicClient({
    chain: chainId === 11155111 ? sepolia : mainnet,
    transport: custom(ethereum),
  });

  return client;
}
