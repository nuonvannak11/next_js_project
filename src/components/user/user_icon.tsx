"use client";

import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useTranslation } from "react-i18next";

const Log = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const changeLog = (action: string) => {
    Swal.close();
    if (action === "login") {
      router.push(`/user/login`);
    } else if (action === "signup") {
      router.push(`/user/register`);
    }
  };

  const showLoginSignupModal = () => {
    Swal.fire({
      title: t("Login or Signup"),
      html: `
        <div class="flagOptions">
          <a class="flagButton" id="loginButton">
            <img src='/assets/icon/login.png' alt='login' />
            ${t("Login")}
          </a>
          <span style="margin:10px;"></span>
          <a class="flagButton" id="signupButton">
            <img src='/assets/icon/signup.png' alt='signup' />
            ${t("Signup")}
          </a>
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      focusConfirm: false,
      allowOutsideClick: false,
    });
    const loginButton = document.getElementById("loginButton");
    const signupButton = document.getElementById("signupButton");

    if (loginButton) {
      loginButton.addEventListener("click", () => changeLog("login"));
    }

    if (signupButton) {
      signupButton.addEventListener("click", () => changeLog("signup"));
    }
  };

  return (
    <div className="mainFlag">
      <AccountCircleOutlinedIcon
        className="langague"
        onClick={showLoginSignupModal}
      />
    </div>
  );
};

export default Log;
