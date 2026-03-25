"use client";
import React from "react";
import classnames from "classnames";

export interface ParsedPerson {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  isDuplicate: boolean;
  duplicateId?: string;
  isIncluded: boolean;
}

interface PersonCardProps {
  person: ParsedPerson;
  onChange: (updated: ParsedPerson) => void;
  onRemove: () => void;
}

const PersonCard = ({ person, onChange, onRemove }: PersonCardProps) => {
  const handleField = (field: keyof ParsedPerson, value: string) => {
    onChange({ ...person, [field]: value });
  };

  const handleToggle = () => {
    onChange({ ...person, isIncluded: !person.isIncluded });
  };

  return (
    <div
      className={classnames(
        "flex items-center gap-2 rounded-lg border px-3 py-2 transition-opacity",
        {
          "bg-base-100 border-base-300": !person.isDuplicate,
          "bg-warning/10 border-warning/40": person.isDuplicate,
          "opacity-40": !person.isIncluded,
        }
      )}
    >
      <input
        type="checkbox"
        className="checkbox checkbox-sm shrink-0"
        checked={person.isIncluded}
        onChange={handleToggle}
        title={
          person.isDuplicate
            ? "Uncheck to exclude from this batch"
            : "Uncheck to remove from batch"
        }
      />

      <div className="flex gap-2 flex-1 min-w-0">
        <input
          type="text"
          className="input input-sm input-bordered w-28 min-w-0"
          placeholder="First"
          value={person.firstName}
          onChange={(e) => handleField("firstName", e.target.value)}
          disabled={!person.isIncluded}
        />
        <input
          type="text"
          className="input input-sm input-bordered w-24 min-w-0"
          placeholder="Middle"
          value={person.middleName}
          onChange={(e) => handleField("middleName", e.target.value)}
          disabled={!person.isIncluded}
        />
        <input
          type="text"
          className="input input-sm input-bordered flex-1 min-w-0"
          placeholder="Last"
          value={person.lastName}
          onChange={(e) => handleField("lastName", e.target.value)}
          disabled={!person.isIncluded}
        />
      </div>

      {person.isDuplicate && (
        <span className="badge badge-warning badge-sm shrink-0 whitespace-nowrap">
          Already in CMS
        </span>
      )}

      <button
        type="button"
        className="btn btn-ghost btn-xs btn-circle shrink-0"
        onClick={onRemove}
        title="Remove from list"
      >
        ✕
      </button>
    </div>
  );
};

export default PersonCard;
