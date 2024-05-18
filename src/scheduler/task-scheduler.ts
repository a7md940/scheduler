export class TaskScheduler {
  private _tasks: Map<
    string,
    { name: string; deps: string[]; duration: number }
  > = new Map();

  addTask(
    name: string,
    dependencies: string[] = [],
    duration: number = 1
  ): void {
    if (this._tasks.has(name)) {
      throw new Error(`Task with name=${name} is already scheduled`);
    }
    if (dependencies.includes(name)) {
      throw new Error(
        `Circular dependency detected while adding task with name=${name} + dependency ${name}`
      );
    }

    for (const dep of dependencies) {
      const task = this._tasks.get(dep);
      if (!task) {
        throw new Error(`Task with name=${dep} not scheduled`);
      }

      if (task.deps.includes(name)) {
        throw new Error(
          `Circular dependency detected while adding task with name=${name} + dependency ${task.name}`
        );
      }
      const depTree = this.resolve(task.name);

      if (
        depTree
          .flat()
          .flat()
          .filter((depName) => depName != task.name)
          .includes(task.name)
      ) {
        throw new Error(
          `Circular dependency detected while adding task with name=${name} + dependency ${task.name}`
        );
      }
    }

    this._tasks.set(name, { name, deps: dependencies, duration });
  }

  scheduleTasks() {
    const tasks = Array.from(this._tasks.keys()).map((name) =>
      this.resolve(name)
    );

    const orderedTrees = tasks.sort((a, b) => {
      const totalLengthA = a.reduce((state, item) => state + item.length, 0);
      const totalLengthB = b.reduce((state, item) => state + item.length, 0);

      return totalLengthA - totalLengthB;
    });
    return Array.from(new Set(Array.from(new Set(orderedTrees.flat())).flat()));
  }

  resolve(name: string): string[][] {
    const task = this._tasks.get(name);
    if (!task) {
      throw new Error(`task ${name} is not scheduled`);
    }

    if (task.deps.length === 0) {
      return [[task.name]];
    }

    const taskTree: string[][] = [];

    task.deps.forEach((dep) => {
      const depTask = this._tasks.get(dep);
      if (!depTask) {
        throw new Error(`task ${name} is not scheduled`);
      }
      if (depTask.deps.length === 0) {
        taskTree.push([depTask.name, task.name]);
      } else {
        taskTree.push(...this.resolve(depTask.name));
      }
    });

    return taskTree;
  }
}
