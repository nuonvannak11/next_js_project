"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import "sweetalert2/dist/sweetalert2.css";
import { useSessionData } from "../../../utils/helper/use_selector";
import { empty, link_img, data_emty } from "../../../utils/glable_function";
import MainLayout from "../../../components/layout/layout_main";
// import UpdateProfile from "../update/updateProfile";

const UserProfile: React.FC = () => {
  const [user_data, setUserData] = useState<any>([]);
  const { isLoggedIn, user } = useSessionData();

  useEffect(() => {
    if (isLoggedIn && user) {
      setUserData(user);
    }
  }, [isLoggedIn, user]);

  const { t } = useTranslation();

  console.log("user_data=", user_data);
  if (!isLoggedIn) {
    return (
      <MainLayout
        page={
          <div className="profile-page">
            <div className="wrapper">
              <div className="left">
                <img
                  src="/assets/users/not-found.png"
                  className="logo-users"
                  alt="notfound"
                />
                <div className="cover-item">
                  <h4 className="name-user">{t("Guest")}</h4>
                  <p>{t("Please log in to view your profile.")}</p>
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }
  return (
    <MainLayout
      page={
        <div className="profile-page">
          <div className="wrapper">
            <div className="left">
              <Image
                src={`/assets/users/${link_img(user_data.image)}`}
                alt={link_img(user_data.image)}
                width={100}
                height={100}
                className="logo-users"
              />
              <div className="cover-item">
                <h4 className="name-user">{data_emty(user_data.name)}</h4>
                <p>
                  {t("Your Slary")} : {data_emty(user_data.salary)}$
                </p>
                <p>
                  {t("Your Last Login")} : {data_emty(user_data.salary)}$
                </p>
                <p>
                  {t("Total buy")} : {data_emty(user_data.salary)}$
                </p>
                <p>
                  {t("Total Point")} : {data_emty(user_data.salary)}$
                </p>
                <p>
                  {t("Discount Rate")} : {data_emty(user_data.salary)}$
                </p>
                <p>
                  {t("Level")} : {data_emty(user_data.salary)}$
                </p>
              </div>
              <div className="field-profile">{/* <UpdateProfile /> */}</div>
            </div>
            <div className="right">
              <div className="info">
                <h3 className="basic-info">{t("Basic Information")}</h3>
                <div className="info_data">
                  <div className="data">
                    <h4>{t("Email")}</h4>
                    <p>{data_emty(user_data.email)}</p>
                  </div>
                  <div className="data">
                    <h4>{t("Mobile Number")}</h4>
                    <p>{data_emty(user_data.tel)}</p>
                  </div>
                  <div className="data">
                    <h4>{t("Age")}</h4>
                    <p>{data_emty(user_data.age)}</p>
                  </div>
                  <div className="data">
                    <h4>{t("Gender")}</h4>
                    <p>{data_emty(user_data.gender)}</p>
                  </div>
                  <div className="data">
                    <h4>{t("Address")}</h4>
                    <p>{data_emty(user_data.address)}</p>
                  </div>
                  <div className="data">
                    <h4>{t("Bank Account")}</h4>
                    <p>{data_emty(user_data.bankacc)}</p>
                  </div>
                  <div className="data">
                    <h4>{t("Bank Number")}</h4>
                    <p>{data_emty(user_data.bankno)}</p>
                  </div>
                  <div className="data">
                    <h4>{t("Contact Us")}</h4>
                    <p>{data_emty(user_data.contact)}</p>
                  </div>
                  <div className="data">
                    <h4>{t("Create at")}</h4>
                    <p>{data_emty(user_data.create_at)}</p>
                  </div>
                  <div className="data">
                    <h4>{t("Update at")}</h4>
                    <p>{data_emty(user_data.update_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};
export default UserProfile;
