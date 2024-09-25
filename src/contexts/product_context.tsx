"use client";

import { useProductData } from "../utils/hooks/api";
import React, { createContext, useState, useEffect, ReactNode, FC } from "react";


interface ProductContextProps {
  product: any[]; 
  error: string | null; 
}

export const ProductContext = createContext<ProductContextProps>({
  product: [],
  error: null,
});

interface ProductContextProviderProps {
  children: ReactNode;
}

export const ProductContextProvider: FC<ProductContextProviderProps> = ({ children }) => {
  const productData = useProductData(); 
  const [product, setProduct] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productData) {
      if (productData.error) {
        setError(productData.error);
      } else {
        setProduct(productData.products);
      }
    }
  }, [productData]);

  return (
    <ProductContext.Provider value={{ product, error }}>
      {children}
    </ProductContext.Provider>
  );
};
