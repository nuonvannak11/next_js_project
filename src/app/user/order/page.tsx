"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import "sweetalert2/dist/sweetalert2.css";
import { useSessionData } from "../../../utils/helper/use_selector";
import MainLayout from "../../../components/layout/layout_main";
import { useRouter } from "next/navigation";


const UserOrderPage: React.FC = () => {
  const [user_data, setUserData] = useState<any>([]);
  const { isLoggedIn, user } = useSessionData();

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    } else if (user) {
      setUserData(user);
    }
  }, [isLoggedIn, user, router]);

  const { t } = useTranslation();

  return (
    <MainLayout
      page={
        <div className="order-page">
          <div className="product-card">
            <div className="product-info">
              <div className="product-image">
                <Image
                  src="/assets"
                  alt="Product Image"
                  width={380}
                  height={380}
                />
              </div>
              <div className="product-details">
                <h2>{t("Waterproof Mobile Phone")}</h2>
                <div className="rating">
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span className="star half">&#9733;</span>
                </div>
                <p>{t("Color")}: Gray</p>
              </div>
            </div>

            <div className="price-details">
              <p className="price">
                <span className="original-price">$500</span>
                <span className="discounted-price">$450</span>
              </p>
              <div className="quantity">
                <label htmlFor="quantity">{t("Quantity")}</label>
                <select id="quantity">
                  <option value="1">1</option>
                  <option value="2" selected>
                    2
                  </option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <p className="total-price">$900</p>
            </div>

            <div className="actions">
              <button className="delete">&#128465;</button>
              <button className="wishlist">&#9825;</button>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default UserOrderPage;
