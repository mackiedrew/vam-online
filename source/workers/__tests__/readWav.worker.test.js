jest.mock("../../help/fileRead", () => ({
  readArrayBufferPromise: () => "test"
}));
import readWav from "../readWav.worker";

describe("readWav() Worker", () => {
  it("exports default", () => {
    const result = readWav;
    expect(result).toBe(undefined);
  });
});
