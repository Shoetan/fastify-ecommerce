import { ProductService } from "./product.service";

import { createProductSchema } from "./product.schema";

const productService = new ProductService()

async function productRoutes(server: any) {
  server.post(
    "/",
    {
      onRequest: [server.authenticate],
      schema:{
        body:createProductSchema,
        response: {
          201: createProductSchema.properties
        }
      }
    },
    productService.createProductHandler
  )
}

export default productRoutes