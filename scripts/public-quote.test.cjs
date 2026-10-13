const { test } = require('node:test');
const assert = require('node:assert/strict');
const { isUsablePublicQuote } = require('../lib/freight/publicQuote.cjs');
const valid = () => ({ totalIncVat: 120, middleFee: 0, palletTotal: 20, ferryTotal: 0, collectionFee: 40, deliveryFee: 40, customsTotal: 0,
  routeInfo: { totalMiles: 35, legs: [{ distanceMiles: 35 }], polyline: [[53.4, -2.98], [53.48, -2.24]] } });
test('complete route evidence permits an indicative public estimate', () => assert.equal(isUsablePublicQuote(valid()), true));
test('routing failure cannot become a public price through fallback geometry', () => {
  const quote = valid(); quote.routeInfo.legs[0].error = 'No valid route points';
  assert.equal(isUsablePublicQuote(quote), false);
});
test('missing or invalid route evidence is withheld from public estimates', () => {
  for (const route of [undefined, {}, { ...valid().routeInfo, approximateLocations: true }, { ...valid().routeInfo, legs: [] }, { ...valid().routeInfo, totalMiles: 0 }, { ...valid().routeInfo, polyline: [[999, 0], [53, -2]] }]) {
    assert.equal(isUsablePublicQuote({ ...valid(), routeInfo: route }), false);
  }
});
test('incomplete and invalid amounts cannot render a misleading quote breakdown', () => {
  for (const patch of [{ totalIncVat: NaN }, { totalIncVat: -1 }, { collectionFee: undefined }, { customsTotal: '0' }]) {
    assert.equal(isUsablePublicQuote({ ...valid(), ...patch }), false);
  }
  assert.equal(isUsablePublicQuote(null), false);
});
