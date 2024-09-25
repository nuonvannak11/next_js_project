"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useProductData, useBannerData } from "../utils/hooks/api";
import { useMediaQuery } from "react-responsive";
import Cookies from "js-cookie";
import { useTranslation } from "next-i18next";

// Contexts
export const MainContext = createContext({});
export const ProductContext = createContext({});
export const ProductBannerContext = createContext({});
export const MediaQueryContext = createContext<{
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
}>({
  isDesktop: false,
  isTablet: false,
  isMobile: false,
});
export const LanguageContext = createContext({});

type MainContextProviderProps = {
  children: ReactNode;
};

const MainContextProviderComponent = ({
  children,
}: MainContextProviderProps) => {
  const { t } = useTranslation();
  const productData = useProductData();
  const { banners } = useBannerData();
  const [language, setLanguage] = useState<string>(
    Cookies.get("language") || "en"
  );
  const [page, setPage] = useState<string>(Cookies.get("page") || "Home");
  const [bannerData, setBannerData] = useState([]);

  // Media queries
  const isClient = typeof window !== "undefined";
  const isDesktop = isClient ? useMediaQuery({ minWidth: 1200 }) : false;
  const isTablet = isClient
    ? useMediaQuery({ minWidth: 600, maxWidth: 1199 })
    : false;
  const isMobile = isClient ? useMediaQuery({ maxWidth: 599 }) : false;

  // Effect to handle banner data changes
  useEffect(() => {
    const filteredData = banners.filter(
      (banner: any) => banner.language === language
    );
    if (page === "Home") {
      setBannerData(filteredData);
    } else {
      setBannerData(filteredData.filter((data: any) => data.category === page));
    }
  }, [banners, language, page]);

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent<{ language: string }>) => {
      setLanguage(event.detail.language);
    };
    const handlePageChange = (event: CustomEvent<{ pages: string }>) => {
      setPage(event.detail.pages);
    };

    if (isClient) {
      window.addEventListener("pageChange", handlePageChange as EventListener);
      window.addEventListener(
        "languageChange",
        handleLanguageChange as EventListener
      );
    }

    return () => {
      if (isClient) {
        window.removeEventListener(
          "languageChange",
          handleLanguageChange as EventListener
        );
        window.removeEventListener(
          "pageChange",
          handlePageChange as EventListener
        );
      }
    };
  }, [isClient]);

  return (
    <MainContext.Provider
      value={{
        productData,
        language,
        bannerData,
        isDesktop,
        isTablet,
        isMobile,
        t,
      }}>
      <ProductContext.Provider value={productData}>
        <ProductBannerContext.Provider value={{ bannerData }}>
          <MediaQueryContext.Provider value={{ isDesktop, isTablet, isMobile }}>
            <LanguageContext.Provider value={{ language }}>
              {children}
            </LanguageContext.Provider>
          </MediaQueryContext.Provider>
        </ProductBannerContext.Provider>
      </ProductContext.Provider>
    </MainContext.Provider>
  );
};

export default MainContextProviderComponent;
