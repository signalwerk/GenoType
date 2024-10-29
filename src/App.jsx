import React, { useState, useEffect } from "react";
import { loadDataDuringDevelopment } from "./utils/data/loadDataDuringDevelopment.jsx";

function App({ initialData = {} }) {
  const [data, setData] = useState(initialData || []);
  const [isLoading, setIsLoading] = useState(!initialData?.length);

  useEffect(() => {
    console.log("initialData", import.meta.env);

    if (import.meta.env.DEV && !data?.length) {
      loadDataDuringDevelopment(initialData, setData, setIsLoading);
    }
  }, [initialData]);

  return (
    <div>
      <h1>Font Generation Tools</h1>
      {isLoading ? (
        <p>Loading tools...</p>
      ) : (
        data.map((tool, index) => (
          <div key={index}>
            <h2>{tool.title || "Untitled Tool"}</h2>
            <p>{tool.summary || "No summary available."}</p>
            <h3>Platform</h3>
            <p>{tool.platformData?.title || "Unknown Platform"}</p>
            <h3>Authors</h3>
            <ul>
              {tool.authorsData?.map((author, i) => (
                <li key={author.id}>
                  {author.firstname} {author.familyname || "Unknown Author"}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
