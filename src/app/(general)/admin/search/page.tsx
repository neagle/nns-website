"use client";
import React from "react";

const Search = () => {
  const onClick = async () => {
    const response = await fetch("/api/search/generate");
    const data = await response.json();
    console.log("Search index generated:", data);
  };

  return (
    <div className="p-4 md:p-6 xl:p-8">
      <h1>Search</h1>
      <button className="btn" onClick={onClick}>
        Search
      </button>
    </div>
  );
};

export default Search;
