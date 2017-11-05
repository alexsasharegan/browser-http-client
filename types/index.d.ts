import { Client } from "./xhr/client";
export { Client };
declare const Http: {
    Client: typeof Client;
};
export default Http;
