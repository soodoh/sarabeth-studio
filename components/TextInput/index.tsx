import React from "react";
import styles from "./TextInput.module.scss";

type Props = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
};

const TextInput = ({ label, value, placeholder = "", onChange }: Props) => {
  return (
    <div className={styles.container}>
      <input
        onChange={onChange}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      <label>{label}</label>
    </div>
  );
};

export default TextInput;
