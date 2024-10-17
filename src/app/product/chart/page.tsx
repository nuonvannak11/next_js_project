"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { GetOneProduct } from "../../../utils/hooks/api";
import { useSearchParams } from "next/navigation";
import MainLayout from "../../../components/layout/layout_main";
import {
  empty,
  lower_text,
  link_img,
  data_emty,
  cv_number,
} from "../../../utils/glable_function";
import CheckboxGroup from "../../../components/product/product_checkbox_group";

const ProductCard = () => {
  const { t } = useTranslation();
  const isMounted = useRef(false);
  const [data, setData] = useState<any>([]);
  const [selectedColors, setSelectedColors] = useState<any>("");
  const [selectedSizes, setSelectedSizes] = useState<any>("");
  const [selectedWeights, setSelectedWeights] = useState<any>("");
  const [productData, setproductData] = useState<any>([]);
  const [productItem, setproductItem] = useState<any>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [numberProduct, setNumberProduct] = useState<number>(1);
  const [amount, setAmount] = useState<any>("");
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const page = searchParams.get("pages");
  const colors = productItem.item_color;
  const sizes = productItem.item_size;
  const weights = productItem.item_weight;

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

  useEffect(() => {
    const productPrice = cv_number(productData.product_price);
    let colorAmount = 0,
      sizeAmount = 0,
      weightAmount = 0,
      totalAmount = 0;

    if (!empty(selectedColors)) {
      colorAmount = cv_number(findData(selectedColors, productItem.item_color));
    }

    if (!empty(selectedSizes)) {
      sizeAmount = cv_number(findData(selectedSizes, productItem.item_size));
    }

    if (!empty(selectedWeights)) {
      weightAmount = cv_number(
        findData(selectedWeights, productItem.item_weight)
      );
    }
    totalAmount =
      (colorAmount + sizeAmount + weightAmount + productPrice) * numberProduct;
    setAmount(totalAmount.toFixed(2));
  }, [selectedColors, selectedSizes, selectedWeights, amount, numberProduct]);

  const findData = (name: any, arrayData: any) => {
    const result = arrayData.find((item: any) => item.hasOwnProperty(name));
    return result ? cv_number(result[name]) : 0;
  };

  const controlNumber = (type: string) => {
    let amount_main = cv_number(amount);
    let price_item = cv_number(productData.product_price);
    let qty_item = cv_number(numberProduct);
    let price_current;
    let number;
    if (type === "plus") {
      number = qty_item + 1;
      price_current = amount_main + price_item;
    } else if (type === "minus") {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let qty = parseInt(e.target.value);
    if (qty < 1 || empty(qty)) {
      qty = 1;
    }
    console.log("qty=", qty);
    setNumberProduct(qty);
  };

  const CheckboxChange = (setState: any, selectedValues: any, value: any) => {
    setState(lower_text(value));
    if (lower_text(selectedValues) === lower_text(value)) {
      setState("");
    }
  };

  const checkActive = (state: any, value: any): boolean => {
    return lower_text(state) === lower_text(value);
  };

  const handleChangeImage = (data: any) => {
    setImageData(data);
  };

  const query = new URLSearchParams({
    id: productId ?? "",
    pages: page ?? "",
    amounts: amount ?? "",
    qtys: numberProduct.toString(),
    image: imageData ?? "",
  }).toString();

  if (isFetching) {
    return <div>{t("Loading...")}</div>;
  }

  if (empty(data)) {
    return <div>{t("No data available")}</div>;
  }

  return (
    <MainLayout
      page={
        <div className="card">
          <form>
            <div className="cover-site">
              <div className="left-site">
                <div className="leftcard">
                  <div className="item">
                    <Image
                      className="cover"
                      src={link_img(imageData)}
                      alt={link_img(imageData)}
                      width={500}
                      height={500}
                      priority
                    />
                  </div>
                </div>
                <div className="footerleft">
                  <div
                    className="item"
                    onClick={() =>
                      handleChangeImage(`${productData.image_footer_first}`)
                    }>
                    <Image
                      className="cover"
                      src={link_img(productData.image_footer_first)}
                      alt={link_img(productData.image_footer_first)}
                      width={200}
                      height={200}
                      priority
                    />
                  </div>
                  <div
                    className="item"
                    onClick={() =>
                      handleChangeImage(`${productData.image_footer_second}`)
                    }>
                    <Image
                      className="cover"
                      src={link_img(productData.image_footer_second)}
                      alt={link_img(productData.image_footer_second)}
                      width={200}
                      height={200}
                      priority
                    />
                  </div>
                  <div
                    className="item"
                    onClick={() =>
                      handleChangeImage(`${productData.image_footer_third}`)
                    }>
                    <Image
                      className="cover"
                      src={link_img(productData.image_footer_third)}
                      alt={link_img(productData.image_footer_third)}
                      width={200}
                      height={200}
                      priority
                    />
                  </div>
                </div>
              </div>
              <div className="right-site">
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
                          {productData
                            ? t(`${productData.product_color}`)
                            : "---"}
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
                    {!empty(colors) && (
                      <CheckboxGroup
                        title="Colors"
                        items={colors}
                        selectedItems={selectedColors}
                        setSelectedItems={setSelectedColors}
                        CheckboxChange={CheckboxChange}
                        checkActive={checkActive}
                        t={t}
                        classNamePrefix="color"
                        transformText={(text) => lower_text(text)}
                      />
                    )}
                    {!empty(sizes) && (
                      <CheckboxGroup
                        title="Size"
                        items={sizes}
                        selectedItems={selectedSizes}
                        setSelectedItems={setSelectedSizes}
                        CheckboxChange={CheckboxChange}
                        checkActive={checkActive}
                        t={t}
                        classNamePrefix="size"
                        transformText={(text) => lower_text(text)}
                      />
                    )}
                    {!empty(weights) && (
                      <CheckboxGroup
                        title="Weight"
                        items={weights}
                        selectedItems={selectedWeights}
                        setSelectedItems={setSelectedWeights}
                        CheckboxChange={CheckboxChange}
                        checkActive={checkActive}
                        t={t}
                        classNamePrefix="weight"
                        transformText={(text) => lower_text(text)}
                      />
                    )}
                    <div className="quantity">
                      <label>Quantity:</label>
                      <div className="counter">
                        <button
                          type="button"
                          className="btn minus"
                          onClick={() => controlNumber("minus")}>
                          -
                        </button>
                        <input
                          type="number"
                          className="value-input"
                          value={numberProduct}
                          onChange={handleInputChange}
                        />
                        <button
                          type="button"
                          className="btn plus"
                          onClick={() => controlNumber("plus")}>
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="footerright">
                  <div className="item">
                    <label>{t("Total Price")}:</label>
                    <span className="price">{amount}$</span>
                  </div>
                  <div className="right">
                    <Link
                      href={`/product/check_out/?${query}`}
                      className="btn pay-now">
                      {t("Pay Now")}
                    </Link>
                    <Link href={`/${page}`} className="btn cancel">
                      {t("Cancel")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      }
    />
  );
};

export default ProductCard;
