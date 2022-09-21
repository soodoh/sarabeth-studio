import React from "react";
import styles from "./TextInput.module.scss";

type Props = {
  label: string;
  value: string;
  errorMessage?: string;
  showError?: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  type?: "text" | "textarea";
  disabled?: boolean;
};

const TextInput = ({
  errorMessage,
  label,
  value,
  onChange,
  showError = false,
  type = "text",
  disabled = false,
}: Props) => {
  const id = label.replace(/\W+/g, "");
  return (
    <div className={`${styles.container} ${showError ? styles.showError : ""}`}>
      {type === "text" ? (
        <input
          className={styles.input}
          name={id}
          id={id}
          disabled={disabled}
          onChange={onChange}
          placeholder=" "
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
          disabled={disabled}
          onChange={onChange}
          placeholder=" "
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
          {showError ? errorMessage || `"${label}" is a required field` : ""}
        </p>
      }
    </div>
  );
};

export default TextInput;
