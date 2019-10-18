import { Store } from "./store.js";
import { Helper } from "./helper.js";

class Group {
  constructor(name, color, id = Store.getNewId("groupsId")) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.active = true;
  }

  getBgColor() {
    return Helper.lightenColor(this.color, 30);
  }

  getFontColor() {
    return Helper.lightenColor(this.color, -70);
  }

  getTemplate() {
    const item = document.createElement("button");
    const deleteBtn = document.createElement("div");
    item.dataset.id = this.id;
    item.dataset.color = this.color;
    item.dataset.name = this.name;

    item.className = "btn btn-selective groups-item";

    item.textContent = this.name;
    item.style.backgroundColor = this.getBgColor();
    item.style.color = this.getFontColor();
    item.style.borderColor = this.getFontColor();

    deleteBtn.textContent = "x";
    deleteBtn.className = "btn-circle btn-danger groups-item-delete-btn hidden";

    item.appendChild(deleteBtn);
    return item;
  }

  getFilterTemplate(count) {
    const item = document.createElement("button");
    const counter = document.createElement("div");
    item.dataset.id = this.id;
    item.dataset.color = this.color;
    item.dataset.name = this.name;

    item.className = "btn btn-selective filter-item";

    item.textContent = this.name;
    item.style.backgroundColor = this.getBgColor();
    item.style.color = this.getFontColor();
    item.style.borderColor = this.getFontColor();

    counter.textContent = count;
    counter.className = "btn-circle btn-light filter-item-counter";

    item.appendChild(counter);

    return item;
  }

  remove() {
    Store.removeById(Group.getPath(), this.id);
  }

  save() {
    Store.save(Group.getPath(), this);
  }

  static editItem(item) {
    Store.editById(Group.getPath(), item);
  }

  static removeGroupById(id) {
    Store.removeById(Group.getPath(), id);
  }

  static getItemById() {
    const item = Store.getById(Group.getPath(), id);
    return new Group(item.id, item.name, item.color, item.active);
  }

  static getItems() {
    const items = Store.load(Group.getPath());
    const groupItems = [];
    items.forEach(item =>
      groupItems.push(new Group(item.name, item.color, item.id))
    );
    return groupItems;
  }

  static getPath() {
    return "groups";
  }

  static createBgColor(color) {
    return Helper.lightenColor(color, 30);
  }

  static createFontColor(color) {
    return Helper.lightenColor(color, -70);
  }
}

export { Group };
