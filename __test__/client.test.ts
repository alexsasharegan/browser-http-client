import { Client } from "../src/index";
import { RequestErrType } from "../src/xhr/client";

const base = `https://jsonplaceholder.typicode.com`;
const mock = {
  url: suffix => base + suffix,
  wait: ms => new Promise(resolve => setTimeout(resolve, ms)),
};
Client.Timeout = 1500;

interface Geo {
  lat: string;
  lng: string;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

describe("Client", async () => {
  it("should exist", async () => {
    expect(Client).toBeDefined();
  });

  it("should make a GET request", async () => {
    let result = await Client.get<User[]>(mock.url("/users"));
    expect(result.unwrap().data).toMatchSnapshot();
    expect(result.unwrap().data[0].id).toBeDefined();
    expect(typeof result.unwrap().data[0].id == "number").toBe(true);
    expect(typeof result.unwrap().data[0].name == "string").toBe(true);
  });

  it("should abort with cancel token", async () => {
    let request = Client.create("GET", mock.url("/posts"));
    let cancel = request.getCancelToken();

    enum Code {
      Abort = 1,
      HttpStatusErr = 2,
      Timeout = 3,
      XhrErr = 4,
    }

    // Spawn off the request
    let p1 = request.send();
    let p2 = request.send();
    // Cancel it right away
    cancel();
    // Await the promise that was canceled
    let result = await p1;

    expect(result.is_err()).toBe(true);
    // extract the wrapped error value
    let err = result.unwrap_err();
    expect(err.type).toBe(RequestErrType.Abort);
    expect(
      err.match({
        Abort: () => Code.Abort,
        HttpStatusErr: () => Code.HttpStatusErr,
        Timeout: () => Code.Timeout,
        XhrErr: () => Code.XhrErr,
      })
    ).toBe(Code.Abort);

    // Check the promises are the same
    expect(p1).toBe(p2);
  });
});
