export const createProductSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    category: { type: "string" },
  },
  required: ["name", "category"],
  additionalProperties: true,
};

export interface ICreateProduct {
  name: string;
  category: string;
  product_image: string;
}

export const createProductVariantSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
  },
  required: ["name"],
  additionalProperties: true,
};

export interface ICreateProductVariant {
  name: string;
  description: string;
  type: string;
  stock: number;
  price: number;
  discount_price: number;
  product_id: string;
  images: string[];
}
