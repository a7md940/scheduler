import { TaskScheduler } from "./task-scheduler";

describe("addTask", () => {
  test("it should not depend on it self", () => {
    const scheduler = new TaskScheduler();
    expect(() => scheduler.addTask("A", ["A"])).toThrow();
  });

  test("it should not depend on a task which is not scheduled before", () => {
    const scheduler = new TaskScheduler();
    scheduler.addTask("A");
    scheduler.addTask("B", ["A"]);
    expect(() => scheduler.addTask("I", ["Q", "W"])).toThrow();
  });
});

describe("scheduleTasks", () => {
  test("it should return the correct order of tasks to be executed", () => {
    const scheduler = new TaskScheduler();
    scheduler.addTask("A");
    scheduler.addTask("Z", ["A"]);
    scheduler.addTask("C", ["Z", "A"]);
    scheduler.addTask("B", ["C", "A"]);
    scheduler.addTask("F");
    scheduler.addTask("G", ["C", "F"]);
    expect(scheduler.scheduleTasks()).toEqual(
      expect.arrayContaining(["A", "F", "Z", "C", "B", "G"])
    );
  });
});
