"use client";

import React, { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import Cookies from "js-cookie";
import { FaGoogle, FaFacebookF, FaInstagram } from "react-icons/fa";
import CaptchaCanvas from "../../../utils/helper/capchaDraw";
import {
  cv_number,
  generate_number,
  encrypt_data,
  empty,
  ShowAlert,
  postSession,
} from "../../../utils/glable_function";
import ScreenLayout from "../../../components/layout/layout_screen";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import { LoginSubmitter } from "../../../utils/hooks/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../auth/store";
const SignInSignUpForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [capcha, setCapcha] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(generate_number(4));
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const validateInputRef = useRef(null);
  const usernameInputRefSignup = useRef(null);
  const passwordInputRefSignup = useRef(null);
  const validateInputRefSignup = useRef(null);
  const emailInputRef = useRef(null);
  const isLoggedIn = useSelector(
    (state: RootState) => state.session.isLoggedIn
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
    setCode(generate_number(4));
    setLanguageFromCookies();
  }, []);

  const setLanguageFromCookies = () => {
    const selectedLanguage = Cookies.get("language") || "en";
    if (selectedLanguage) {
      i18n.changeLanguage(selectedLanguage);
      document.documentElement.lang = selectedLanguage;
    }
  };

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
  };

  const handleInputChange = (setter: any) => (event: any) => {
    setter(event.target.value);
  };

  const handleForgot = (event: any) => {
    event.preventDefault();
    router.push("/user/forgot");
  };

  const handleSocialSignup = (platform: any) => async (event: any) => {
    event.preventDefault();
  };

  const handleSignin = async (event: any) => {
    event.preventDefault();
    if (empty(username)) {
      ShowAlert(
        "error",
        t("Please input"),
        t("Field username can't be empty!"),
        usernameInputRef,
        t
      );
      return;
    }
    if (empty(password)) {
      ShowAlert(
        "error",
        t("Please input"),
        t("Field password can't be empty!"),
        passwordInputRef,
        t
      );
      return;
    }
    if (empty(capcha)) {
      ShowAlert(
        "error",
        t("Please input"),
        t("Field validate can't be empty!"),
        validateInputRef,
        t
      );
      return;
    }
    if (cv_number(code) !== cv_number(capcha)) {
      ShowAlert(
        "error",
        t("Please input"),
        t("Validate not match"),
        validateInputRef,
        t
      );
      return;
    }

    let timerInterval: any;
    let swalTimer: any;
    let apiData: any;

    try {
      await Swal.fire({
        title: t("Please Wait"),
        html: t("Please wait a moment"),
        timerProgressBar: true,
        didOpen: async () => {
          Swal.showLoading();
          apiData = await LoginSubmitter(
            encrypt_data(username),
            encrypt_data(password)
          );
          Swal.close();
          const popup = Swal.getPopup();
          if (popup) {
            const timer = popup.querySelector("b");
            if (timer) {
              timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
              }, 100);
            }
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
          clearTimeout(swalTimer);
        },
      });

      let code_msg = Number(apiData.code);
      let message = apiData.message;
      let token = apiData.token;
      if (code_msg === 1) {
        postSession(dispatch, apiData);
        Swal.fire({
          icon: "success",
          title: t("Login Successful"),
          text: t(message),
          timer: 2000,
          timerProgressBar: true,
          footer: t("Welcome Back!"),
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            Cookies.set("token", token, { expires: 365 });
            router.push("/");
          } else if (result.isConfirmed) {
            Cookies.set("token", token, { expires: 365 });
            router.push("/");
          }
        });
      } else if (code_msg === -1) {
        ShowAlert("error", t("Please input"), t(message), usernameInputRef, t);
      } else if (code_msg === -2) {
        ShowAlert("error", t("Please input"), t(message), passwordInputRef, t);
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.close();
    }
  };

  const handleSignup = async (event: any) => {
    event.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !username ||
      !password ||
      !email ||
      !emailPattern.test(email) ||
      !capcha ||
      code !== capcha
    ) {
      Swal.fire({
        icon: "error",
        title: t("Please input"),
        text: t("Invalid input"),
      });
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        type: "register",
        username: encrypt_data(username),
        password: encrypt_data(password),
        email: encrypt_data(email),
      });

      if (!result) {
        return false;
      }
      if (result.error) {
        Swal.fire({
          icon: "error",
          title: t("Signup Error"),
          text: result.error,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: t("Registration Successful"),
          text: t("Welcome Aboard!"),
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          setIsSignUp(false);
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: t("Error"),
        text: t("An error occurred."),
      });
    }
  };
  return (
    <ScreenLayout
      page={
        <div className="login_signup_pc">
          <div className={`container ${isSignUp ? "right-panel-active" : ""}`}>
            <div className="form-container sign-up-container">
              <form onSubmit={handleSignup}>
                <h1>{t("Create Account")}</h1>
                <div className="social-container">
                  <button
                    className="social facebook"
                    onClick={handleSocialSignup("facebook")}>
                    <FaFacebookF className="fab fa-facebook-f" />
                  </button>
                  <button
                    className="social google"
                    onClick={handleSocialSignup("google")}>
                    <FaGoogle className="fab fa-google-plus-g" />
                  </button>
                  <button
                    className="social linkedin"
                    onClick={handleSocialSignup("instagram")}>
                    <FaInstagram className="fab fa-linkedin-in" />
                  </button>
                </div>
                <span>{t("or use your email for registration")}</span>
                <input
                  type="text"
                  className="from-control"
                  placeholder={t("Username")}
                  value={username}
                  onChange={handleInputChange(setUsername)}
                  ref={usernameInputRefSignup}
                />
                <input
                  type="email"
                  className="from-control"
                  placeholder={t("Email")}
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  ref={emailInputRef}
                />
                <input
                  type="password"
                  className="from-control"
                  placeholder={t("Password")}
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  ref={passwordInputRefSignup}
                />
                <div className="capcha-control">
                  <input
                    type="text"
                    className="from-control"
                    placeholder={t("Validate Code")}
                    value={capcha}
                    onChange={handleInputChange(setCapcha)}
                    ref={validateInputRefSignup}
                  />
                  <label id="capcha">
                    <CaptchaCanvas digits={cv_number(code)} />
                  </label>
                </div>
                <button className="signin-button" type="submit">
                  {t("Sign Up")}
                </button>
              </form>
            </div>
            <div className="form-container sign-in-container">
              <form onSubmit={handleSignin}>
                <h1>{t("Sign in")}</h1>
                <div className="social-container">
                  <button
                    className="social facebook"
                    onClick={handleSocialSignup("facebook")}>
                    <FaFacebookF className="fab fa-facebook-f" />
                  </button>
                  <button
                    className="social google"
                    onClick={handleSocialSignup("google")}>
                    <FaGoogle className="fab fa-google-plus-g" />
                  </button>
                  <button
                    className="social linkedin"
                    onClick={handleSocialSignup("instagram")}>
                    <FaInstagram className="fab fa-linkedin-in" />
                  </button>
                </div>
                <span>{t("or use your account")}</span>
                <input
                  type="text"
                  className="from-control"
                  placeholder={t("Username")}
                  value={username}
                  onChange={handleInputChange(setUsername)}
                  ref={usernameInputRef}
                />
                <input
                  type="password"
                  className="from-control"
                  placeholder={t("Password")}
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  ref={passwordInputRef}
                />
                <div className="capcha-control">
                  <input
                    type="text"
                    className="from-control"
                    placeholder={t("Validate Code")}
                    value={capcha}
                    onChange={handleInputChange(setCapcha)}
                    ref={validateInputRef}
                  />
                  <label id="capcha">
                    <CaptchaCanvas digits={cv_number(code)} />
                  </label>
                </div>
                <button className="forgot" onClick={handleForgot}>
                  {t("Forgot your password?")}
                </button>
                <button className="signin-button" type="submit">
                  {t("Sign In")}
                </button>
              </form>
            </div>
            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel overlay-left">
                  <h1>{t("Welcome Back!")}</h1>
                  <p>
                    {t(
                      "To keep connected with us please login with your personal info"
                    )}
                  </p>
                  <button
                    className="signin-button ghost"
                    onClick={handleSignInClick}>
                    {t("Sign In")}
                  </button>
                </div>
                <div className="overlay-panel overlay-right">
                  <h1>{t("Hello, Friend!")}</h1>
                  <p>
                    {t("Enter your personal details and start journey with us")}
                  </p>
                  <button
                    className="signin-button ghost"
                    onClick={handleSignUpClick}>
                    {t("Sign Up")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default SignInSignUpForm;
