"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import MainLayout from "../../../components/layout/layout_main";
import {
  empty,
  lower_text,
  link_img,
  data_emty,
  cv_number,
  cv_str,
  ShowAlert,
  encrypt_data,
} from "../../../utils/glable_function";

import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import { OrderProduct } from "../../../utils/hooks/api";
import { useSessionData } from "../../../utils/helper/use_selector";

const CheckoutForm = () => {
  const { t } = useTranslation();
  const { isLoggedIn, user } = useSessionData();
  const [formData, setFormData] = useState<any>({
    name: "",
    card_number: "",
    paytype: "stripe",
    exp_date: "",
    cvv: "",
  });

  const cardnameRef = useRef(null);
  const cardnumberRef = useRef(null);
  const expRef = useRef(null);
  const cvvRef = useRef(null);
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const page = searchParams.get("pages");
  const images = searchParams.get("image");
  const price_amount = searchParams.get("amounts");
  const qty = searchParams.get("qtys");

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/${page}`);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const check_type = (type: any) => {
    return lower_text(type) === lower_text(formData.paytype);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (empty(formData.name)) {
      ShowAlert(
        "error",
        t("Please input"),
        t("Field cardname can't be empty!"),
        cardnameRef,
        t
      );
      return;
    }
    if (empty(formData.card_number)) {
      ShowAlert(
        "error",
        t("Please input"),
        t("Field cardnumber can't be empty!"),
        cardnumberRef,
        t
      );
      return;
    }
    if (empty(formData.exp_date)) {
      ShowAlert(
        "error",
        t("Please input"),
        t("Field card EXP can't be empty!"),
        expRef,
        t
      );
      return;
    }
    if (empty(formData.cvv)) {
      ShowAlert(
        "error",
        t("Please input"),
        t("Field card CVV can't be empty!"),
        cvvRef,
        t
      );
      return;
    }
    let timerInterval: any;
    let swalTimer: any;
    let apiData: any;

    try {
      await Swal.fire({
        title: t("Please Wait"),
        html: t("Please wait a moment"),
        timerProgressBar: true,
        didOpen: async () => {
          Swal.showLoading();
          const userId = user ? encrypt_data(cv_str(user.id)) : null;
          const formdata = {
            user_id: userId,
            product_id: encrypt_data(cv_str(productId)),
            product_qty: encrypt_data(cv_str(qty)),
            product_amount: encrypt_data(cv_str(price_amount)),
            pay_type: encrypt_data(cv_str(formData.paytype)),
            card_name: encrypt_data(cv_str(formData.name)),
            card_number: encrypt_data(cv_str(formData.card_number)),
            card_exp: encrypt_data(cv_str(formData.exp_date)),
            card_cvv: encrypt_data(cv_str(formData.cvv)),
          };
          apiData = await OrderProduct(formdata);
          Swal.close();
          const popup = Swal.getPopup();
          if (popup) {
            const timer = popup.querySelector("b");
            if (timer) {
              timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
              }, 100);
            }
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
          clearTimeout(swalTimer);
        },
      });

      let code_msg = cv_number(apiData.code);
      let message = apiData.message;
      console.log(apiData);
      return;
      if (code_msg === 1) {
        Swal.fire({
          icon: "success",
          title: t("Login Successful"),
          text: t(message),
          timer: 2000,
          timerProgressBar: true,
          footer: t("Welcome Back!"),
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            router.push(`/${page}`);
          } else if (result.isConfirmed) {
            router.push(`/${page}`);
          }
        });
      } else if (code_msg === -1) {
        ShowAlert("error", t("Please input"), t(message), cardnameRef, t);
      } else if (code_msg === -2) {
        ShowAlert("error", t("Please input"), t(message), cardnumberRef, t);
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.close();
    }
    console.log("Form submitted:", formData);
  };

  return (
    <MainLayout
      page={
        <div className="check-out">
          <div className="card">
            <div className="leftside">
              <div className="coverimag">
                <Image
                  className="product"
                  src={images || "/default.png"}
                  alt={images || "default image"}
                  width={500}
                  height={500}
                  priority
                />
              </div>
              <div className="price">
                <span className="text-price">{t("Total Price")} : </span>
                {price_amount}
                <span className="red"> $</span>
              </div>
            </div>
            <div className="rightside">
              <form onSubmit={handleSubmit}>
                <h1>CheckOut</h1>
                <h2>Payment Information</h2>
                <p>{t("Payment Method")}</p>
                <select
                  className="inputbox"
                  name="paytype"
                  value={formData.paytype}
                  onChange={handleChange}>
                  <option value="stripe">STRIPE</option>
                  <option value="paypal">PAYPAL</option>
                  <option value="aba_payway">ABA PAYWAY</option>
                </select>

                {check_type("stripe") && (
                  <>
                    <p>Cardholder Name</p>
                    <input
                      type="text"
                      className="inputbox"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      ref={cardnameRef}
                    />

                    <p>Card Number</p>
                    <input
                      type="number"
                      className="inputbox"
                      name="card_number"
                      value={formData.card_number}
                      onChange={handleChange}
                      ref={cardnumberRef}
                    />

                    <div className="expcvv">
                      <p className="expcvv_text">Expiry</p>
                      <input
                        type="date"
                        className="inputbox"
                        name="exp_date"
                        value={formData.exp_date}
                        onChange={handleChange}
                        ref={expRef}
                      />

                      <p className="expcvv_text2">CVV</p>
                      <input
                        type="password"
                        className="inputbox"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        ref={cvvRef}
                      />
                    </div>
                  </>
                )}
                <button type="submit" className="button">
                  CheckOut
                </button>
              </form>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default CheckoutForm;
