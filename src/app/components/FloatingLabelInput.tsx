"use client";

import React from "react";
import classnames from "classnames";
import { InputMask } from "@react-input/mask";

/**
 * FloatingLabelInput component
 *
 * A reusable input (and textarea) component that uses its label as a
 * placeholder until the user focuses on the input or types something, at which
 * point the text moves up to its normal position above.
 */

interface Props {
  label: string;
  type?: string;
  id: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
  pattern?: string;
  rows?: number;
  mask?: string;
  replacement?: {
    [key: string]: RegExp;
  };
}

const FloatingLabelInput: React.FC<Props> = ({
  id,
  label,
  type = "text",
  className = "",
  required = false,
  placeholder = " ",
  pattern,
  rows = 4,
  mask,
  replacement,
}) => {
  return (
    <div className={classnames(className)}>
      <label
        htmlFor={id}
        className={classnames([
          "block",
          "font-medium",
          "translate-y-[2rem]",
          "ml-2",
          "opacity-50",
          "cursor-text",
          "transition-all",
          "has-[+*:focus]:translate-y-0",
          "has-[+*:not(:placeholder-shown)]:translate-y-0",
          "has-[+*:focus]:opacity-100",
          "has-[+*:not(:placeholder-shown)]:opacity-100",
        ])}
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          className={classnames([
            "peer",
            "w-full",
            "p-2",
            "border",
            "border-gray-300",
            "rounded",
            "font-medium",
          ])}
          id={id}
          name={id}
          required={required}
          placeholder={placeholder}
          rows={rows}
        />
      ) : mask ? (
        <InputMask
          mask={mask}
          replacement={replacement}
          className={classnames([
            "peer",
            "w-full",
            "p-2",
            "border",
            "border-gray-300",
            "rounded",
            "font-medium",
          ])}
          id={id}
          name={id}
          required={required}
          placeholder={placeholder}
          pattern={pattern}
        />
      ) : (
        <input
          className={classnames([
            "peer",
            "w-full",
            "p-2",
            "border",
            "border-gray-300",
            "rounded",
            "font-medium",
          ])}
          type={type}
          id={id}
          name={id}
          required={required}
          placeholder={placeholder}
          pattern={pattern}
        />
      )}
    </div>
  );
};

export default FloatingLabelInput;
