"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import classnames from "classnames";
import { getPeople, addPeople, addCredits } from "@/app/actions/people";
import type { Show } from "@/app/types";
import PersonCard, { type ParsedPerson } from "./PersonCard";

interface AddPeopleFormProps {
  shows: Show[];
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

let nextId = 0;
const uid = () => String(++nextId);

const parseNamesFromText = (text: string): ParsedPerson[] => {
  return text
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\s+/);
      const firstName = parts[0] ?? "";
      const lastName = parts.length > 1 ? parts[parts.length - 1] : "";
      const middleName = parts.length > 2 ? parts.slice(1, -1).join(" ") : "";
      return {
        id: uid(),
        firstName,
        middleName,
        lastName,
        isDuplicate: false,
        isIncluded: true,
      };
    });
};

const AddPeopleForm = ({ shows }: AddPeopleFormProps) => {
  const [rawText, setRawText] = useState("");
  const [people, setPeople] = useState<ParsedPerson[]>([]);
  const [showId, setShowId] = useState("");
  const [category, setCategory] = useState<"cast" | "crew">("cast");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkDuplicates = useCallback(async (parsed: ParsedPerson[]) => {
    if (parsed.length === 0) return parsed;
    setIsCheckingDuplicates(true);
    try {
      const found = await getPeople({
        people: parsed.map(({ firstName, middleName, lastName }) => ({
          firstName,
          middleName: middleName || undefined,
          lastName,
        })),
      });

      return parsed.map((person) => {
        const match = found.find(
          (d) =>
            d.firstName === person.firstName &&
            d.lastName === person.lastName &&
            (d.middleName || "") === person.middleName
        );
        // Preserve isIncluded so user checkbox choices survive a re-check
        return {
          ...person,
          isDuplicate: !!match,
          duplicateId: match?._id as string | undefined,
        };
      });
    } finally {
      setIsCheckingDuplicates(false);
    }
  }, []);

  useEffect(() => {
    const parsed = parseNamesFromText(rawText);
    if (parsed.length === 0) {
      setPeople([]);
      return;
    }
    // Show cards immediately, then debounce the duplicate check
    setPeople(parsed);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      const withDupes = await checkDuplicates(parsed);
      setPeople(withDupes);
    }, 600);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [rawText, checkDuplicates]);

  const handlePersonChange = (index: number, updated: ParsedPerson) => {
    setPeople((prev) => {
      const next = prev.map((p, i) => (i === index ? updated : p));

      // Re-check for duplicates after a name edit, in case the corrected
      // name now matches (or no longer matches) someone in the CMS
      if (editDebounceTimer.current) clearTimeout(editDebounceTimer.current);
      editDebounceTimer.current = setTimeout(async () => {
        const withDupes = await checkDuplicates(next);
        setPeople(withDupes);
      }, 800);

      return next;
    });
  };

  const handleRemove = (index: number) => {
    setPeople((prev) => prev.filter((_, i) => i !== index));
  };

  const includedPeople = people.filter((p) => p.isIncluded);
  const newPeople = includedPeople.filter((p) => !p.isDuplicate);
  const duplicatePeople = includedPeople.filter((p) => p.isDuplicate);

  const selectedShow = shows.find((s) => s._id === showId);
  const canSubmit =
    includedPeople.length > 0 && showId !== "" && submitStatus !== "loading";

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitStatus("loading");
    setSubmitMessage("");

    try {
      const newPersonRecords = newPeople.map(
        ({ firstName, middleName, lastName }) => ({
          firstName,
          middleName: middleName || undefined,
          lastName,
        })
      );

      let insertedIds: string[] = [];
      if (newPersonRecords.length > 0) {
        const inserted = await addPeople({ people: newPersonRecords });
        insertedIds = inserted.map((item) => item._id).filter(Boolean) as string[];
      }

      const existingIds = duplicatePeople
        .map((p) => p.duplicateId)
        .filter(Boolean) as string[];

      const allPersonIds = [...insertedIds, ...existingIds];
      if (allPersonIds.length > 0) {
        await addCredits({
          credits: allPersonIds.map((personId) => ({
            person: personId,
            show: showId,
            category,
          })),
        });
      }

      const newCount = newPersonRecords.length;
      const dupeCount = existingIds.length;
      const parts: string[] = [];
      if (newCount > 0)
        parts.push(
          `${newCount} new ${newCount === 1 ? "person" : "people"} added`
        );
      if (dupeCount > 0) parts.push(`${dupeCount} already in CMS credited`);
      setSubmitMessage(parts.join(" · "));
      setSubmitStatus("success");
      setRawText("");
      setPeople([]);
    } catch (err) {
      console.error(err);
      setSubmitMessage(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
      setSubmitStatus("error");
    }
  };

  const submitLabel = (() => {
    if (submitStatus === "loading") return "Saving…";
    if (!canSubmit) return "Add People";
    const parts: string[] = [];
    if (newPeople.length > 0)
      parts.push(
        `${newPeople.length} new ${newPeople.length === 1 ? "person" : "people"}`
      );
    if (duplicatePeople.length > 0)
      parts.push(`credit ${duplicatePeople.length} in CMS`);
    const showName = selectedShow ? ` to ${selectedShow.title}` : "";
    return `Add ${parts.join(" + ")}${showName} as ${category}`;
  })();

  return (
    <div className="flex flex-col gap-8">
      {/* Step 1: Paste names */}
      <section>
        <h2 className="text-lg font-semibold mb-1">Paste Names</h2>
        <p className="text-sm text-base-content/60 mb-3">
          One name per line from Google Sheets. Format:{" "}
          <code className="bg-base-200 px-1 rounded">First [Middle] Last</code>
        </p>
        <textarea
          className="textarea textarea-bordered w-full h-48 font-mono text-sm"
          placeholder={"John Smith\nMary Jane Watson\nSullivan den Bergh"}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
        />
      </section>

      {/* Step 2: Review parsed names */}
      {people.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-lg font-semibold">Review &amp; Edit</h2>
            <div className="flex gap-2 items-center">
              {newPeople.length > 0 && (
                <span className="badge badge-neutral">{newPeople.length} new</span>
              )}
              {duplicatePeople.length > 0 && (
                <span className="badge badge-warning">
                  {duplicatePeople.length} already in CMS
                </span>
              )}
              {isCheckingDuplicates && (
                <span className="loading loading-spinner loading-xs text-base-content/40" />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {people.map((person, index) => (
              <PersonCard
                key={person.id}
                person={person}
                onChange={(updated) => handlePersonChange(index, updated)}
                onRemove={() => handleRemove(index)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Step 3: Show + Category + Submit */}
      {people.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">
            Select Show &amp; Category
          </h2>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="show-select">
                Show
              </label>
              <select
                id="show-select"
                className="select select-bordered"
                value={showId}
                onChange={(e) => setShowId(e.target.value)}
              >
                <option value="">— Select a show —</option>
                {shows.map((show) => (
                  <option key={show._id} value={show._id}>
                    {show.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="category-select">
                Category
              </label>
              <select
                id="category-select"
                className="select select-bordered"
                value={category}
                onChange={(e) => setCategory(e.target.value as "cast" | "crew")}
              >
                <option value="cast">Cast</option>
                <option value="crew">Crew</option>
              </select>
            </div>

            <button
              type="button"
              className={classnames("btn btn-primary", {
                "btn-disabled": !canSubmit,
              })}
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {submitLabel}
            </button>
          </div>
        </section>
      )}

      {/* Feedback */}
      {submitStatus === "success" && (
        <div className="alert alert-success">
          <span>✓ {submitMessage}</span>
          <button
            className="btn btn-sm btn-ghost ml-auto"
            onClick={() => setSubmitStatus("idle")}
          >
            Dismiss
          </button>
        </div>
      )}
      {submitStatus === "error" && (
        <div className="alert alert-error">
          <span>✗ {submitMessage}</span>
          <button
            className="btn btn-sm btn-ghost ml-auto"
            onClick={() => setSubmitStatus("idle")}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default AddPeopleForm;
