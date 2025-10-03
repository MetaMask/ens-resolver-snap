/**
 * Protocol name for the ENS (Ethereum Name Service) resolver.
 */
export const PROTOCOL_NAME = 'Ethereum Name Service';

/**
 * List of supported chains for ENS resolution.
 */
export const ENS_SUPPORTED_CHAINS = [
  'eip155:1',
  'eip155:11155111',
  'eip155:17000',
];

/**
 * Mapping from CAIP chain identifiers to BIP-44 coin types.
 */
export const CAIP_CHAIN_TO_BIP44_COIN_TYPE: Record<string, number> = {
  bip122: 0, // Bitcoin
};
