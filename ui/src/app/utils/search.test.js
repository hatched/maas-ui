import { getMachineValue } from "./search";

describe("getMachineValue", () => {
  it("can get an attribute via a mapping function", () => {
    expect(getMachineValue({ hostname: "machine1" }, "hostname")).toBe(
      "machine1"
    );
  });

  it("can get an attribute directly from the machine", () => {
    expect(getMachineValue({ id: 808 }, "id")).toBe(808);
  });

  it("can get a workload annotation value", () => {
    expect(
      getMachineValue(
        { workload_annotations: { type: "production" } },
        "workload-type"
      )
    ).toBe("production");
  });
});
