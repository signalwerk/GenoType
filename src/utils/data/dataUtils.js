// dataUtils.js
export function combineData(contentData, config) {
  const { mainCollectionKey, relationships } = config;
  const mainItems = contentData[mainCollectionKey] || [];

  // Create lookup maps for each sub-collection
  const dataMaps = Object.entries(relationships).reduce(
    (acc, [key, { collectionKey }]) => {
      acc[key] = contentData[collectionKey].reduce((map, item) => {
        map[item.id] = item;
        return map;
      }, {});
      return acc;
    },
    {},
  );

  // Process each item in the main collection and enrich with related data
  return mainItems.map((item) => {
    const enrichedItem = { ...item };

    for (const [field, { collectionKey, type }] of Object.entries(
      relationships,
    )) {
      const map = dataMaps[field];

      if (type === "1:1") {
        enrichedItem[`${field}Data`] = map[item[field]] || `Unknown ${field}`;
      } else if (type === "1:n" && Array.isArray(item[field])) {
        enrichedItem[`${field}Data`] = item[field].map(
          (id) => map[id] || `Unknown ${field}`,
        );
      }
    }

    return enrichedItem;
  });
}
