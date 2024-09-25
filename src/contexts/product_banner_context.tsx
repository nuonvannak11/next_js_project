"use client";

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from "react";
import { useBannerData } from "../utils/hooks/api";
import Cookies from "js-cookie";

interface Banner {
  language: string;
  category: string;
}

interface ProductBannerContextType {
  bannerData: Banner[];
}

export const ProductBannerContext = createContext<ProductBannerContextType>({
  bannerData: [],
});

type ProductProps = {
  children: ReactNode;
};

export const ProductBannerContextProvider: FC<ProductProps> = ({
  children,
}) => {
  const { banners } = useBannerData();
  const [language, setLanguage] = useState<string>(
    Cookies.get("language") || "en"
  );
  const [page, setPage] = useState<string>(Cookies.get("page") || "Home");
  const [bannerData, setBannerData] = useState<Banner[]>([]);

  useEffect(() => {
    const filteredData = banners.filter(
      (banner: Banner) => banner.language === language
    );
    if (page === "Home") {
      setBannerData(filteredData);
    } else {
      setBannerData(
        filteredData.filter((data: Banner) => data.category === page)
      );
    }
  }, [banners, language, page]);

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent<{ language: string }>) => {
      setLanguage(event.detail.language);
    };
    const handlePageChange = (event: CustomEvent<{ page: string }>) => {
      setPage(event.detail.page);
    };

    window.addEventListener("pageChange", handlePageChange as EventListener);
    window.addEventListener(
      "languageChange",
      handleLanguageChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "languageChange",
        handleLanguageChange as EventListener
      );
      window.removeEventListener(
        "pageChange",
        handlePageChange as EventListener
      );
    };
  }, []);

  return (
    <ProductBannerContext.Provider value={{ bannerData }}>
      {children}
    </ProductBannerContext.Provider>
  );
};
