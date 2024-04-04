import { FormikErrors, FormikTouched } from "formik";
import React from "react";

function Input<T>({
  id,
  placeholder,
  value,
  type,
  errors,
  touched,
  handleChange,
}: {
  id: keyof T;
  errors?: FormikErrors<T>;
  placeholder: string;
  touched: FormikTouched<T>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | number;
  type: React.HTMLInputTypeAttribute;
}) {
  return (
    <>
      <label htmlFor={id as string} className="hidden">
        {id as string}
      </label>
      <input
        name={id as string}
        type={type}
        placeholder={placeholder}
        id={id as string}
        value={value}
        onChange={handleChange}
        className="placeholder:text-primary-gray w-full mt-4 px-6 p-4 rounded-2xl outline-none shadow-md"
      />
      {errors![id] && touched[id] ? (
        <p className="text-red-700 font-semibold text-sm text-left mt-2 ml-2">
          {errors![id] as string}
        </p>
      ) : null}
    </>
  );
}

export default Input;
