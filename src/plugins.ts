import {
  encodeSolAddress,
  encodeTrxAddress,
  encodeBtcAddress,
} from '@ensdomains/address-encoder/coders';
import { valueToBytes } from '@metamask/utils';
import type { BytesLike } from 'ethers';
import { MulticoinProviderPlugin } from 'ethers';

import { CAIP_CHAIN_ID_TO_SLIP_44_COIN_TYPE } from './constants';

/**
 * A plugin to decode non-EVM coin addresses for use with the ENS resolver.
 * Supports Bitcoin (0), Solana (501), and Tron (195).
 */
export class NonEvmCoinPlugin extends MulticoinProviderPlugin {
  constructor() {
    super('Non-EVM Coin');
  }

  /**
   * Checks if the plugin supports the given coin type.
   * @param coinType - The SLIP-44 coin type.
   * @returns True if the coin type is supported, false otherwise.
   */
  supportsCoinType(coinType: number): boolean {
    return Object.values(CAIP_CHAIN_ID_TO_SLIP_44_COIN_TYPE).includes(coinType);
  }

  /**
   * Decodes the address for the given coin type.
   * @param coinType - The SLIP-44 coin type.
   * @param data - The address data in bytes-like format.
   * @returns The decoded address as a string.
   * @throws If the coin type is unsupported.
   */
  async decodeAddress(coinType: number, data: BytesLike): Promise<string> {
    const bytes = valueToBytes(data);
    switch (coinType) {
      case 0:
        return encodeBtcAddress(bytes);
      case 501:
        return encodeSolAddress(bytes);
      case 195:
        return encodeTrxAddress(bytes);
      default:
        throw new Error(`Unsupported coin type: ${coinType}`);
    }
  }
}
