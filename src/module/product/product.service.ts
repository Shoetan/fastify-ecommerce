import { FastifyReply, FastifyRequest } from "fastify";
import { ProductRepository } from "./product.repository";
import { ICreateProduct } from "./product.schema";


// create and instance of the product repository
const productRepo = new ProductRepository()

export class ProductService {
  async createProductHandler(
    request: FastifyRequest<{
      Body:ICreateProduct
    }>,
    reply:FastifyReply
  ) {
    try {
      const product = await productRepo.createProduct(request.body)
      return reply.code(201).send(product)
    } catch (error) {
      console.log(error)
      return reply.code(500).send(error)
      
    }
  }
}