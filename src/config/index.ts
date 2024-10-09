import { config } from "dotenv";
import cassandra from "cassandra-driver";
config();

export const appConfig = {
  port: process.env.PORT || 5500,
  node_env: process.env.NODE_ENV,
  jwt_secret: process.env.JWT_SECRET || `some_secret`,
};

export const loggerConfig = {
  production: true,
  development: {
    transport: {
      target: "pino-pretty",
    },
  },
};

export const cassandraClient = new cassandra.Client({
  contactPoints: ["localhost"],
  localDataCenter: "datacenter1",
  keyspace: "ecommerce",
});

export const connectDB = async () => {
  try {
    await cassandraClient.connect();
    console.log("Connected to ScyllaDB");
  } catch (error) {
    console.error("Failed to connect to ScyllaDB", error);
  }
};
