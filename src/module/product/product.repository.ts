import { cassandraClient } from "../../config";
import { v4 as uuidv4 } from "uuid";

export class ProductRepository {
  async createProduct(data: Record<string, any>) {
    const query = `INSERT INTO products (id, name, category, image_uri, created_at) VALUES (?, ?, ?, ?, toTimestamp(now()))`;

    const productId = uuidv4();

    const values = [productId, data.name, data.category, data.image_uri];

    try {
      await cassandraClient.execute(query, values, { prepare: true });
      return {
        message: `Product created successfully`,
        data: {
          id: productId,
          name: data.name,
          category: data.category,
          image_uri: data.image_uri,
          created_at: new Date(),
        },
      };
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  }

  async createProductVariant(data: Record<string, any>) {
    const variantId = uuidv4();

    const query = `INSERT INTO product_variants 
  (id, name, description, type, stock, images_uri, price, discount_price, product_id, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, toTimestamp(now()), toTimestamp(now()))`;

    const values = [
      variantId,
      data.name,
      data.description,
      data.type,
      data.stock,
      data.images_uri,
      data.price,
      data.discount_price,
      data.product_id,
    ];

    try {
      await cassandraClient.execute(query, values, { prepare: true });

      return {
        message: `Product Variant created successfully`,
        data: {
          id: variantId,
          name: data.name,
          description: data.description,
          type: data.type,
          stock: data.stock,
          images_uri: data.images_uri,
          price: data.price,
          discount_price: data.discount_price,
          product_id: data.product_id,
          created_at: new Date(),
        },
      };
    } catch (error) {
      console.error("Failed to create product variant:", error);
      throw error;
    }
  }

  async getProductById(productId: string) {
    const productQuery = `SELECT * FROM products WHERE id = ? ALLOW FILTERING`;
    const productResult = await cassandraClient.execute(
      productQuery,
      [productId],
      { prepare: true }
    );

    if (productResult.rowLength === 0) {
      return null;
    }

    const product = productResult.rows[0];

    const variantsQuery = `SELECT * FROM product_variants WHERE product_id = ? ALLOW FILTERING`;
    const variantsResult = await cassandraClient.execute(
      variantsQuery,
      [productId],
      { prepare: true }
    );

    product.variants = variantsResult.rows;

    return product;
  }

  async getAllProducts() {
    const productQuery = `SELECT * FROM products`;

    const productResult = await cassandraClient.execute(productQuery)
    if (productResult.rowLength === 0){
      return null
    }

    const products = productResult.rows

    return products

  }

  async updateProduct(data: Record<string, any>){
    const productUpdateQuery = `
      UPDATE products 
      SET name = ?, category = ?, image_uri = ?, updated_at = toTimestamp(now()) 
      WHERE id = ?;
    `;

    const values = [
      data.name,
      data.category,
      data.image_uri,
      data.productId
    ]
    
    // Execute the query, binding the positional parameters
    const productResult = await cassandraClient.execute(
      productUpdateQuery, 
      values,  // bind parameters in order
      { prepare: true }
    );
  
    return productResult;
  }
  

}
