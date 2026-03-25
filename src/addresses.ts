// ./src/addresses.ts

import { AddressData } from './interfaces';

/**
 * Format address data into a short display string (e.g. for place auto-fill).
 * Includes: address1, city, region
 *
 * @param address - The address data object. Returns empty string if falsy.
 */
export const formatAddressShort = (address: AddressData | null | undefined): string => {
  if (!address) return '';

  const parts: string[] = [];

  if (address.address1) parts.push(address.address1);
  if (address.city) parts.push(address.city);
  if (address.region) parts.push(address.region);

  return parts.join(', ');
};

/**
 * Format address data into a full display string (e.g. for a location field).
 * Includes: address1, city, region, postalCode, country
 *
 * @param address - The address data object. Returns empty string if falsy.
 */
export const formatAddressFull = (address: AddressData | null | undefined): string => {
  if (!address) return '';

  const parts: string[] = [];

  if (address.address1) parts.push(address.address1);
  if (address.city) parts.push(address.city);

  // Combine region and postal code (e.g. "AB T2P 1J9" or "CA 90210")
  const regionPostal: string[] = [];
  if (address.region) regionPostal.push(address.region);
  if (address.postalCode) regionPostal.push(address.postalCode);
  if (regionPostal.length > 0) parts.push(regionPostal.join(' '));

  if (address.country) parts.push(address.country);

  return parts.join(', ');
};
