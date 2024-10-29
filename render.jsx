import fs from "fs-extra";
import path from "path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import App from "./src/App";
import prettier from "prettier";
import { combineData } from "./src/utils/data/dataUtils.js";
import { dataConfig } from "./src/utils/data/dataConfig.js";

// Function to load all JSON data from folders in the specified directory
const loadAllJSON = (directory) => {
  const data = {};
  const folders = fs
    .readdirSync(directory)
    .filter((subdir) =>
      fs.statSync(path.join(directory, subdir)).isDirectory(),
    );

  folders.forEach((folder) => {
    const folderPath = path.join(directory, folder);
    const files = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".json"));

    data[folder] = files.map((file) => {
      const filePath = path.join(folderPath, file);
      const fileContents = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(fileContents);
    });
  });

  return data;
};

(async () => {
  // Load all data from content folders
  const contentData = loadAllJSON("./content");

  const combinedData = combineData(contentData, dataConfig);
  fs.writeFileSync("file.json", JSON.stringify(combinedData, null, 2));

  // Render the app to static HTML
  const html = renderToStaticMarkup(<App initialData={combinedData} />);
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Font Generation Tools</title>
    </head>
    <body>
      <div id="root">${html}</div>
    </body>
    </html>
  `;

  // Prettify the HTML content
  const prettifiedHtml = await prettier.format(fullHtml, { parser: "html" });

  // Write the prettified content to the file
  await fs.outputFile("./docs/index.html", prettifiedHtml);

  console.log("Static HTML generated at docs/index.html");
})();
