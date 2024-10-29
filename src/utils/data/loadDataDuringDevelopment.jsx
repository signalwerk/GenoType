import { useEffect } from "react";
import { combineData } from "./dataUtils";

export function loadDataDuringDevelopment(initialData, setTools, setIsLoading) {
  if (import.meta.env.DEV && !initialData?.length) {
    async function loadData() {
      console.log("Loading data...");

      try {
        // Automatically import all JSON files from subdirectories in "../content"
        const files = import.meta.glob("../../../content/*/*.json");

        // Structure to hold the loaded content data by folder
        const contentData = {};

        // Load and categorize files based on folder name
        await Promise.all(
          Object.entries(files).map(async ([filePath, importFile]) => {
            const folderName = filePath.split("/").slice(-2, -1)[0];

            const module = await importFile();
            const data = module.default || module;
            if (!contentData[folderName]) contentData[folderName] = [];
            contentData[folderName].push(data);
          }),
        );

        // Configure combineData with main collection and relationships
        const combinedData = combineData(contentData, {
          mainCollectionKey: "tools",
          relationships: {
            platform: { collectionKey: "platforms", type: "1:1" },
            authors: { collectionKey: "authors", type: "1:n" },
          },
        });

        setTools(combinedData);
      } catch (error) {
        console.error("Error loading JSON files:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }
}
