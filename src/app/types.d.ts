/* productType is the client side representation of a product object. This is what the server receives and sends back in responses. */
type productType = {
  id: string;
  name: string;
  slug: string;
  description: string;
  categories?: string[];
  price: number;
  discount: number;
  emailMessage?: string;
  searchTags?: {
    name: string;
    value: string;
  }[];
  variants?: {
    groupName: string;
    type: 'text' | 'color';
    variants: {
      name: string;
      stock: number;
    }[];
  }[];
  defaultStock?: number;
  isActive: boolean;
  imagePaths: string[];
  createdSince: number;
  orders?: string[];
};

/* ...except when it's a paginated response. Then this is the response structure. */
type paginatedProductType = {
  products: productType[];
  hasNext: boolean;
  hasPrev: boolean;
  totalPages: number;
};

type productFiltersType = {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  tags?: productType['searchTags'];
  sort?: {
    by: 'date' | 'price';
    order: 'ASC' | 'DESC';
  };
  page?: number;
};

/* same idea for registered customers. */
type customerType = {
  id: string;
  email: string;
  orders?: string[];
  totalOrderValue?: number;
};

/* orderType is actually an outgoing and incoming data structure for placed orders merged into one because I was too lazy to seperate them. */
type orderType = {
  id: string;
  productId: string;
  productName: string;
  customerId: string;
  customerEmail: string;
  pricePaid: number;
  variants?: { name: string; value: string }[];
};

/* wrapper type for any of the above, just with isLoading and hasError flags. */
type asyncType<T> = {
  isLoading: boolean;
  hasError: boolean;
  value: T | null;
};
