import Client from "./init";
import { EventInterface } from "./interface/EventInterface";

class Event {
   client: Client;
   data: EventInterface;
   constructor(client: Client, data: EventInterface) {
      this.client = client;
      this.data = data;
   }

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   async load(...args: any) {
      this.run(...args).catch((er) => console.error(er));
   }

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   async run(...args) {
      throw new Error("Error while running event");
   }
}

export default Event;
