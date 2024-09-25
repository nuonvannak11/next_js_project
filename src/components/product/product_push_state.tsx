"use client";

import Cookies from "js-cookie";

export const Products = ({ productId, t }) => {
  
  const handleViewDetails = (productId) => () => {
    Cookies.set("page", "DetailProduct", { expires: 1 });
    Cookies.set("id_product", productId, { expires: 1 });
    window.dispatchEvent(new Event("cookiechange"));
  };

  const handleSave = () => {};

  return (
    <>
      <button
        onClick={handleSave}
        className="btn-first btn-card"
        style={{ fontFamily: "'Battambang'" }}>
        {t("Add to Cart")}
      </button>
      <button
        onClick={handleViewDetails(productId)}
        className="btn-second btn-card-second"
        style={{ fontFamily: "'Battambang'" }}>
        {t("Buy Now")}
      </button>
    </>
  );
};
