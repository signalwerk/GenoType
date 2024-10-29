export const dataConfig = {
  mainCollectionKey: "tools",
  relationships: {
    platform: { collectionKey: "platforms", type: "1:1" },
    authors: { collectionKey: "authors", type: "1:n" },
  },
};
