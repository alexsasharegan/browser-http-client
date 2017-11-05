import { Client } from "./xhr/client";
import { Status } from "./xhr/status";
export { Client, Status };
declare const Http: {
    Client: typeof Client;
    Status: typeof Status;
};
export default Http;
