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
    created_at timestamp,              
    role text                       
    )`,
    `CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY,             
    name text,                         
    category text,
    image_uri text                     
)`,
    `CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY,                   
    name text,
    description text,
    size text,
    flavour text,
    type text,
    stock int,
    stock_alert_limit int,
    is_enabled boolean,
    images_uri list<text>,               
    created_at timestamp,
    deleted_at timestamp,
    selling_price double,
    cost_price double,
    discount_price double,
    packaging_cost double,
    labelling_cost double,
    product_id UUID,                       
    product_name text,                    
    product_category text                 
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
