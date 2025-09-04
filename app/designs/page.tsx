import * as React from "react";
import PexelsSidebar from "./PexelsSidebar";

export default async function TemplatesPage() {
  const curatedTemplates = await fetch(
    "https://api.pexels.com/v1/curated?per_page=20",
    {
      method: "GET",
      headers: {
        Authorization:
          "cyAIhzLLCFYqaRrw64rZa89ZZdhJkPQUQiXZOl69eB62BpOEVXsA2PdD",
      },
    }
  );
  const data = await curatedTemplates.json();
  console.log("data", data);
  return (
    <div>
      <p>Get started with designs</p>

      <PexelsSidebar photos={data.photos} />
    </div>
  );
}
