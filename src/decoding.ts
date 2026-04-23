import {
  encodeBtcAddress,
  encodeSolAddress,
  encodeTrxAddress,
} from '@ensdomains/address-encoder/coders';
import type { Hex } from '@metamask/utils';
import { hexToBytes } from '@metamask/utils';

/**
 * Decodes the address for the given coin type.
 *
 * @param coinType - The SLIP-44 coin type.
 * @param data - The address data in hexadecimal.
 * @returns The decoded address as a string or null if unsupported.
 */
export function decodeNonEvmAddress(
  coinType: number,
  data: Hex,
): string | null {
  const bytes = hexToBytes(data);
  switch (coinType) {
    case 0:
      return encodeBtcAddress(bytes);
    case 501:
      return encodeSolAddress(bytes);
    case 195:
      return encodeTrxAddress(bytes);
    default:
      return null;
  }
}
