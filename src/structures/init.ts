import Loader from "../utils/loader";
import YukkuriClient from "./client";

class Client extends YukkuriClient {
   constructor() {
      super();

      this.develoers = JSON.parse(process.env.DEVELOPERS);
      this.loader = new Loader(this);
   }

   async init() {
      await this.loader.loadCommand();
      await this.loader.loadEvent();
      this.login();
   }
}

export default Client;
