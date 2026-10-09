import { productsData } from "@/data/productsData";

const getBaseUrl = () => {
  const env = import.meta.env.VITE_ENV;
  return env === "production"
    ? import.meta.env.VITE_PROD_API_URL
    : import.meta.env.VITE_LOCAL_API_URL;
};

export const getProducts = async () => {
  // Return values from local json data instead of backend
  return Object.values(productsData);
};

export const getProductBySlug = async (slug) => {
  // Find product by slug key from local json data
  const product = productsData[slug];
  if (!product) throw new Error("Product not found");
  return product;
};
