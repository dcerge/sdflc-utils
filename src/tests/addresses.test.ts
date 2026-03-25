// ./src/addresses.test.ts

import { formatAddressShort, formatAddressFull } from '../addresses';
import { AddressData } from '../interfaces';

// A complete address used as the base for most tests
const fullAddress: AddressData = {
  address1: '123 Main St',
  city: 'Calgary',
  region: 'AB',
  postalCode: 'T2P 1J9',
  country: 'Canada',
};

// Minimal valid address (region is the only required field)
const minimalAddress: AddressData = {
  region: null,
};

describe('formatAddressShort', () => {
  it('returns empty string for null', () => {
    expect(formatAddressShort(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatAddressShort(undefined)).toBe('');
  });

  it('returns empty string when all relevant fields are null', () => {
    expect(formatAddressShort({ region: null })).toBe('');
  });

  it('formats a full address correctly', () => {
    expect(formatAddressShort(fullAddress)).toBe('123 Main St, Calgary, AB');
  });

  it('formats with city and region only', () => {
    expect(formatAddressShort({ city: 'Calgary', region: 'AB' })).toBe('Calgary, AB');
  });

  it('formats with address1 only', () => {
    expect(formatAddressShort({ address1: '123 Main St', region: null })).toBe('123 Main St');
  });

  it('formats with region only', () => {
    expect(formatAddressShort({ region: 'AB' })).toBe('AB');
  });

  it('ignores postalCode and country', () => {
    expect(formatAddressShort({ region: 'AB', postalCode: 'T2P 1J9', country: 'Canada' })).toBe('AB');
  });
});

describe('formatAddressFull', () => {
  it('returns empty string for null', () => {
    expect(formatAddressFull(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatAddressFull(undefined)).toBe('');
  });

  it('returns empty string when all relevant fields are null', () => {
    expect(formatAddressFull({ region: null })).toBe('');
  });

  it('formats a full address correctly', () => {
    expect(formatAddressFull(fullAddress)).toBe('123 Main St, Calgary, AB T2P 1J9, Canada');
  });

  it('formats region and postal code together', () => {
    expect(formatAddressFull({ region: 'AB', postalCode: 'T2P 1J9' })).toBe('AB T2P 1J9');
  });

  it('formats region without postal code', () => {
    expect(formatAddressFull({ region: 'AB' })).toBe('AB');
  });

  it('formats postal code without region', () => {
    expect(formatAddressFull({ region: null, postalCode: 'T2P 1J9' })).toBe('T2P 1J9');
  });

  it('omits city when not present', () => {
    const { city, ...noCity } = fullAddress;
    expect(formatAddressFull(noCity)).toBe('123 Main St, AB T2P 1J9, Canada');
  });

  it('omits country when not present', () => {
    const { country, ...noCountry } = fullAddress;
    expect(formatAddressFull(noCountry)).toBe('123 Main St, Calgary, AB T2P 1J9');
  });

  it('formats city and country only', () => {
    expect(formatAddressFull({ city: 'Calgary', region: null, country: 'Canada' })).toBe('Calgary, Canada');
  });
});
