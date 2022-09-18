import React from "react";
import styles from "./TextInput.module.scss";

type Props = {
  label: string;
  value: string;
  placeholder?: string;
  errorMessage?: string;
  hasError?: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  type?: "text" | "textarea";
};

const TextInput = ({
  errorMessage,
  label,
  value,
  placeholder = "",
  hasError = false,
  onChange,
  type = "text",
}: Props) => {
  const id = label.replace(/\W+/g, "");
  return (
    <div className={`${styles.container} ${hasError ? styles.showError : ""}`}>
      {type === "text" ? (
        <input
          className={styles.input}
          name={id}
          id={id}
          onChange={onChange}
          placeholder={placeholder || label}
          type="text"
          value={value}
          aria-invalid="true"
          aria-required="true"
          aria-describedby={`${id}-error`}
          required
        />
      ) : (
        <textarea
          className={styles.input}
          name={id}
          id={id}
          onChange={onChange}
          placeholder={placeholder || label}
          value={value}
          aria-invalid="true"
          aria-required="true"
          aria-describedby={`${id}-error`}
          rows={10}
          required
        />
      )}
      <label htmlFor={id}>{label}</label>
      {
        <p role="alert" id={`${id}-error`} className={styles.errorMessage}>
          {hasError ? errorMessage || `"${label}" is a required field` : ""}
        </p>
      }
    </div>
  );
};

export default TextInput;
