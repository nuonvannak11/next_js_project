"use client";

import { useState, useEffect } from "react";
import { io as socketIOClient } from "socket.io-client";
import axios from "axios";

const api: string = process.env.NEXT_PUBLIC_API || "";
const apiUsers: string = process.env.NEXT_PUBLIC_API_USER || "";
const apiProducts: string = process.env.NEXT_PUBLIC_API_PRODUCT || "";
const api_login: string = process.env.NEXT_PUBLIC_API_USER_LOG_IN || "";
const api_register: string = process.env.NEXT_PUBLIC_API_USER_REGISTER || "";
const api_order: string = process.env.NEXT_PUBLIC_API_USER_ORDER || "";
const api_get_one_product: string =
  process.env.NEXT_PUBLIC_API_PRODUCT_GET_ONE || "";
const colorThemeApi: string =
  process.env.NEXT_PUBLIC_API_USER_COLOR_THEME || "";
const apiProductBanner: string =
  process.env.NEXT_PUBLIC_API_PRODUCT_BANNER || "";
const api_forgotPassword: string =
  process.env.NEXT_PUBLIC_API_USER_FORGOT || "";
const api_updateProfile: string =
  process.env.NEXT_PUBLIC_API_USER_UPDATE_PROFILE || "";

let socket: ReturnType<typeof socketIOClient> | null = null;
if (typeof window !== "undefined") {
  socket = socketIOClient(`${api}`, {
    withCredentials: true,
    transports: ["websocket", "polling"],
  });
}

export const useUserData = () => {
  const [users, setUsers] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(apiUsers);
          setUsers(response.data);
          setIsInitialLoad(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }

    if (socket) {
      socket.on("newUsers", (data: any) => {
        setUsers(data);
      });

      return () => {
        socket.off("newUsers");
      };
    }
  }, [isInitialLoad]);

  return users;
};

// PRODUCT DATA
export const useProductData = () => {
  const [products, setProducts] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialLoad) {
      const fetchProductData = async () => {
        try {
          const response = await axios.get(apiProducts, {
            timeout: 5000,
          });
          setProducts(response.data);
          setIsInitialLoad(false);
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Error fetching product data:", error.message);
            setError(error.message);
          } else {
            console.error("An unknown error occurred:", error);
            setError("An unknown error occurred");
          }
        }
      };

      fetchProductData();
    }

    if (socket) {
      socket.on("newProducts", (data: any) => {
        setProducts(data);
      });

      return () => {
        socket.off("newProducts");
      };
    }
  }, [isInitialLoad]);

  return { products, error };
};

// GET BANNER
export const useBannerData = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [banners, setBanners] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialLoad) {
      const fetchBanners = async () => {
        try {
          const response = await axios.get(apiProductBanner, {
            timeout: 5000,
            headers: {
              "Content-Type": "application/json",
            },
          });

          const dataFromApi = response.data;
          if (dataFromApi.code === "1") {
            setBanners(dataFromApi.data);
          } else {
            setError(dataFromApi.message);
          }
          setIsInitialLoad(false);
        } catch (error) {
          console.error("Error:", error);
          setError("An error occurred while fetching data");
        }
      };

      fetchBanners();
    }

    if (socket) {
      socket.on("newProductBanner", (data: any) => {
        setBanners(data);
      });

      return () => {
        socket.off("newProductBanner");
      };
    }
  }, [isInitialLoad]);

  return { banners, error };
};

//GET COLOR THEME
interface MainProps {
  message?: string;
  code: number;
  data?: any;
}

export const ColorSubmitter = async (
  nameColor: string,
  tokenId: string | number,
  ip: string
): Promise<MainProps> => {
  try {
    const response = await axios.post<MainProps>(
      colorThemeApi,
      { nameColor, tokenId, ip },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

//FORGOT PASSWORD
export const ForgotSubmitter = async (
  data: any
): Promise<MainProps | undefined> => {
  try {
    const response = await axios.post<MainProps>(api_forgotPassword, data, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });
    return response.data;
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      console.error("Error: Request timed out");
    } else {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  }
};

//GET BENNER
export const GetBannerSubmitter = async (): Promise<MainProps | undefined> => {
  try {
    const response = await axios.get<MainProps>(apiProductBanner, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });
    return response.data;
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      console.error("Error: Request timed out");
    } else {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  }
};

export const LoginSubmitter = async (
  username: string,
  password: string
): Promise<MainProps | undefined> => {
  try {
    const response = await axios.post<MainProps>(
      api_login,
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      console.error("Error: Request timed out");
    } else {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  }
};

export const UpdateUserSubmitter = async (
  userData: any,
  tokenUser: any
): Promise<MainProps | undefined> => {
  try {
    const response = await axios.post<MainProps>(
      api_updateProfile,
      { userData, tokenUser },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      console.error("Error: Request timed out");
    } else {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  }
};

export const GetOneProduct = async (id: any): Promise<any> => {
  try {
    const response = await axios.post<MainProps>(
      api_get_one_product,
      { id },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      console.error("Error: Request timed out");
    } else {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  }
};

export const OrderProduct = async (formdata: any): Promise<any> => {
  try {
    const response = await axios.post<MainProps>(
      api_order,
      { formdata },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 50000,
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      console.error("Error: Request timed out");
    } else {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  }
};
