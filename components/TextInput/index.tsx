import React from "react";
import styles from "./TextInput.module.scss";

type Props = {
  label: string;
  value: string;
  placeholder?: string;
  errorMessage?: string;
  hasError?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const TextInput = ({
  errorMessage,
  label,
  value,
  placeholder = "",
  hasError = false,
  onChange,
}: Props) => {
  const id = label.replace(/\W+/g, "");
  return (
    <div className={`${styles.container} ${hasError ? styles.showError : ""}`}>
      <input
        name={id}
        id={id}
        onChange={onChange}
        placeholder={placeholder}
        type="text"
        value={value}
        aria-invalid="true"
        aria-required="true"
        aria-describedby={`${id}-error`}
        required
      />
      <label htmlFor={id}>{label}</label>
      {hasError && (
        <p role="alert" id={`${id}-error`} className={styles.errorMessage}>
          {errorMessage || `"${label}" is a required field`}
        </p>
      )}
    </div>
  );
};

export default TextInput;
