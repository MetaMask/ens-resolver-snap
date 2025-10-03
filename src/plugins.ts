import {
  encodeSolAddress,
  encodeTrxAddress,
  encodeBtcAddress,
} from '@ensdomains/address-encoder/coders';
import { valueToBytes } from '@metamask/utils';
import type { BytesLike } from 'ethers';
import { MulticoinProviderPlugin } from 'ethers';

import { CAIP_CHAIN_ID_TO_SLIP_44_COIN_TYPE } from './constants';

export class NonEvmCoinPlugin extends MulticoinProviderPlugin {
  constructor() {
    super('Non-EVM Coin');
  }

  supportsCoinType(coinType: number): boolean {
    return Object.values(CAIP_CHAIN_ID_TO_SLIP_44_COIN_TYPE).includes(coinType);
  }

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
