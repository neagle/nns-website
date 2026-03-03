"use client";
import React, { useCallback, useEffect, useState } from "react";
import type { Person } from "@/app/actions/people";
import { addPeople, getPeople } from "@/app/actions/people";
import type { WixDataItem } from "@wix/wix-data-items-sdk";
import classnames from "classnames";
import wixApiClient from "@/lib/wixClient";
import { getFirstMiddleLastNamesFromSlug } from "@/app/utils";

const AddPeople = () => {
  const [names, setNames] = useState("");
  const [parsedNames, setParsedNames] = useState<Person[]>();
  const [duplicates, setDuplicates] = useState<WixDataItem[]>([]);

  const parseNames = (names: string) => {
    const lines = names.split(/\n/);
    const parsed: Person[] = [];

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        const parts = trimmedLine.split(",");
        const firstName = parts[0];
        const lastName = parts[parts.length - 1];
        const middleName = parts.slice(1, -1).join(" ");

        parsed.push({
          firstName,
          middleName: middleName || undefined,
          lastName,
        });
      }
    });

    return parsed;
  };

  const getDuplicates = useCallback(
    async (people: Person[]) => {
      if (people.length === 0) {
        return;
      }

      const duplicates = await getPeople({ people });
      console.log("duplicates", duplicates);
      setDuplicates(duplicates);
      const parsed = parseNames(names);
      const parsedMinusDuplicates = parsed.filter((person) => {
        const found = duplicates.find(
          (duplicate) =>
            duplicate.firstName === person.firstName &&
            duplicate.lastName === person.lastName
        );
        console.log("found", found);

        return !found;
      });
      console.log("parsedMinusDuplicates", parsedMinusDuplicates);
      setParsedNames(parsedMinusDuplicates);
    },
    [names]
  );

  useEffect(() => {
    const parsed = parseNames(names);
    getDuplicates(parsed);
  }, [names, getDuplicates]);

  const handleSubmit = async () => {
    if (!parsedNames || parsedNames.length === 0) {
      return;
    }

    const result = await addPeople({ people: parsedNames });
    console.log("result", result);
    // setParsedNames([]);
    // setNames("");
  };

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["firstName,middleName,lastName"]
        .concat(
          parsedNames?.map(
            (person) =>
              `${person.firstName},${person.middleName || ""},${
                person.lastName
              }`
          ) || []
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    // console.log("encodedUri", encodedUri);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "people.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
  };

  const copyDuplicates = () => {
    const text = JSON.stringify(
      duplicates.map(({ _id, firstName, middleName, lastName }) => {
        return {
          _id,
          firstName,
          middleName,
          lastName,
        };
      }),
      null,
      2
    );
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <h2>Add People</h2>
      <div className="flex gap-8 w-full min-h-[400px]">
        <div className="w-1/3">
          <textarea
            className="textarea h-full"
            value={names}
            onChange={(e) => setNames(e.target.value)}
          />
        </div>
        <div className="w-1/3 relative">
          {parsedNames && (
            <pre className="text-xs absolute top-0 left-0 w-full h-full bg-base-200 p-4 overflow-auto">
              {JSON.stringify(parsedNames, null, 2)}
            </pre>
          )}
        </div>
        <div className="w-1/3 relative">
          {duplicates?.length && (
            <pre className="text-xs absolute top-0 left-0 w-full h-full bg-base-200 p-4 overflow-auto">
              {JSON.stringify(
                duplicates.map(({ _id, firstName, middleName, lastName }) => {
                  return {
                    _id,
                    firstName,
                    middleName,
                    lastName,
                  };
                }),
                null,
                2
              )}
            </pre>
          )}
        </div>
      </div>
      {parsedNames?.length && <p>People: {parsedNames.length}</p>}
      <p>Duplicates: {duplicates.length}</p>
      {/* <button className="btn" onClick={handleSubmit} disabled={!parsedNames}>
        Submit
      </button> */}
      <button className="btn" onClick={downloadCSV} disabled={!parsedNames}>
        Download CSV
      </button>
      <button className="btn" onClick={copyDuplicates} disabled={!duplicates}>
        Copy Duplicates
      </button>
    </div>
  );
};

export default AddPeople;
