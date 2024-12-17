/* productType is the client side representation of a product object. This is what the server receives and sends back in responses. */
export type productType = {
  id: string;
  name: string;
  description: string;
  categories?: string[];
  price: number;
  discount: number;
  extra?: string;
  isActive: boolean;
  imagePaths: string[];
  createdSince: number;
  orders?: string[];
};

/* ...except when it's a paginated response. Then this is the response structure. */
export type paginatedProductType = {
  products: productType[];
  hasNext: boolean;
  hasPrev: boolean;
  totalPages: number;
};

/* same idea for registered customers. */
export type customerType = {
  id: string;
  email: string;
  orders?: string[];
  totalOrderValue?: number;
};

/* orderType is actually an outgoing and incoming data structure for placed orders merged into one because I was too lazy to seperate them. */
export type orderType = {
  id: string;
  productId: string;
  productName: string;
  customerId: string;
  customerEmail: string;
  pricePaid: number;
};

/* wrapper type for any of the above, just with isLoading and hasError flags. */
export type asyncType<T> = {
  isLoading: boolean;
  hasError: boolean;
  value: T | null;
};
