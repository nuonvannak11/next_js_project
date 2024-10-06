"use client";

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { GetOneProduct } from "../../../utils/hooks/api";
import { useSearchParams } from "next/navigation";
import MainLayout from "../../../components/layout/layout_main";
import {
  empty,
  link_img,
  data_emty,
  cv_number,
} from "../../../utils/glable_function";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

const ProductCard = () => {
  const { t } = useTranslation();
  const isMounted = useRef(false);
  const [data, setData] = useState<any>([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [checkboxState, setCheckboxState] = useState({});
  const [productData, setproductData] = useState<any>([]);
  const [productItem, setproductItem] = useState<any>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [numberProduct, setNumberProduct] = useState(1);
  const [amount, setAmount] = useState<any>("");
  const [listData, setListData] = useState(null);
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const page = searchParams.get("page");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const respond = await GetOneProduct(productId);
        if (cv_number(respond.code) === 1) {
          let res_data = respond.data.product;
          let res_item = respond.data.item;
          setData(respond.data);
          setproductData(res_data);
          setproductItem(res_item);
          setImageData(res_data.product_image);
          setAmount(res_data.product_price);
        }
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      } finally {
        setIsFetching(false);
      }
    };

    if (!isMounted.current) {
      fetchData();
      isMounted.current = true;
    }
  }, [productId]);

  const controlNumber = (data: string) => {
    let amount_main = cv_number(amount);
    let price_item = cv_number(productData.product_price);
    let qty_item = numberProduct;
    let price_current;
    let number;
    if (data === "plus") {
      number = qty_item + 1;
      price_current = amount_main + price_item;
    } else {
      if (qty_item > 1) {
        number = qty_item - 1;
        price_current = amount_main - price_item;
      }
    }
    if (number && qty_item >= 1) {
      setNumberProduct(number);
      setAmount(price_current.toFixed(2));
    }
  };

  const controlPrice = (data, price, type) => {
    if (typeof type === "string") {
      if (type === "color") {
        setCheckboxState((prevState) => ({
          ...prevState,
          [data]: price,
        }));
        console.log("currentPrice==", currentPrice);
        console.log("data==", data);
        console.log("price==", price);
      }
      if (type === "size") {
        console.log("currentPrice==", currentPrice);
        console.log("data==", data);
        console.log("price==", price);
      }
      if (type === "weight") {
        console.log("currentPrice==", currentPrice);
        console.log("data==", data);
        console.log("price==", price);
      }
    }
  };

  const listItem = (data) => {};
  const checkPrice = (data, type) => {
    console.log("data==", data);
    console.log("type==", type);
  };

  const handleChangeImage = (data) => {
    setImageData(data);
    console.log("data=", imageData);
  };

  if (isFetching) {
    return <div>{t("Loading...")}</div>;
  }

  if (empty(data)) {
    return <div>{t("No data available")}</div>;
  }
  console.log("data:", data);
  return (
    <MainLayout
      page={
        <div className="card">
          <form>
            <div className="leftcard">
              <div className="item">
                <img
                  className="cover"
                  src={`/assets/products/category/${productData.category}/${imageData}`}
                  alt="Product Cover"
                />
              </div>
            </div>
            <div className="rightcard">
              <h1>{data_emty(productData.product_name)}</h1>
              <table className="product-table">
                <tbody>
                  <tr>
                    <td className="label">{t("Description")}:</td>
                    <td className="value">
                      {productData ? productData.description : "---"}
                    </td>
                  </tr>
                  <tr>
                    <td className="label">{t("From")}:</td>
                    <td className="value">
                      {productData ? productData.product_from : "---"}
                    </td>
                  </tr>
                  <tr>
                    <td className="label">{t("Warranty")}:</td>
                    <td className="value">
                      {productData ? productData.warranty : "---"}
                      {t("year")}
                    </td>
                  </tr>
                  <tr>
                    <td className="label">{t("Color")}:</td>
                    <td className="value">
                      {productData ? t(`${productData.product_color}`) : "---"}
                    </td>
                  </tr>
                  <tr>
                    <td className="label">{t("Date Created")}:</td>
                    <td className="value">
                      {productData ? productData.product_create : "---"}
                    </td>
                  </tr>
                  <tr>
                    <td className="label">{t("Price")}:</td>
                    <td className="value">
                      <p style={{ color: "red" }}>
                        {productData ? productData.product_price : "---"}$
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="modify">
                <label htmlFor="modify">
                  {t("You can add more details if you want!")}
                </label>
              </div>
              <div className="additem">
                {productItem && productItem.item_color && (
                  <div className="cover-items">
                    <label className="title-items">{t("Colors")}:</label>
                    {productItem.item_color.map((colorObject) => {
                      const colorName = Object.keys(colorObject)[0];
                      const colorValue = colorObject[colorName];
                      return (
                        <label
                          key={colorName}
                          className={`blue ${colorName.toLowerCase()}`}>
                          <input
                            type="checkbox"
                            checked={checkPrice(
                              `${colorName.toLowerCase()}`,
                              "color"
                            )}
                            onChange={() =>
                              controlPrice(
                                `${colorName.toLowerCase()}`,
                                `${colorValue}`,
                                "color"
                              )
                            }
                          />
                          {t(`${colorName}`)}
                        </label>
                      );
                    })}
                  </div>
                )}
                {productItem && productItem.item_size && (
                  <div className="cover-items">
                    <label className="title-items">{t("Size")}:</label>
                    {productItem.item_size.map((sizeObject) => {
                      const sizeName = Object.keys(sizeObject)[0];
                      const sizeValue = sizeObject[sizeName];
                      return (
                        <label
                          key={sizeName}
                          className={`weight ${sizeName.toLowerCase()}`}>
                          <input
                            type="checkbox"
                            onClick={() =>
                              controlPrice(
                                `${sizeName}`,
                                `${sizeValue}`,
                                "size"
                              )
                            }
                            value={sizeValue}
                          />
                          {sizeName}
                        </label>
                      );
                    })}
                  </div>
                )}
                {productItem && productItem.item_weight && (
                  <div className="cover-items">
                    <label className="title-items">{t("Weight")}:</label>
                    {productItem.item_weight.map((weightObject) => {
                      const weightName = Object.keys(weightObject)[0];
                      const weightValue = weightObject[weightName];
                      return (
                        <label
                          key={weightName}
                          className={`weight ${weightName.toLowerCase()}`}>
                          <input
                            type="checkbox"
                            onClick={() =>
                              controlPrice(
                                `${weightName}`,
                                `${weightValue}`,
                                "weight"
                              )
                            }
                            value={weightValue}
                          />
                          {weightName}
                        </label>
                      );
                    })}
                  </div>
                )}
                <div className="quantity">
                  <label>Quantity:</label>
                  <FontAwesomeIcon
                    className="faMinus"
                    icon={faMinus}
                    onClick={() => controlNumber("minus")}
                  />
                  <span>{numberProduct}</span>
                  <FontAwesomeIcon
                    className="faPlus"
                    icon={faPlus}
                    onClick={() => controlNumber("plus")}
                  />
                </div>
              </div>
            </div>
            <div className="footerleft">
              <div
                className="item"
                onClick={() =>
                  handleChangeImage(`${productData.image_footer_first}`)
                }>
                <img
                  className="cover"
                  src={`/assets/products/category/${productData.category}/${productData.image_footer_first}`}
                  alt="React Image"
                />
              </div>
              <div
                className="item"
                onClick={() =>
                  handleChangeImage(`${productData.image_footer_second}`)
                }>
                <img
                  className="cover"
                  src={`/assets/products/category/${productData.category}/${productData.image_footer_second}`}
                  alt="React Image"
                />
              </div>
              <div
                className="item"
                onClick={() =>
                  handleChangeImage(`${productData.image_footer_third}`)
                }>
                <img
                  className="cover"
                  src={`/assets/products/category/${productData.category}/${productData.image_footer_third}`}
                  alt="React Image"
                />
              </div>
            </div>
            <div className="footerright">
              <div className="item">
                <label>Total Price:</label>
                <span className="price">{amount}$</span>
              </div>
              <div className="right">
                <button>Pay Now</button>
                <Link href="/">Cancel</Link>
              </div>
            </div>
          </form>
        </div>
      }
    />
  );
};

export default ProductCard;
