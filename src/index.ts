import { TaskScheduler } from "./scheduler/task-scheduler";

function bootstrap() {
  const scheduler = new TaskScheduler();
  scheduler.addTask("A");
  scheduler.addTask("Z", ["A"]);
  scheduler.addTask("C", ["Z", "A"]);
  scheduler.addTask("B", ["C", "A"]);
  scheduler.addTask("F");
  scheduler.addTask("G", ["C", "F"]);
  console.log(scheduler.scheduleTasks()); // A, F, Z, C, B, G
  //   scheduler.scheduleTasks();
}
bootstrap();
