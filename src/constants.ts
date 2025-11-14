import type { CaipChainId } from '@metamask/utils';

/**
 * Protocol name for the ENS (Ethereum Name Service) resolver.
 */
export const PROTOCOL_NAME = 'Ethereum Name Service';

export const PROTOCOL_NAME_MAINNET =
  'Ethereum Name Service on Ethereum Mainnet';

/**
 * List of supported chains for ENS resolution.
 */
export const ENS_SUPPORTED_CHAINS = ['eip155:1', 'eip155:11155111'];

/**
 * Mapping from CAIP chain identifiers to SLIP-44 coin types.
 */
export const CAIP_CHAIN_ID_TO_SLIP_44_COIN_TYPE: Record<CaipChainId, number> = {
  'bip122:000000000019d6689c085ae165831e93': 0, // Bitcoin mainnet
  'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp': 501, // Solana
  'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1': 501, // Solana Devnet
  'solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z': 501, // Solana Testnet
  'tron:728126428': 195, // Tron Mainnet
  'tron:3448148188': 195, // Tron Nile Testnet
  'tron:2494104990': 195, // Tron Shasta Testnet
};
