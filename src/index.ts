import dotenv from "dotenv";
dotenv.config();

import Client from "./structures/init";

const client: Client = new Client();
client.init();
