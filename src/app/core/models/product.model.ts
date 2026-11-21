export type ProductCategory = 'lightstick' | 'album' | 'ropa' | 'accesorio' | 'otro';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  store: string;
  price: number | null;          // en COP, null = "Consultar precio"
  originalPrice?: number | null; // si hay descuento
  url: string;
  image?: string;
  coupon?: string;
  lastChecked: string;           // AAAA-MM-DD
}