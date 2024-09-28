"use client";

import React, { useContext } from "react";
import { check_screen } from "../../../utils/glable_function";
import { ProductContext } from "../../../contexts/product_context";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import ProductBanner from "../../../components/product/product_banner";
import MainLayout from "../../../components/layout/layout_main";
import { link_img } from "../../../utils/glable_function";

const Electronic: React.FC = () => {
  const { product, error } = useContext(ProductContext);
  const { t } = useTranslation();

  if (error) {
    return <div>Error: {error}</div>;
  }
  const product_filter = product.filter(
    (datas) => datas.category === "Electronics"
  );
  return (
    <MainLayout
      page={
        <div id="shop">
          <div className="banner-item">
            <ProductBanner page={"Electronic"} />
          </div>
          {check_screen("desktop") && (
            <div className="items">
              {product_filter.length > 0 ? (
                product_filter.map((productItem) => (
                  <div className="single-item" key={productItem.id}>
                    <div className="left-set">
                      <Image
                        src={`/assets/products/category/All/${link_img(
                          productItem.product_image
                        )}`}
                        alt={link_img(productItem.product_image)}
                        width={500}
                        height={500}
                        priority
                      />
                    </div>
                    <div className="right-set">
                      <div className="name">{productItem.name}</div>
                      <div className="price">{productItem.price}$</div>
                      <div className="description">
                        <p>
                          {t("Create")}: {productItem.product_create}
                        </p>
                        <p>
                          {t("From")}: {productItem.product_from}
                        </p>
                        <p>
                          {t("Warranty")}: {productItem.warranty} year
                        </p>
                        <p>
                          {t("Product Status")}:{" "}
                          {productItem.qty > 0
                            ? t("In stock")
                            : t("Out of stock")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products available</p>
              )}
            </div>
          )}
        </div>
      }
    />
  );
};

export default Electronic;
