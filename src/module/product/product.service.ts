import { FastifyReply, FastifyRequest } from "fastify";
import { ProductRepository } from "./product.repository";
import { ICreateProduct, ICreateProductVariant } from "./product.schema";
import { cloudinaryHandler } from "../../utils/cloudinary";

const productRepo = new ProductRepository();

export class ProductService {
  async createProductHandler(
    request: FastifyRequest<{
      Body: ICreateProduct;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { name, category, product_image } = request.body;

      const result = await cloudinaryHandler(
        product_image,
        "fastify-ecommerce"
      );

      const payload = {
        name,
        category,
        image_uri: result.secure_url,
      };
      const product = await productRepo.createProduct(payload);
      return reply.code(201).send(product);
    } catch (error) {
      console.log(error);
      return reply.code(500).send(error);
    }
  }

  async createProductVariantHandler(
    request: FastifyRequest<{
      Body: ICreateProductVariant;
    }>,
    reply: FastifyReply
  ) {
    try {
      const {
        name,
        description,
        type,
        stock,
        price,
        discount_price,
        product_id,
        images,
      } = request.body;

      const uploadedImages = await Promise.all(
        images.map((image: string) =>
          cloudinaryHandler(image, "fastify-ecommerce")
        )
      );

      const uploadedImageUris = uploadedImages.map((res) => res.secure_url);

      const payload = {
        name,
        description,
        type,
        stock: +stock,
        price: +price,
        discount_price: +discount_price,
        product_id,
        images_uri: uploadedImageUris,
      };

      const productVariant = await productRepo.createProductVariant(payload);
      return reply.code(201).send(productVariant);
    } catch (error) {
      console.log(error);
      return reply.code(500).send(error);
    }
  }

  async getProductByIdHandler(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;

      const product = await productRepo.getProductById(id);

      if (!product) {
        return reply.code(404).send({ message: "Product not found" });
      }

      return reply.code(200).send(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      return reply.code(500).send({ message: "Failed to fetch product" });
    }
  }
}
