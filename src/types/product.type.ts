import { Category } from "./category.type";

export type Product = {
  id: number;
  image: string;
  banner: string;
  schedule: string;
  location: string,
  name: string;
  price: number;
  discount: number;
  categoryId: string;
  category: Category;
  description: string;
};
