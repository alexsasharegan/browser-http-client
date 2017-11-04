import { Client } from "./xhr/client";
import { Status } from "./xhr/status";
import { ContentType } from "./xhr/contentType";
export { Client, Status, ContentType };
declare const Http: {
    Client: typeof Client;
    Status: typeof Status;
    ContentType: {
        json: string;
        text: string;
        html: string;
        form: string;
        multipart: string;
        stream: string;
    };
};
export default Http;
