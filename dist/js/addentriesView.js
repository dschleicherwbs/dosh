import { UI } from "./ui.js";
import { Alerts, alertType } from "./alerts.js";
import { Entrie } from "./entrie.js";
import { Group } from "./group.js";

class AddEntriesView {
  constructor() {
    this.container = document.querySelector(".container-addentries");
    this.inputName = this.container.querySelector("#addentries-input-name");

    this.btnAdd = this.container.querySelector("#addentries-btn-add");
    this.btnEdit = this.container.querySelector("#addentries-btn-edit");
    this.btnCancel = this.container.querySelector("#addentries-btn-cancel");

    this.editBtnContainer = this.container.querySelector(
      ".addentries-form-edit-btns"
    );
    this.daysContainer = this.container.querySelector(".addentries-days");
    this.skeletonContainer = this.container.querySelector(
      ".addentries-form-skeleton"
    );
    this.skeletonDay = this.skeletonContainer.querySelector(
      ".entries-item-footer"
    );
    this.skeletonSpan = this.skeletonContainer.querySelector(
      ".entries-item-bottom-span"
    );
    this.skeletonGroup = this.skeletonContainer.querySelector(
      ".entries-item-group"
    );
    this.dayBtns = this.daysContainer.querySelectorAll(".btn-selective");

    this.selectedGroup = this.getSelectedGroup();
    this.itemInEditMode = null;

    this.alertItemAdded = new Alerts("Task addet", alertType.success);
    this.alertItemEdited = new Alerts("Task edited", alertType.success);
    this.alertInvalidInput = new Alerts("Fill all Fields", alertType.danger);
    this.initialize();
  }

  initialize() {
    this.addAllEventListener();
    this.daysContainer.querySelector(".btn").click();
    this.initializeSkeleton();
  }

  onEditClick(id) {
    const item = Entrie.getItemById(id);
    this.itemInEditMode = item;

    this.skeletonGroup.style.backgroundColor = item.group.color;
    this.skeletonSpan.style.backgroundColor = item.group.color;
    this.skeletonGroup.textContent = item.group.name;
    this.inputName.value = item.name;
    this.inputName.focus();
    UI.deselectItems(this.daysContainer);
    this.dayBtns.forEach(day =>
      day.value === item.day ? UI.selectItem(day) : 0
    );
    UI.hideElement(this.btnAdd);
    UI.showElement(this.editBtnContainer);
  }

  onGroupSelectionChange() {
    this.selectedGroup = this.getSelectedGroup();
    this.initializeSkeleton();
  }

  initializeSkeleton() {
    this.skeletonGroup.style.backgroundColor = this.selectedGroup.dataset.color;
    this.skeletonSpan.style.backgroundColor = this.selectedGroup.dataset.color;
    this.skeletonGroup.textContent = this.selectedGroup.dataset.name;
  }

  onCancelBtnClick(e) {
    e.preventDefault();
    this.resetForm();
  }

  onEditBtnClick(e) {
    e.preventDefault();
    const selectedGroup = this.getSelectedGroup();
    const groupName = selectedGroup.dataset.name;
    const groupColor = selectedGroup.dataset.color;
    const groupId = selectedGroup.dataset.id;

    this.itemInEditMode.group = new Group(groupName, groupColor, groupId);

    this.itemInEditMode.day = this.getSelectedDay().value;
    this.itemInEditMode.name = this.inputName.value;

    this.itemInEditMode.edit();
    this.alertItemEdited.show();
    this.resetForm();
  }

  addAllEventListener() {
    this.dayBtns.forEach(item =>
      item.addEventListener("click", e => this.selectDay(e))
    );

    this.btnAdd.addEventListener("click", e => this.addItem(e));
    this.btnEdit.addEventListener("click", e => this.onEditBtnClick(e));
    this.btnCancel.addEventListener("click", e => this.onCancelBtnClick(e));

    this.inputName.addEventListener("blur", e => {
      UI.resizeInput(e.target);
      if (this.inputName.value === "") {
        UI.deselectItem(this.skeletonContainer);
      } else {
        UI.selectItem(this.skeletonContainer);
      }
    });

    this.inputName.addEventListener("input", e => UI.resizeInput(e.target));
  }

  addItem(e) {
    e.preventDefault();
    const name = this.inputName.value;
    if (name === "") {
      this.alertInvalidInput.show();
    } else {
      const day = this.getSelectedDay().value;
      const selectedGroup = this.getSelectedGroup();
      const groupName = selectedGroup.dataset.name;
      const groupColor = selectedGroup.dataset.color;
      const groupId = selectedGroup.dataset.id;
      const group = new Group(groupName, groupColor, groupId);
      const item = new Entrie(name, group, day);
      item.save();
      this.resetForm();
      this.alertItemAdded.show();
    }
  }

  resetForm() {
    this.inputName.value = "";
    UI.showElement(this.btnAdd);
    UI.hideElement(this.editBtnContainer);
    UI.deselectItem(this.skeletonContainer);
  }

  selectDay(e) {
    UI.deselectItems(this.daysContainer);
    UI.selectItem(e.target);
    this.skeletonDay.textContent = e.target.value;
  }

  getSelectedDay() {
    return UI.getSelectedItem(this.daysContainer);
  }

  getSelectedGroup() {
    return UI.getSelectedItem(document.querySelector("#groups-items"));
  }
}

export { AddEntriesView };
