import { Metadata } from "next";
import { ScreenContextProvider } from "../contexts/screen_context";
import { ProductContextProvider } from "../contexts/product_context";
import { SearchProvider } from "../contexts/product_search_context";
import { ProductBannerContextProvider } from "../contexts/product_banner_context";
import ReduxProvider from "../contexts/auth_context";
import QureyProviders from "../contexts/react_qurey";
import "../styles/desktop/screen_desktop.css";
import "../styles/desktop/sreen_destop_darkmode.css";
import "../config/i18n";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Shop Online",
  description: "Your page description here",
  keywords: "shop, online, e-commerce",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Battambang"
          rel="stylesheet"
        />
      </Head>
      <body className="DarkMode">
        <QureyProviders>
          <ScreenContextProvider>
            <ProductBannerContextProvider>
              <ProductContextProvider>
                <ReduxProvider>
                  <SearchProvider>{children}</SearchProvider>
                </ReduxProvider>
              </ProductContextProvider>
            </ProductBannerContextProvider>
          </ScreenContextProvider>
        </QureyProviders>
      </body>
    </html>
  );
}
