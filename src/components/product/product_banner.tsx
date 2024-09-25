"use client";

import React, { useContext } from "react";
import { FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa";
import { ProductBannerContext } from "../../contexts/product_banner_context";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

interface ProductBannerProps {
  page: string;
}

const ProductBanner: React.FC<ProductBannerProps> = ({ page }) => {
  const { bannerData } = useContext(ProductBannerContext);
  const { t } = useTranslation();

  if (!bannerData || bannerData.length === 0) {
    return <div className="loading">{t("loading...")}</div>;
  }

  let banner_filter = bannerData;
  if (page !== "home_page") {
    banner_filter = bannerData.filter((datas) => datas.category === page);
  }

  return (
    <div className="full-width-container">
      <div className="collection-banner-container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000 }}
          loop>
          {banner_filter.map((banner: any, index: number) => (
            <SwiperSlide key={index}>
              <div className="sixteen columns collection-banner intestinal-health clearfix">
                <div className="jarrow-category-banner prebiotic-health-css-banner">
                  <div className="jcb-left color-white">
                    <h1 className="caps-lock sans-serif raleway font-bold size-60">
                      {banner.name}
                    </h1>
                    <h2 className="sans-serif raleway font-bold size-40 border-top">
                      {banner.title}
                    </h2>
                    <p className="sans-serif raleway font-normal border-top">
                      {banner.description}
                    </p>
                    <div className="field">
                      <button className="sns-btn sns-btn--twitter">
                        <FaTwitter className="sns-btn__icon" />
                      </button>
                      <button className="sns-btn sns-btn--facebook">
                        <FaFacebookF className="sns-btn__icon" />
                      </button>
                      <button className="sns-btn sns-btn--instagram">
                        <FaInstagram className="sns-btn__icon" />
                      </button>
                    </div>
                    <div className="lazer">
                      <Link href="#">{t("Shop Now")}</Link>
                    </div>
                  </div>
                  <div className="jcb-right">
                    <div className="discount-circle">{banner.discount}</div>
                    <div className="white-glow"></div>
                    <div className="bg">
                      <Image
                        className="prebiotic-health-cb-pic"
                        src={`/assets/products/banners/${banner.image}`}
                        alt={`Banner image for ${banner.name}`}
                        width={500}
                        height={500}
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductBanner;
