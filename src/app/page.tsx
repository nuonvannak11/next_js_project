"use client";

import React, { useContext } from "react";
import { ProductContext } from "../contexts/product_context";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import ProductBanner from "../components/product/product_banner";
import MainLayout from "../components/layout/layout_main";
import { useSearch } from "../contexts/product_search_context";
import { lower_text, check_screen, link_img } from "../utils/glable_function";
import { AddChardViews } from "../components/product/product_view_detail";
const Home: React.FC = () => {
  const { product, error } = useContext(ProductContext);
  const { t } = useTranslation();
  const { searchTerm } = useSearch();

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredProducts = searchTerm
    ? product.filter((productItem) => {
        if (!productItem.product_name) return false;
        return lower_text(productItem.product_name).includes(
          lower_text(searchTerm)
        );
      })
    : product;

  return (
    <MainLayout
      page={
        <div id="shop">
          <div className="banner-item">
            <ProductBanner page={"home_page"} />
          </div>
          {check_screen("desktop") && (
            <div className="items">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((productItem) => (
                  <div className="single-item" key={productItem.id}>
                    <div className="left-set">
                      <Image
                        className="coverimag"
                        src={link_img(productItem.product_image)}
                        alt={link_img(productItem.product_image)}
                        width={500}
                        height={500}
                        priority
                      />
                    </div>
                    <div className="right-set">
                      <div className="name">{productItem.product_name}</div>
                      <div className="price">{productItem.product_price}$</div>
                      <div className="description">
                        <p>
                          {t("Create")}: {productItem.product_create}
                        </p>
                        <p>
                          {t("From")}: {productItem.product_from}
                        </p>
                        <p>
                          {t("Warranty")}: {productItem.warranty} {t("year")}
                        </p>
                        <p>
                          {t("Product Status")}:{" "}
                          {productItem.qty > 0
                            ? t("In stock")
                            : t("Out of stock")}
                        </p>
                      </div>
                      <AddChardViews productId={productItem.id} page={"/"} />
                    </div>
                  </div>
                ))
              ) : (
                <p>{t("Product Not Found!")}</p>
              )}
            </div>
          )}
        </div>
      }
    />
  );
};

export default Home;
