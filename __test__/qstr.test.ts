import { encode_query } from "../src/encoding/qstr";

describe("encoding/qstr", async () => {
  it("should work with primitive types", async () => {
    let test = encode_query({
      string: "a string",
      number: 100,
      bool: false,
      empty: null,
    });

    // Snapshot was initially to grab value and manually check it.
    expect(test).toMatchSnapshot();
    // Snapshot value
    expect(test).toBe("string=a%20string&number=100&bool=false&empty=null");
  });

  it("should work with primitive array types", async () => {
    let test = encode_query({
      string: ["a string", "another string"],
      number: [100, 101],
      bool: [false, true],
      empty: [null, null],
      mixed: ["string", true, null, 100],
    });

    // Snapshot was initially to grab value and manually check it.
    expect(test).toMatchSnapshot();
    // Snapshot value
    expect(test).toBe(
      "string[]=a%20string&string[]=another%20string&number[]=100&number[]=101&bool[]=false&bool[]=true&empty[]=null&empty[]=null&mixed[]=string&mixed[]=true&mixed[]=null&mixed[]=100"
    );
  });

  it("should not include undefined values", async () => {
    let test = encode_query({ foo: undefined });
    expect(test).toBe("");
    expect(test).toMatchSnapshot();
  });

  it("should not include undefined values in an array", async () => {
    let test = encode_query({ foo: [undefined] });
    expect(test).toBe("");
    expect(test).toMatchSnapshot();
  });
});
