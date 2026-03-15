const API_BASE = "/";

const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const completedInput = document.getElementById("completed");
const errorEl = document.getElementById("error");
const taskList = document.getElementById("taskList");

const showError = (message) => {
  errorEl.textContent = message;
  errorEl.hidden = false;
};

const clearError = () => {
  errorEl.textContent = "";
  errorEl.hidden = true;
};

const safeFetch = async (url, options) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || res.statusText);
  }
  return res.json();
};

const buildTaskElement = (task) => {
  const container = document.createElement("article");
  container.className = "task";

  const header = document.createElement("div");
  header.className = "task__header";

  const title = document.createElement("h3");
  title.textContent = task.title;

  const actions = document.createElement("div");
  actions.className = "task__actions";

  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = task.completed ? "Mark incomplete" : "Mark complete";
  toggleBtn.className = "complete";
  toggleBtn.onclick = async () => {
    try {
      clearError();
      await safeFetch(`${API_BASE}tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      await loadTasks();
    } catch (err) {
      showError(err.message);
    }
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete";
  deleteBtn.onclick = async () => {
    try {
      clearError();
      await safeFetch(`${API_BASE}tasks/${task._id}`, { method: "DELETE" });
      await loadTasks();
    } catch (err) {
      showError(err.message);
    }
  };

  actions.append(toggleBtn, deleteBtn);
  header.append(title, actions);

  container.append(header);

  if (task.description) {
    const desc = document.createElement("p");
    desc.textContent = task.description;
    container.append(desc);
  }

  const meta = document.createElement("div");
  meta.style.fontSize = "0.85rem";
  meta.style.color = "#6b7280";
  meta.textContent = `Created: ${new Date(task.createdAt).toLocaleString()}`;

  container.append(meta);
  return container;
};

const loadTasks = async () => {
  try {
    clearError();
    taskList.innerHTML = "<em>Loading tasks…</em>";
    const tasks = await safeFetch(`${API_BASE}tasks`);
    taskList.innerHTML = "";
    if (!tasks.length) {
      taskList.innerHTML = "<p>No tasks yet. Add one above.</p>";
      return;
    }

    tasks.forEach((task) => taskList.append(buildTaskElement(task)));
  } catch (err) {
    showError(err.message);
  }
};

const createTask = async (event) => {
  event.preventDefault();

  try {
    clearError();
    const payload = {
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      completed: completedInput.checked,
    };

    await safeFetch(`${API_BASE}tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    titleInput.value = "";
    descriptionInput.value = "";
    completedInput.checked = false;

    await loadTasks();
  } catch (err) {
    showError(err.message);
  }
};

taskForm.addEventListener("submit", createTask);

loadTasks().catch((err) => showError(err.message));
