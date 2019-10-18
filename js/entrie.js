import { Store } from "./store.js";
import { Group } from "./group.js";
import { UI } from "./ui.js";
import { Alerts, alertType } from "./alerts.js";

class Entrie {
  constructor(
    name,
    group,
    day,
    id = Store.getNewId("entriesId"),
    isDone = false
  ) {
    this.name = name;
    this.group = new Group(group.name, group.color, group.id);
    this.id = id;
    this.day = day;
    this.isDone = isDone;
    this.dateAddet = new Date(Date.now());
  }

  onDeleteClick(e) {
    e.remove();
    this.remove();
    const msg = "Task deleted";
    const confirmAlert = new Alerts(msg, alertType.success);
    confirmAlert.show();
  }

  onIsDoneClick(e, btn) {
    this.isDone = !this.isDone;

    if (this.isDone) {
      e.classList.add("isDone");
      UI.selectItem(btn);
    } else {
      e.classList.remove("isDone");
      UI.deselectItem(btn);
    }
    e.dataset.isDone = this.isDone;
    if (e.classList.contains("selected")) {
      e.classList.remove("selected");
    }
    btn.blur();
    this.edit();
  }

  save() {
    Store.save(Entrie.getPath(), this);
  }

  remove() {
    Store.removeById(Entrie.getPath(), this.id);
  }

  edit() {
    Store.editById(Entrie.getPath(), this);
  }

  onItemClick(e, item) {
    if (!e.target.classList.contains("btn")) {
      if (item.classList.contains("selected")) {
        UI.deselectItem(item);
      } else {
        UI.deselectItems(item.parentElement, item.classList[0]);
        UI.selectItem(item);
      }
    }
  }

  onEditClick(item) {
    item.parentElement.childNodes.forEach(item =>
      item.classList.remove("edit-mode")
    );
    item.classList.add("edit-mode");
  }

  getTemplate() {
    const item = document.createElement("div");
    const header = document.createElement("div");
    const title = document.createElement("h2");
    const group = document.createElement("div");
    const body = document.createElement("div");
    const footer = document.createElement("div");
    const bottomSpan = document.createElement("div");
    const selectionContainer = document.createElement("div");
    const btnDelete = document.createElement("button");
    const btnEdit = document.createElement("button");
    const btnTogglDone = document.createElement("button");

    item.dataset.id = this.id;
    item.dataset.isDone = this.isDone;
    item.dataset.day = this.day;
    item.dataset.groupId = this.group.id;
    item.dataset.dateAddet = this.dateAddet;
    item.addEventListener("click", e => this.onItemClick(e, item));
    item.className = "entries-item";

    group.className = "entries-item-group";
    group.textContent = this.group.name;
    group.style.backgroundColor = this.group.getBgColor();
    group.style.color = this.group.getFontColor();
    group.style.borderColor = this.group.getFontColor();

    title.textContent = this.name;
    header.className = "entries-item-header";
    header.appendChild(group);
    header.appendChild(title);

    body.className = "entries-item-body";

    bottomSpan.className = "entries-item-bottom-span";
    bottomSpan.style.backgroundColor = this.group.getBgColor();

    footer.textContent = this.day;
    footer.className = "entries-item-footer";

    btnDelete.className =
      "btn btn-tsp btn-icon entries-item-selection-btn item-delete";
    btnDelete.value = "delete";
    btnDelete.textContent = "delete_outline";
    btnDelete.addEventListener("click", e => this.onDeleteClick(item));
    btnEdit.className =
      "btn btn-tsp btn-icon entries-item-selection-btn item-edit";
    btnEdit.value = "edit";
    btnEdit.textContent = "edit";
    btnEdit.addEventListener("click", e => this.onEditClick(item));
    btnTogglDone.className =
      "btn btn-tsp btn-icon entries-item-selection-btn item-isDone";
    btnTogglDone.value = "isDone";
    btnTogglDone.textContent = "done";
    btnTogglDone.addEventListener("click", e =>
      this.onIsDoneClick(item, btnTogglDone)
    );

    selectionContainer.className = "entries-item-selection";
    selectionContainer.style.backgroundColor = this.group.getBgColor();
    selectionContainer.appendChild(btnTogglDone);
    selectionContainer.appendChild(btnEdit);
    selectionContainer.appendChild(btnDelete);
    if (this.isDone) {
      btnTogglDone.classList.add("selected");
      item.classList.add("isDone");
    }

    item.appendChild(header);
    item.appendChild(body);
    item.appendChild(footer);
    item.appendChild(bottomSpan);
    item.appendChild(selectionContainer);
    return item;
  }

  static editItem(item) {
    Store.editById(Entrie.getPath(), item);
  }

  static removeGroupById(id) {
    Store.removeById(Entrie.getPath(), id);
  }

  static getItems() {
    const items = Store.load(Entrie.getPath());
    const entrieItems = [];
    items.forEach(item =>
      entrieItems.push(
        new Entrie(item.name, item.group, item.day, item.id, item.isDone)
      )
    );
    return entrieItems;
  }

  static getItemById(id) {
    const item = Store.getById(Entrie.getPath(), id);
    return new Entrie(item.name, item.group, item.day, item.id, item.isDone);
  }

  static getPath() {
    return "entries";
  }

  static dayToValue(day) {
    let value = 0;
    switch (day) {
      case "today":
        value = 0;
        break;
      case "tomorrow":
        value = 1;
        break;
      case "nextWeek":
        value = 2;
        break;
      case "later":
        value = 3;
        break;

      default:
        break;
    }
    return value;
  }
}

export { Entrie };
