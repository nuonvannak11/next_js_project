"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import "sweetalert2/dist/sweetalert2.css";
import { useSessionData } from "../../../utils/helper/use_selector";
import MainLayout from "../../../components/layout/layout_main";
import { useRouter } from "next/navigation";
import { GetOrderProduct } from "@/utils/hooks/api";
import { encrypt_data } from "@/utils/glable_function";

const UserOrderPage: React.FC = () => {
  const [user_order, setUserOrder] = useState<any>([]);
  const { isLoggedIn, user } = useSessionData();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn && user) {
      const GetOrder = async () => {
        try {
          const respond = await GetOrderProduct(encrypt_data(user.id));
          if (respond.code === 1) {
            setUserOrder(respond.data);
          }
        } catch (error) {
          console.error("Failed to fetch order product:", error);
        }
      };
      GetOrder();
    } else {
      router.push("/");
      return;
    }
  }, [isLoggedIn, user]);

  const { t } = useTranslation();

  return (
    <MainLayout
      page={
        <div className="order-page-container">
          <div className="order-page-wrapper">
            {user_order.length > 0 ? (
              user_order.map((OrderItem: any) => (
                <div key={OrderItem.id} className="order-page">
                  <div className="product-card">
                    <div className="product-info">
                      <div className="product-image">
                        <Image
                          src={
                            OrderItem.productData.product_image ||
                            "/default.png"
                          }
                          alt={OrderItem.productData.product_name || "Product"}
                          width={150}
                          height={150}
                          className="image"
                        />
                      </div>
                      <div className="product-details">
                        <h2 className="product-title">
                          {t(OrderItem.productData.product_name)}
                        </h2>
                        <table className="product-table">
                          <tbody>
                            <tr>
                              <td className="label">{t("Pay Type")}:</td>
                              <td className="value">{OrderItem.pay_type}</td>
                            </tr>
                            <tr>
                              <td className="label">{t("Status")}:</td>
                              <td className={`value ${OrderItem.status}`}>
                                {OrderItem.status}
                              </td>
                            </tr>
                            <tr>
                              <td className="label">{t("Quantity")}:</td>
                              <td className="value">{OrderItem.qty}</td>
                            </tr>
                            <tr>
                              <td className="label">{t("Delivery")}:</td>
                              <td className="value">{OrderItem.delivery}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="price-details">
                      <table className="product-table">
                        <tbody>
                          <tr>
                            <td className="label">{t("Price")}:</td>
                            <td className="value price">
                              {OrderItem.productData.product_price}$
                            </td>
                          </tr>
                          <tr>
                            <td className="label">{t("Discount")}:</td>
                            <td className="value price">
                              {OrderItem.discount}$
                            </td>
                          </tr>
                          <tr>
                            <td className="label">{t("Quantity")}:</td>
                            <td className="value">{OrderItem.qty}</td>
                          </tr>
                          <tr>
                            <td className="label">{t("Order Date")}:</td>
                            <td className="value">{OrderItem.create_at}</td>
                          </tr>
                          <tr>
                            <td className="label">{t("Total")}:</td>
                            <td className="value price">{OrderItem.amount}$</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-order">{t("Order Not Found!")}</p>
            )}
          </div>
        </div>
      }
    />
  );
};

export default UserOrderPage;
