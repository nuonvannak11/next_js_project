"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

interface AddChardViewsProps {
  productId: any;
  page: string;
}

export const AddChardViews = ({ productId, page }: AddChardViewsProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleAction = (type: string) => () => {
    if (type === "view") {
      const query = new URLSearchParams({
        id: productId,
        pages: page,
      }).toString();
      router.push(`/product/chart/?${query}`);
    } else if (type === "addchart") {
      console.log(`Adding product with id ${productId} to cart`);
    }
  };

  return (
    <div className="items-botton">
      <button onClick={handleAction("addchart")} className="btn-first btn-card">
        {t("Add to Cart")}
      </button>
      <button
        onClick={handleAction("view")}
        className="btn-second btn-card-second">
        {t("View Product")}
      </button>
    </div>
  );
};
