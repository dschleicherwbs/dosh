import { Entrie } from "./entrie.js";
import { UI } from "./ui.js";
import { Group } from "./group.js";

class EntriesView {
  constructor() {
    this.container = document.querySelector(".container-entries");
    this.itemContainer = this.container.querySelector(".entries-items");
    this.sortBtnsContainer = this.container.querySelector(
      ".entries-header-sortBy"
    );
    this.viewBtnsContainer = this.container.querySelector(
      ".entries-header-views"
    );
    this.btnSortByDate = this.container.querySelector(
      "#entries-btn-sortBy-date"
    );
    this.btnSortByGroup = this.container.querySelector(
      "#entries-btn-sortBy-group"
    );
    this.btnSortByIsDone = this.container.querySelector(
      "#entries-btn-sortBy-isDone"
    );
    this.btnViewGrid = this.container.querySelector("#entries-btn-view-grid");
    this.btnViewRow = this.container.querySelector("#entries-btn-view-row");
    this.isSortByIsDoneSelected = true;
    this.initialize();
  }

  initialize() {
    this.addEventListenertoBtns();
    this.btnSortByDate.click();
    UI.selectItem(this.btnViewRow);
    this.hideIsDone();
  }

  refreshItems(items) {
    while (this.itemContainer.firstChild) {
      this.itemContainer.firstChild.remove();
    }
    this.addItems(items);
  }

  onAddTask() {
    const sortBySelection = UI.getSelectedItem(this.sortBtnsContainer).value;
    if (sortBySelection === "date") this.btnSortByDate.click();
    else if (sortBySelection === "groups") this.btnSortByGroup.click();
  }

  clearItems() {
    UI.clearItems(this.itemContainer);
  }

  addItems(items) {
    Array.from(items).forEach(item => {
      const template = this.getItemTemplate(item);
      this.addItem(template);
    });
  }

  getItemTemplate(item) {
    const template = item.getTemplate();
    return template;
  }

  addItemsByDate(items) {
    let day = "";
    Array.from(items).forEach(item => {
      if (day != item.day) {
        day = item.day;
        const dayTemplate = document.createElement("h4");
        dayTemplate.textContent = day;
        dayTemplate.className = "entries-items-title";
        this.addItem(dayTemplate);
      }
      const template = this.getItemTemplate(item);
      this.addItem(template);
    });
  }

  addItemsByGroup(items) {
    let group = "";
    Array.from(items).forEach(item => {
      if (group != item.group.id) {
        group = item.group.id;
        const groupTemplate = document.createElement("div");
        const txt = document.createElement("h4");
        txt.textContent = item.group.name;
        groupTemplate.style.color = Group.createFontColor(item.group.color);
        groupTemplate.style.backgroundColor = Group.createBgColor(
          item.group.color
        );
        groupTemplate.appendChild(txt);
        groupTemplate.className = "entries-items-title";
        this.addItem(groupTemplate);
      }
      const template = this.getItemTemplate(item);

      this.addItem(template);
    });
  }

  addItem(item) {
    if (this.itemContainer.firstChild) {
      this.itemContainer.appendChild(item);
    } else {
      this.itemContainer.insertBefore(item, this.itemContainer.firstChild);
    }
  }

  onClickSortByDate(e) {
    let sortedItems = [];
    if (!UI.isItemSelected(e)) {
      UI.deselectItem(this.btnSortByGroup);
      UI.selectItem(e);
    }
    const items = this.getFilteredItems();
    sortedItems = this.sortByDate(items);
    this.clearItems();

    this.addItemsByDate(items);
    if (!UI.isItemSelected(this.btnSortByIsDone)) this.hideIsDone();
  }

  sortByDate(items) {
    return items.sort((a, b) =>
      Entrie.dayToValue(a.day) > Entrie.dayToValue(b.day) ? 1 : -1
    );
  }

  onClickSortByGroup(e) {
    let sortedItems = [];
    if (!UI.isItemSelected(e)) {
      UI.deselectItem(this.btnSortByDate);
      UI.selectItem(e);
    }
    const items = this.getFilteredItems();
    sortedItems = this.sortByGroup(items);
    this.clearItems();
    this.addItemsByGroup(sortedItems);
    if (!UI.isItemSelected(this.btnSortByIsDone)) this.hideIsDone();
  }

  sortByGroup(items) {
    items.sort((a, b) => (a.group.id > b.group.id ? 1 : -1));
    return items.sort((a, b) => (a.group.id > b.group.id ? 1 : -1));
  }

  onClickSortByIsDone(e) {
    if (UI.isItemSelected(e)) this.hideIsDone();
    else this.showIsDone();
    UI.toggleselection(e);
  }

  sortByIsDone(items) {
    return items.sort((a, b) => (a.isDone > b.isDone ? 1 : -1));
  }

  hideIsDone() {
    const items = this.itemContainer.querySelectorAll(".entries-item");
    items.forEach(item =>
      item.dataset.isDone == "true" ? (item.style.display = "none") : 0
    );
    let firstItem = true;
    let hasNoActiveItems = true;
    let currentTitle = "";
    this.itemContainer.childNodes.forEach(item => {
      if (item.classList.contains("entries-items-title")) {
        if (firstItem) {
          currentTitle = item;
          firstItem = false;
        } else {
          if (hasNoActiveItems) {
            currentTitle.style.display = "none";
          }
          hasNoActiveItems = true;
          currentTitle = item;
        }
      }
      if (item.dataset.isDone == "false") {
        hasNoActiveItems = false;
      }
    });
    if (hasNoActiveItems) {
      currentTitle.style.display = "none";
    }
  }

  showIsDone() {
    const items = this.itemContainer.querySelectorAll(".entries-item");
    const itemsTitel = this.itemContainer.querySelectorAll(
      ".entries-items-title"
    );
    itemsTitel.forEach(item => (item.style.display = "inline-block"));
    items.forEach(item =>
      item.dataset.isDone == "true" ? (item.style.display = "flex") : 0
    );
  }
  getFilteredItems() {
    return Entrie.getItems();
  }

  getAllSortBtns() {
    return this.sortBtnsContainer.querySelectorAll("button");
  }

  setGridView(e) {
    const btn = e.classList.contains("btn") ? e : e.parentElement;
    UI.deselectItems(this.viewBtnsContainer);
    UI.selectItem(btn);
    this.itemContainer.classList.add("view-grid");
  }
  setRowView(e) {
    const btn = e.classList.contains("btn") ? e : e.parentElement;
    UI.deselectItems(this.viewBtnsContainer);
    UI.selectItem(btn);
    this.itemContainer.classList.remove("view-grid");
  }

  onItemContainerClick(e) {
    if (
      e.target.classList.contains("container-entries") ||
      e.target.classList.contains("entries-items-title") ||
      e.target.classList.contains("entries-items")
    ) {
      UI.deselectItems(this.itemContainer, "entries-item");
    }
  }

  addEventListenertoBtns() {
    this.container.addEventListener("click", e => this.onItemContainerClick(e));

    this.btnSortByDate.addEventListener("click", e =>
      this.onClickSortByDate(e.target)
    );
    this.btnSortByGroup.addEventListener("click", e =>
      this.onClickSortByGroup(e.target)
    );
    this.btnSortByIsDone.addEventListener("click", e =>
      this.onClickSortByIsDone(e.target)
    );
    this.btnViewGrid.addEventListener("click", e => this.setGridView(e.target));
    this.btnViewRow.addEventListener("click", e => this.setRowView(e.target));
  }
}

export { EntriesView };
