import cassandra from "cassandra-driver";
import { cassandraClient } from "../config";

const migration = async () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,                
    first_name text,                   
    last_name text,
    email text,                         
    phone_number text,
    password_hash text,            
    role text,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp                        
    )`,
    `CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY,             
    name text,                         
    category text,
    image_uri text,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp               
)`,
    `CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY,                   
    name text,
    description text,
    type text,
    stock int,
    images_uri list<text>,               
    price double,
    discount_price double,
    product_id UUID,                       
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp  
)`,
  ];

  try {
    for (const query of queries) {
      await cassandraClient.execute(query);
      console.log("Executed:", query);
    }
    console.log("Migration complete.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await cassandraClient.shutdown();
  }
};

migration();
