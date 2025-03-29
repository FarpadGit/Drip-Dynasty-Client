import { of } from 'rxjs';
import { customerType, orderType, productType } from '../app/types';
import { tableOptionType } from '../app/components/UI/table/table.component';

export const mockProducts: productType[] = [
  {
    id: 'product1ID',
    name: 'product1',
    description: 'description1',
    categories: ['category1'],
    price: 1,
    isActive: true,
    createdSince: 0,
    discount: 0,
    imagePaths: ['img1.jpg'],
  },
  {
    id: 'product2ID',
    name: 'product2',
    description: 'description2',
    categories: ['category2', 'category3'],
    price: 10,
    isActive: false,
    createdSince: 0,
    discount: 0,
    imagePaths: ['img2.jpg'],
  },
  {
    id: 'product3ID',
    name: 'product3',
    description: 'description3',
    categories: ['category1'],
    price: 100,
    isActive: true,
    createdSince: 10 * 24 * 60 * 60 * 1000,
    discount: 10,
    imagePaths: ['img3.jpg'],
  },
  {
    id: 'product4ID',
    name: 'product4',
    description: 'description4',
    categories: ['category4', 'category5', 'category6'],
    price: 1000,
    isActive: true,
    createdSince: 1 * 24 * 60 * 60 * 1000,
    discount: 0,
    imagePaths: ['img4.jpg'],
  },
  {
    id: 'product5ID',
    name: 'product5',
    description: 'description5',
    categories: ['category2', 'category7'],
    price: 10000,
    isActive: false,
    createdSince: 0,
    discount: 100,
    imagePaths: ['img5.jpg'],
  },
];

export const mockPaginatedProductsPage1 = mockProducts.slice(0, 3);

export const mockPaginatedProductsPage2 = mockProducts.slice(3);

export const mockProductWithDiscount = mockProducts[4];

export const mockProductWithoutDiscount = mockProducts[0];

export const mockNewProduct = mockProducts[0];

export const mockOldProduct = mockProducts[2];

export const mockNewestProducts: productType[] = [
  {
    id: 'newProduct1ID',
    name: 'new Product 1',
    description: 'description1',
    price: 1,
    isActive: true,
    createdSince: 1000,
    discount: 0,
    imagePaths: ['img1.jpg'],
  },
  {
    id: 'newProduct2ID',
    name: 'new Product 2',
    description: 'description2',
    price: 10,
    isActive: false,
    createdSince: 0,
    discount: 0,
    imagePaths: ['img2.jpg'],
  },
  {
    id: 'newProduct3ID',
    name: 'new Product 3',
    description: 'description3',
    price: 100,
    isActive: true,
    createdSince: 100,
    discount: 10,
    imagePaths: ['img3.jpg'],
  },
  {
    id: 'newProduct4ID',
    name: 'new Product 4',
    description: 'description4',
    price: 1000,
    isActive: true,
    createdSince: 1,
    discount: 0,
    imagePaths: ['img4.jpg'],
  },
  {
    id: 'newProduct5ID',
    name: 'new Product 5',
    description: 'description5',
    price: 10000,
    isActive: false,
    createdSince: 10,
    discount: 100,
    imagePaths: ['img5.jpg'],
  },
];

export const mockPopularProducts: productType[] = [
  {
    id: 'popularProduct1ID',
    name: 'popular Product 1',
    description: 'description1',
    price: 1,
    isActive: true,
    createdSince: 0,
    discount: 0,
    imagePaths: ['img1.jpg'],
  },
  {
    id: 'popularProduct2ID',
    name: 'popular Product 2',
    description: 'description2',
    price: 10,
    isActive: false,
    createdSince: 0,
    discount: 0,
    imagePaths: ['img2.jpg'],
  },
  {
    id: 'popularProduct3ID',
    name: 'popular Product 3',
    description: 'description3',
    price: 100,
    isActive: true,
    createdSince: 0,
    discount: 10,
    imagePaths: ['img3.jpg'],
  },
  {
    id: 'popularProduct4ID',
    name: 'popular Product 4',
    description: 'description4',
    price: 1000,
    isActive: true,
    createdSince: 0,
    discount: 0,
    imagePaths: ['img4.jpg'],
  },
  {
    id: 'popularProduct5ID',
    name: 'popular Product 5',
    description: 'description5',
    price: 10000,
    isActive: false,
    createdSince: 0,
    discount: 100,
    imagePaths: ['img5.jpg'],
  },
];

export const mockCustomers: customerType[] = [
  { id: 'customer1ID', email: 'customer1@email.com', orders: ['orderId1'] },
  {
    id: 'customer2ID',
    email: 'customer2@email.com',
    orders: ['orderId2', 'orderId3'],
  },
  { id: 'customer3ID', email: 'customer3@email.com', orders: ['orderId4'] },
];
export const mockOrders: orderType[] = [
  {
    id: 'order1ID',
    productId: 'product1Id',
    productName: 'product1',
    customerId: 'customer1Id',
    customerEmail: 'customer1@email.com',
    pricePaid: 100,
  },
  {
    id: 'order2ID',
    productId: 'product2Id',
    productName: 'product2',
    customerId: 'customer1Id',
    customerEmail: 'customer1@email.com',
    pricePaid: 200,
  },
  {
    id: 'order3ID',
    productId: 'product1Id',
    productName: 'product1',
    customerId: 'customer2Id',
    customerEmail: 'customer2@email.com',
    pricePaid: 100,
  },
  {
    id: 'order4ID',
    productId: 'product3Id',
    productName: 'product3',
    customerId: 'customer2Id',
    customerEmail: 'customer2@email.com',
    pricePaid: 400,
  },
];

export const mockOptions: tableOptionType[] = [
  {
    id: 'edit',
    label: 'edit',
  },
  {
    id: 'toggleActivate',
    label: 'activate',
    dialog: 'activate item?',
  },
  {
    id: 'delete',
    label: 'delete',
    styles: 'text-destructive',
  },
];

export const mockValidUser = { username: 'fakeUser', password: 'fakePass' };
export const mockInvalidUser = { username: 'badUser', password: 'badPass' };

export function getMockActivatedRoute(
  routeKey: string,
  routeValue: string,
  queryKey?: string,
  queryValue?: string
) {
  return {
    paramMap: of({
      get: (key: string) => {
        if (key === routeKey) {
          return routeValue;
        }
        return null;
      },
    }),
    queryParamMap:
      queryKey === undefined
        ? null
        : of({
            get: (key: string) => {
              if (key === queryKey) {
                return queryValue;
              }
              return null;
            },
          }),
  };
}
