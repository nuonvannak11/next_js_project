"use client";

import { ScreenContext } from "../contexts/screen_context";
import { useContext } from "react";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import { setUser } from "../auth/action";

export function class_screen(type: any = "") {
  const { isDesktop, isTablet, isMobile } = useContext(ScreenContext);
  let class_screen;
  if (isDesktop) {
    class_screen = "desktop";
  } else if (isTablet) {
    class_screen = "tablet";
  } else if (isMobile) {
    class_screen = "mobile";
  }
  if (type == "name_only") {
    return class_screen;
  } else {
    return class_screen + "_screen";
  }
}

export function check_screen(screen: string) {
  const data_screen = class_screen("name_only");
  if (data_screen != screen) {
    return false;
  } else {
    return true;
  }
}

export async function getLocalIP(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.createDataChannel("");
    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch((error) => reject(error));

    pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event && event.candidate && event.candidate.candidate) {
        const candidate = event.candidate.candidate;
        const ipMatch = candidate.match(/([0-9]{1,3}\.){3}[0-9]{1,3}/);
        if (ipMatch) {
          resolve(ipMatch[0]);
          pc.onicecandidate = null;
        }
      }
    };

    pc.onicecandidateerror = (event: Event) => {
      reject(event);
    };
  });
}

export function lower_text(text: any) {
  if (typeof text === "number") {
    text = text.toString();
  }
  return text.toLowerCase();
}

export function cv_str(data: any) {
  if (typeof data === "number") {
    return JSON.stringify(data);
  } else {
    return data;
  }
}

export function encrypt_data(data: any) {
  const SECRET_KEY = "1245763dhewdgvkjh@$%$(+:/^&*!@'-_";
  const KEY_SCRIPT = "345gvkjh@$%$(+:/^&*!@'hjtesz";
  const IV_SCRIPT = "35g@$%$(+:/^&*!@'hjt64sz";

  const combinedKey = CryptoJS.SHA256(SECRET_KEY + KEY_SCRIPT)
    .toString(CryptoJS.enc.Hex)
    .slice(0, 52);

  const cipher = CryptoJS.AES.encrypt(
    cv_str(data),
    CryptoJS.enc.Utf8.parse(combinedKey),
    {
      iv: CryptoJS.enc.Utf8.parse(IV_SCRIPT),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return cipher.toString();
}

export function decrypt_data(data: any) {
  const SECRET_KEY = "1245763dhewdgvkjh@$%$(+:/^&*!@'-_";
  const KEY_SCRIPT = "345gvkjh@$%$(+:/^&*!@'hjtesz";
  const IV_SCRIPT = "35g@$%$(+:/^&*!@'hjt64sz";

  const combinedKey = CryptoJS.SHA256(SECRET_KEY + KEY_SCRIPT)
    .toString(CryptoJS.enc.Hex)
    .slice(0, 52);

  const bytes = CryptoJS.AES.decrypt(
    cv_str(data),
    CryptoJS.enc.Utf8.parse(combinedKey),
    {
      iv: CryptoJS.enc.Utf8.parse(IV_SCRIPT),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
}

export function generate_number(digit: any) {
  return Array.from({ length: digit }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
}

export function cv_number(data: any) {
  if (typeof data == "string") {
    data = Number(data);
  }
  return data;
}

export const ShowAlert = (
  icon: any,
  title: any,
  text: any,
  focusRef: any,
  t: any,
  footer = ""
) => {
  const footerText = footer !== "" ? footer : t("Please input again!");
  Swal.fire({
    icon,
    title,
    text,
    footer: footerText,
  }).then(() => {
    setTimeout(() => {
      if (focusRef && focusRef.current) {
        focusRef.current.focus();
      }
    }, 500);
  });
};

export function empty(data: any): boolean {
  if (data === null || data === undefined) {
    return true;
  }
  if (typeof data === "string" || Array.isArray(data)) {
    return data.length === 0;
  }
  if (typeof data === "object") {
    return Object.keys(data).length === 0;
  }
  if (typeof data === "number" || typeof data === "boolean") {
    return !data;
  }
  return false;
}

interface DecryptMoreData {
  [key: string]: string | number | undefined;
}

export function convertEncryptData(data: any): DecryptMoreData {
  const sensitiveFields = [
    "id",
    "name",
    "password",
    "tel",
    "email",
    "address",
    "telegram",
    "bankacc",
    "bankno",
    "salary",
    "contact_us",
  ];

  const decryptedData: DecryptMoreData = {};

  for (const key of Object.keys(data)) {
    const value = data[key];
    if (sensitiveFields.includes(key)) {
      decryptedData[key] = decrypt_data(String(value));
    } else if (empty(value)) {
      decryptedData[key] = "---";
    } else {
      decryptedData[key] = value;
    }
  }
  return decryptedData;
}

export function postSession(dispatch: any, data: any) {
  dispatch(setUser(convertEncryptData(data.datauser)));
}

export function set_lang(lang: string) {
  if (lang === "kh") {
    document.documentElement.style.fontFamily = "'Battambang'";
  } else if (lang === "en") {
    document.documentElement.style.fontFamily = "'Roboto', sans-serif";
  }
  document.querySelectorAll("input").forEach((input) => {
    (input as HTMLInputElement).style.fontFamily =
      document.documentElement.style.fontFamily;
  });
  document.querySelectorAll("button").forEach((button) => {
    (button as HTMLButtonElement).style.fontFamily =
      document.documentElement.style.fontFamily;
  });
  document.documentElement.lang = lang;
  const event = new CustomEvent("languageChange", {
    detail: { language: lang },
  });
  window.dispatchEvent(event);
}
