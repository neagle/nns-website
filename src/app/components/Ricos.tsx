import React from "react";
// Import RichContent type
import { RichContent } from "@wix/auto_sdk_events_wix-events-v-2";

interface Props {
  richContent: RichContent;
}

const Ricos = async ({ richContent }: Props) => {
  console.log("sending ricos richContent", richContent);

  const response = await fetch("http://localhost:3001/api/render-ricos", {
    method: "POST",
    body: JSON.stringify({ richContent }),
  });

  const { html } = await response.json();
  console.log("html", html);

  // console.log("response", response);

  return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
};

export default Ricos;
