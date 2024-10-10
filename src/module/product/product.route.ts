import { ProductService } from "./product.service";

import {
  createProductSchema,
  createProductVariantSchema,
} from "./product.schema";

const productService = new ProductService();

async function productRoutes(server: any) {
  server.post(
    "/",
    {
      onRequest: [server.authenticate],
      schema: {
        body: createProductSchema,
        response: {
          201: createProductSchema.properties,
        },
      },
    },
    productService.createProductHandler
  );

  server.post(
    "/variant",
    {
      onRequest: [server.authenticate],
      schema: {
        body: createProductVariantSchema,
        response: {
          201: createProductVariantSchema.properties,
        },
      },
    },
    productService.createProductVariantHandler
  );

  server.get("/:id", productService.getProductByIdHandler);
  server.get("/", productService.getAllProductHandler);

  server.patch(
    "/",
    {
      onRequest: [server.authenticate],
      schema: {
        body: createProductSchema,
        response: {
          200: createProductSchema.properties,
        },
      },
    },
    productService.updateProductHandler
  );
}

export default productRoutes;
