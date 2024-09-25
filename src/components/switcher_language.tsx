"use client";

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "../styles/flage.css";
import { set_lang } from "../utils/glable_function";

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const savedLanguage = Cookies.get("language");
    if (savedLanguage) {
      changeLanguage(savedLanguage, false);
    }
    return () => {};
  }, [i18n]);

  const changeLanguage = (lng: string, showAlert = true) => {
    if (lng !== i18n.language) {
      i18n.changeLanguage(lng);
      Cookies.set("language", lng, { expires: 365 });
      if (showAlert) {
        Swal.fire({
          title: t("Language changed"),
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          Swal.close();
          set_lang(lng);
        });
      } else {
        Swal.close();
        set_lang(lng);
      }
    } else {
      Swal.close();
    }
  };

  return (
    <div className="mainFlag">
      <LanguageOutlinedIcon
        className="langague"
        onClick={() => {
          Swal.fire({
            title: t("Select Language"),
            html: `
              <div class="flagOptions">
                <a class="flagButton en">
                  <img src='/assets/flage/en.png' alt='en' />
                  ${t("English")}
                </a><span style="margin:10px;"></span>
                <a class="flagButton kh">
                  <img src='/assets/flage/kh.png' alt='kh' />
                  ${t("Khmer")}
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
              document
                .querySelector(".flagButton.en")
                ?.addEventListener("click", () => changeLanguage("en"));
              document
                .querySelector(".flagButton.kh")
                ?.addEventListener("click", () => changeLanguage("kh"));
            },
          });
        }}
      />
    </div>
  );
};

export default LanguageSwitcher;
