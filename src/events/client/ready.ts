import Event from "../../structures/event";
import Client from "../../structures/init";

class Ready extends Event {
   client: Client;
   constructor(client: Client) {
      super(client, {
         name: "Client Ready",
         emmiter: "ready",
      });
   }

   async run() {
      console.log(`${this.client.user.tag} Ready to server.`);
   }
}

export default Ready;
