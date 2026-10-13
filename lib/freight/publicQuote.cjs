// Public estimates must have complete route evidence, never fallback geometry.
function isUsablePublicQuote(quote) {
  const amounts = ['totalIncVat', 'middleFee', 'palletTotal', 'ferryTotal', 'collectionFee', 'deliveryFee', 'customsTotal'];
  const route = quote?.routeInfo;
  return amounts.every(key => Number.isFinite(quote?.[key]) && quote[key] >= 0)
    && route?.approximateLocations !== true
    && Number.isFinite(route?.totalMiles) && route.totalMiles > 0
    && Array.isArray(route?.legs) && route.legs.length > 0
    && route.legs.every(leg => leg && !leg.error && Number.isFinite(leg.distanceMiles) && leg.distanceMiles >= 0)
    && Array.isArray(route?.polyline) && route.polyline.length > 1
    && route.polyline.every(point => Array.isArray(point) && point.length === 2
      && Number.isFinite(point[0]) && Math.abs(point[0]) <= 90
      && Number.isFinite(point[1]) && Math.abs(point[1]) <= 180);
}

module.exports = { isUsablePublicQuote };
