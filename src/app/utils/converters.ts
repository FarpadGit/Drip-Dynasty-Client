import { orderType, paginatedProductType, productType } from '../types';

// formats productType objects to network sendable FormData
export function productToFormData(product: productType) {
  const formData = new FormData();
  formData.append('id', product.id);
  formData.append('name', product.name);
  formData.append('description', product.description);
  formData.append('price', product.price.toString());
  formData.append('discount', product.discount.toString());
  formData.append('isActive', product.isActive.toString());
  formData.append('extra', product.extra || '');
  product.categories?.forEach((cat) => formData.append('categories[]', cat));
  product.imagePaths.forEach((path) => formData.append('imagePaths[]', path));

  formData.append('createdSince', product.createdSince.toString());

  return formData;
}

// formats orderType objects to network sendable FormData (only relevant fields)
export function orderToFormData(order: Partial<orderType>) {
  const formData = new FormData();
  if (order.id) formData.append('id', order.id);
  if (order.productId) formData.append('productId', order.productId);
  if (order.productName) formData.append('productName', order.productName);
  if (order.customerId) formData.append('customerId', order.customerId);
  if (order.customerEmail)
    formData.append('customerEmail', order.customerEmail);
  if (order.pricePaid) formData.append('pricePaid', order.pricePaid.toString());

  return formData;
}

// parses server response JSON string as productType
export function parseProductJSON(obj: { [key: string]: any }) {
  let result = obj;
  const keysToConvert = [
    'price',
    'discount',
    'isActive',
    'pricePaid',
    'totalOrderValue',
  ];
  Object.keys(obj).forEach((key: string) => {
    try {
      result[key] = keysToConvert.includes(key)
        ? JSON.parse(obj[key])
        : obj[key];
    } catch (_) {
      result[key] = obj[key];
    }
  });

  return result as productType;
}

// parses server response JSON string as paginatedProductType
export function parsePaginatedProductJSON(obj: { [key: string]: any }) {
  let result = obj;
  Object.keys(obj).forEach((key: string) => {
    try {
      if (key === 'products')
        result[key] = obj[key].map((p: any) => parseProductJSON(p));
      else result[key] = JSON.parse(obj[key]);
    } catch (_) {
      result[key] = obj[key];
    }
  });

  return result as paginatedProductType;
}
