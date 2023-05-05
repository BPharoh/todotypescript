interface Task {
    task: string;
    value: HTMLInputElement | null;
    completed: boolean;
  }
  
  window.onload = getTasks;
  
  document.querySelector("form")!.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    insertTask();
  });
  
  
  
  function getTasks(): void {
    const tasksJson = localStorage.getItem("tasks");
    if (tasksJson == null) return;
  
    const tasks: Task[] = JSON.parse(tasksJson);
  
    tasks.forEach((task: Task) => {
      const list = document.querySelector("ul")!;
      const li = document.createElement("li");
      li.innerHTML = `<input type="checkbox" onclick="finishedTask(this)" class="check" ${
        task.completed ? "checked" : ""
      }>
            <input type="text" value="${task.task}" class="task ${
        task.completed ? "completed" : ""
      }" onfocus="getCurrentTask(this)" onblur="changeTask(this)">
            <i class="fa fa-trash" onclick="deleteTask(this)"></i>`;
      list.insertBefore(li, list.children[0]);
    });
  }
  
  function insertTask(): boolean {
    const taskInput = document.querySelector("form input")!;
    const list = document.querySelector("ul")!;
  
    if (taskInput.value   === "") {
      alert("Please add some task!");
      return false;
    }
  
    if (document.querySelector(`input[value="${taskInput.value}"]`)) {
      alert("Task already exists!");
      return false;
    }
  
    const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
    const newTask: Task = { task: taskInput.value, completed: false };
    localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]));
  
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" onclick="finishedTask(this)" class="check">
        <input type="text" value="${newTask.task}" class="task" onfocus="getCurrentTask(this)" onblur="changeTask(this)">
        <i class="fa fa-trash" onclick="deleteTask(this)"></i>`;
    list.insertBefore(li, list.children[0]);
  
    taskInput.value = "";
    return true;
  }
  
  function finishedTask(event: HTMLInputElement): void {
    const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.forEach((task: Task) => {
      if (task.task === event.nextElementSibling!.value) {
        task.completed = !task.completed;
      }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    event.nextElementSibling!.classList.toggle("completed");
  }
  
  function deleteTask(event: HTMLElement): void {
    const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.forEach((task: Task) => {
      if (task.task === event.parentNode!.children[1].value) {
        tasks.splice(tasks.indexOf(task), 1);
      }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    event.parentElement!.remove();
  }
  
  let currentTask: string | null = null;
  
  function getCurrentTask(event: HTMLInputElement): void {
    currentTask = event.value;
  }
  
  function changeTask(event: HTMLInputElement): void {
    const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
  
    if (event.value === "") {
      alert("Task is empty!");
      event.value = currentTask!;
      return;
    }
  
    tasks.forEach((task: Task) => {
      if (task.task === event.value) {
        alert("Task already exists!");
        event.value = currentTask!;
        return;
      }
    });
  
    tasks.forEach(task => {
      if (task.task === currentTask) {
        task.task = event.value;
      }
    });
   
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  
  