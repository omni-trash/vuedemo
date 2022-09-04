import api from './apibase';
import * as models from './models';

export default {
  loggedinuser: () => api.GET<models.User>("loggedinuser"),
  contracts: () => api.GET<models.Contract[]>("contracts"),
  products: () => api.GET<models.Product[]>("products"),
  addProduct: (product: models.Product) => api.POST<models.Product, void>('products', product),
  updateProduct: (product: models.Product) => api.PATCH<models.Product, void>(`products/${product.id}`, product),
  deleteProduct: (productId: number) => api.DELETE(`products/${productId}`),
}
