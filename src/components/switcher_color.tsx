"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import Swal from "sweetalert2";
import "../styles/flage.css";
import Cookies from "js-cookie";
import { ColorSubmitter } from "../utils/hooks/api";
import { getLocalIP } from "../utils/glable_function";
import { useSelector } from "react-redux";
import { RootState } from "../auth/store";

const ColorSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const isLoggedIn = useSelector(
    (state: RootState) => state.session.isLoggedIn
  );

  const [colorTheme, setColorTheme] = useState<string | undefined>(
    Cookies.get("color_theme")
  );
  const isMounted = useRef(false);
  const Token = Cookies.get("token") || "";

  useEffect(() => {
    const applyColorTheme = async () => {
      if (!isLoggedIn || !Token) {
        return;
      }
      if (colorTheme) {
        document.body.className = "";
        document.body.classList.add(`${colorTheme}`);
      }
    };

    if (!isMounted.current) {
      applyColorTheme();
      isMounted.current = true;
    }

    const handleCookieChange = () => {
      const newColorTheme = Cookies.get("color_theme");
      if (newColorTheme !== colorTheme) {
        setColorTheme(newColorTheme);
      }
    };

    window.addEventListener("cookieChange", handleCookieChange);

    return () => {
      window.removeEventListener("cookieChange", handleCookieChange);
    };
  }, [isLoggedIn, colorTheme, Token]);

  const changeColor = async (color_body: string) => {
    if (colorTheme !== color_body) {
      let timerInterval: NodeJS.Timeout | undefined;
      let swalTimer: NodeJS.Timeout | undefined;
      let apiData: any;
      let ip_loacal = (await getLocalIP()) || "";

      try {
        await Swal.fire({
          title: t("Please Wait"),
          html: t("Please wait a moment"),
          timerProgressBar: true,
          didOpen: async () => {
            Swal.showLoading();
            apiData = await ColorSubmitter(color_body, Token, ip_loacal);
            swalTimer = setTimeout(() => {
              Swal.close();
            }, 1500);

            const timer = Swal.getPopup()?.querySelector("b");
            if (timer) {
              timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
              }, 100);
            }
          },
          willClose: () => {
            clearInterval(timerInterval);
            clearTimeout(swalTimer);
          },
        });

        if (apiData) {
          const { code, data, message } = apiData;
          if (code === 1) {
            Swal.fire({
              icon: "success",
              title: t("Change Theme Successful!"),
              text: t(message),
              timer: 2000,
              timerProgressBar: true,
              footer: t("Welcome Aboard!"),
            }).then((result) => {
              if (
                result.dismiss === Swal.DismissReason.timer ||
                result.isConfirmed
              ) {
                document.body.className = "";
                document.body.classList.add(`${color_body}`);
                Cookies.set("color_theme", data, { expires: 365 });
                setColorTheme(data);
                const event = new Event("cookieChange");
                window.dispatchEvent(event);
              }
            });
          } else {
            Swal.fire({
              icon: "error",
              text: t(message),
              timer: 2000,
              footer: t("Please Try Again!"),
            });
          }
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.close();
      }
    } else {
      Swal.close();
    }
  };

  const handleThemeChange = async () => {
    Swal.fire({
      title: t("Select Theme"),
      html: `
        <div class="flagOptions">
          <a class="flagButton dark-mode-btn">
            <img src='/assets/icon/dark-mode.png' alt='dark-mode' />
            ${t("Dark Mode")}
          </a><span style="margin:10px;"></span>
          <a class="flagButton light-mode-btn">
            <img src='/assets/icon/light-mode.png' alt='light-mode' />
            ${t("Light Mode")}
          </a>
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      focusConfirm: false,
      allowOutsideClick: false,
      customClass: {
        container: "language-alert-container",
        closeButton: "language-alert-close-button",
        title: "language-alert-title",
      },
      didOpen: () => {
        document.querySelector(".dark-mode-btn")?.addEventListener("click", () => changeColor("DarkMode"));
        document.querySelector(".light-mode-btn")?.addEventListener("click", () => changeColor("LightMode"));
      },
    });
  };

  return (
    <div className="mainFlag">
      <DarkModeIcon className="langague" onClick={handleThemeChange} />
    </div>
  );
};

export default ColorSwitcher;
