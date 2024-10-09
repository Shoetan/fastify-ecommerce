import { types } from "cassandra-driver";
import { cassandraClient } from "../../config";
import { v4 as uuidv4 } from "uuid";


export class ProductRepository {
  async createProduct(data: Record<string, any>) {

    const query = `INSERT INTO products (id, name, category, image_uri) VALUES (?, ?, ?, ?)`;

    const productId = uuidv4()

    const values = [
      productId,
      data.name,
      data.category,
      data.image_uri 
    ]

    try {
      await cassandraClient.execute(query, values, {prepare:true})
      return {
        message:`Product created successfully`,
        data:{
          id:productId,
          name:data.name,
          category:data.category,
          image_uri:data.image_uri
        }
      }
    } catch (error) {
      console.error("Failed to create user:", error)
      throw error
      
    }


  }
}