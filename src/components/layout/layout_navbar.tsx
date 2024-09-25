"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../switcher_language";
import ColorSwitcher from "../switcher_color";
import Log from "../user/user_icon";
import Image from "next/image";
import "sweetalert2/dist/sweetalert2.css";
import {
  SearchOutlined as SearchIcon,
  FullscreenExitOutlined as FullscreenExitIcon,
  NotificationsNoneOutlined as NotificationsNoneIcon,
  ChatBubbleOutlineOutlined as ChatBubbleOutlineIcon,
  ListOutlined as ListIcon,
} from "@mui/icons-material";
import { useSearch } from "../../contexts/product_search_context";
import { useSessionData } from "../../utils/helper/use_selector";
import { empty } from "../../utils/glable_function";
const Navbar: React.FC = () => {
  const [user_data, setUserData] = useState<any>([]);
  const { t } = useTranslation();
  const { searchTerm, setSearchTerm } = useSearch();
  const router = useRouter();
  const { isLoggedIn, user } = useSessionData();

  useEffect(() => {
    if (isLoggedIn && user) {
      setUserData(user);
    }
  }, [isLoggedIn, user]);

  const handleCategoryClick = (page: string) => {
    router.push(`${page}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <input
            type="text"
            placeholder={t("Search")}
            value={searchTerm}
            onChange={handleSearch}
          />
          <SearchIcon />
        </div>
        <div className="main-nav">
          <div className="nav-item">
            <button onClick={() => handleCategoryClick("/")}>
              {t("Home")}
            </button>
          </div>
          <div className="nav-item">
            <button onClick={() => handleCategoryClick("/product/electronic")}>
              {t("Electronic")}
            </button>
          </div>
          <div className="nav-item">
            <button onClick={() => handleCategoryClick("/product/cloth")}>
              {t("Cloth")}
            </button>
          </div>
          <div className="nav-item">
            <button onClick={() => handleCategoryClick("/product/food")}>
              {t("Food")}
            </button>
          </div>
          <div className="nav-item">
            <button onClick={() => handleCategoryClick("/product/contact_us")}>
              {t("Contact us")}
            </button>
          </div>
        </div>
        <div className="items">
          <div className="item">
            <div className="icon1">
              <LanguageSwitcher />
            </div>
          </div>
          <div className="item">
            <ColorSwitcher />
          </div>
          {isLoggedIn ? (
            <>
              <li className="item">
                <FullscreenExitIcon className="icon" />
              </li>
              <li className="item">
                <NotificationsNoneIcon className="icon" />
                <div className="counter">1</div>
              </li>
              <li className="item">
                <ChatBubbleOutlineIcon className="icon" />
                <div className="counter">2</div>
              </li>
              <li className="item">
                <ListIcon className="icon" />
              </li>
              <li
                className="item"
                onClick={() => handleCategoryClick("/user/profile")}>
                <Image
                  src={`/assets/users/${!empty(user_data)?user_data.image:'---.png'}`}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="avatar"
                />
              </li>
            </>
          ) : (
            <div className="item">
              <Log />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
