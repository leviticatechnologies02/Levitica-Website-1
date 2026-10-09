const getBaseUrl = () => {
  const env = import.meta.env.VITE_ENV;
  return env === "production"
    ? import.meta.env.VITE_PROD_API_URL
    : import.meta.env.VITE_LOCAL_API_URL;
};

export const getProducts = async () => {
  const baseURL = getBaseUrl();
  const response = await fetch(`${baseURL}/api/products`);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

export const getProductBySlug = async (slug) => {
  const baseURL = getBaseUrl();
  const response = await fetch(`${baseURL}/api/products/${slug}`);
  if (!response.ok) throw new Error("Failed to fetch product");
  return response.json();
};
