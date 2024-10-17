"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../auth/store";
import { logout } from "../../auth/action";

import {
  Dashboard as DashboardIcon,
  CreditCard as CreditCardIcon,
  LocalShipping as LocalShippingIcon,
  InsertChart as InsertChartIcon,
  NotificationsNone as NotificationsNoneIcon,
  SettingsSystemDaydreamOutlined as SettingsSystemDaydreamOutlinedIcon,
  PsychologyOutlined as PsychologyOutlinedIcon,
  SettingsApplications as SettingsApplicationsIcon,
  ExitToApp as ExitToAppIcon,
  AccountCircleOutlined as AccountCircleOutlinedIcon,
} from "@mui/icons-material";

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const isLoggedIn = useSelector(
    (state: RootState) => state.session.isLoggedIn
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    if (category === "logout") {
      dispatch(logout());
    } else {
      router.push(category);
    }
  };

  return (
    <div className="sidebar">
      <div className="top" onClick={() => handleCategoryClick("/")}>
        <span className="logo">{t("Shop online")}</span>
      </div>
      {isLoggedIn ? (
        <div className="center">
          <ul>
            <div className="main-item">
              <p className="title">{t("MAIN")}</p>
              <li onClick={() => handleCategoryClick("/")}>
                <DashboardIcon className="icon" />
                <span>{t("Dashboard")}</span>
              </li>
            </div>
            <div className="list-item">
              <p className="title">{t("LISTS")}</p>
              <li onClick={() => handleCategoryClick("/user/order")}>
                <CreditCardIcon className="icon" />
                <span>{t("Orders")}</span>
              </li>
              <li onClick={() => handleCategoryClick("/delivery")}>
                <LocalShippingIcon className="icon" />
                <span>{t("Delivery")}</span>
              </li>
            </div>
            <div className="useful-item">
              <p className="title">{t("USEFUL")}</p>
              <li onClick={() => handleCategoryClick("/stats")}>
                <InsertChartIcon className="icon" />
                <span>{t("Stats")}</span>
              </li>
              <li onClick={() => handleCategoryClick("/notifications")}>
                <NotificationsNoneIcon className="icon" />
                <span>{t("Notifications")}</span>
              </li>
            </div>
            <div className="service-item">
              <p className="title">{t("SERVICE")}</p>
              <li onClick={() => handleCategoryClick("/system-health")}>
                <SettingsSystemDaydreamOutlinedIcon className="icon" />
                <span>{t("System Health")}</span>
              </li>
              <li onClick={() => handleCategoryClick("/logs")}>
                <PsychologyOutlinedIcon className="icon" />
                <span>{t("Logs")}</span>
              </li>
              <li onClick={() => handleCategoryClick("/settings")}>
                <SettingsApplicationsIcon className="icon" />
                <span>{t("Settings")}</span>
              </li>
            </div>
            <div className="user-item">
              <p className="title">{t("USER")}</p>
              <li onClick={() => handleCategoryClick("/user/profile")}>
                <AccountCircleOutlinedIcon className="icon" />
                <span>{t("Profile")}</span>
              </li>
              <li onClick={() => handleCategoryClick("logout")}>
                <ExitToAppIcon className="icon" />
                <span>{t("Logout")}</span>
              </li>
            </div>
          </ul>
        </div>
      ) : (
        <div className="welcome">
          <div className="cover-items">
            <h1>{t("WELCOME TO OUR STORE")}</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
