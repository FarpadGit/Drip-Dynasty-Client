// formats productType objects to network sendable FormData
export function productToFormData(product: productType) {
  const formData = new FormData();
  formData.append('id', product.id);
  formData.append('name', product.name);
  formData.append('slug', product.slug);
  formData.append('description', product.description);
  formData.append('price', product.price.toString());
  formData.append('discount', product.discount.toString());
  formData.append('isActive', product.isActive.toString());
  formData.append('emailMessage', product.emailMessage || '');
  product.categories?.forEach((cat) => formData.append('categories[]', cat));
  product.variants?.forEach((variant, i) =>
    formData.append(`variantsJson[${i}]`, JSON.stringify(variant)),
  );
  product.searchTags?.forEach((tag, i) =>
    formData.append(`searchTagsJson[${i}]`, JSON.stringify(tag)),
  );
  if (product.defaultStock != undefined)
    formData.append('defaultStock', product.defaultStock.toString());
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
  if (order.variants)
    order.variants.forEach((variant, i) => {
      formData.append(`variantsJson[${i}]`, JSON.stringify(variant));
    });

  return formData;
}

// parses server response JSON string as productType
export function parseProductJSON(obj: { [key: string]: any }) {
  const keysToConvert: (keyof productType)[] = [
    'price',
    'discount',
    'defaultStock',
    'isActive',
  ];
  return parseJSON<productType>(obj, keysToConvert);
}

// parses server response JSON string as paginatedProductType
export function parsePaginatedProductJSON(obj: { [key: string]: any }) {
  let result = {} as { [key: string]: any };
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

export function parseCustomerJSON(obj: { [key: string]: any }) {
  const keysToConvert: (keyof customerType)[] = ['totalOrderValue'];
  return parseJSON<customerType>(obj, keysToConvert);
}

export function parseOrderJSON(obj: { [key: string]: any }) {
  const keysToConvert: (keyof orderType)[] = ['pricePaid'];
  return parseJSON<orderType>(obj, keysToConvert);
}

function parseJSON<T>(obj: { [key: string]: any }, keysToConvert: (keyof T)[]) {
  let result = {} as Partial<T>;

  Object.keys(obj).forEach((key: string) => {
    try {
      if (typeof obj[key] === 'object') result[key as keyof T] = obj[key];
      else if (keysToConvert.includes(key as keyof T))
        result[key as keyof T] = JSON.parse(obj[key]);
      else result[key as keyof T] = obj[key];
    } catch (_) {
      result[key as keyof T] = obj[key];
    }
  });

  return result as T;
}
