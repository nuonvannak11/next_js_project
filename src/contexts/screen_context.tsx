"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { set_lang } from "../utils/glable_function";
interface ScreenContextProps {
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
}

export const ScreenContext = createContext<ScreenContextProps>({
  isDesktop: false,
  isTablet: false,
  isMobile: false,
});

interface ScreenContextProviderProps {
  children: ReactNode;
}

// Update the ScreenContextProvider to accept `children`
export const ScreenContextProvider: React.FC<ScreenContextProviderProps> = ({
  children,
}) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedLanguage = Cookies.get("language");
    if (savedLanguage) {
      set_lang(savedLanguage);
    }
    const handleResize = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024);
      setIsTablet(width >= 500 && width < 1024);
      setIsMobile(width < 500);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isClient) return null;

  return (
    <ScreenContext.Provider value={{ isDesktop, isTablet, isMobile }}>
      {children}
    </ScreenContext.Provider>
  );
};
