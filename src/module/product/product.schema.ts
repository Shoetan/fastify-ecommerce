export const createProductSchema = {
  type:"object",
  properties:{
    name:{type: "string"},
    category:{type: "string"},
    image_uri:{type: "string"},
  },
  required: ["name", "category"]
}

export interface ICreateProduct {
  name: string;
  category: string;
  image_uri: string;
}