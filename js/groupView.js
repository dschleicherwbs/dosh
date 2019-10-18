import { Group } from "./group.js";
import { Alerts, alertType } from "./alerts.js";
import { UI } from "./ui.js";

class GroupsView {
  constructor() {
    this.container = document.querySelector(".container-groups");
    this.itemContainer = this.container.querySelector("#groups-items");
    this.btnOpenEdit = this.container.querySelector("#groups-btn-open-edit");
    this.inputForm = this.container.querySelector(".groups-form");
    this.inputName = this.inputForm.querySelector("#groups-input-name");
    this.inputColor = this.inputForm.querySelector("#groups-input-color");
    this.btnAdd = this.inputForm.querySelector("#groups-btn-add");
    this.btnEdit = this.inputForm.querySelector("#groups-btn-edit");
    this.btnCancel = this.inputForm.querySelector("#groups-btn-cancel");
    this.btnColor = this.inputForm.querySelector("#groups-btn-color");
    this.defaultColor = "#ffff3e";
    this.isEditOpen = false;

    this.alertItemAdded = new Alerts("Group addet", alertType.success);
    this.alertInvalidInput = new Alerts("Fill all Fields", alertType.danger);
    this.alertItemDeleted = new Alerts("Group removed", alertType.success);
    this.alertItemEdited = new Alerts("Changes saved", alertType.success);

    this.initializeView();
  }

  initializeView() {
    //Set btnColor Background and Color to ColorIput Value
    this.inputColor.value = this.defaultColor;
    this.onColorInput();

    //Initilizing Groups
    this.loadGroups();

    //Add Event Lisiteners
    this.inputColor.addEventListener("change", e => this.onColorInput());
    this.inputName.addEventListener("focus", e =>
      UI.setInputColorOnFocus(this.inputColor.value, this.inputName)
    );
    this.inputName.addEventListener("blur", e =>
      UI.setInputColorOnBlur(this.inputName)
    );
    this.btnOpenEdit.addEventListener("click", e => this.openForm(e));
    this.btnAdd.addEventListener("click", e => this.addGroup(e));
    this.btnCancel.addEventListener("click", e => this.closeForm(e));
    this.btnColor.addEventListener("click", e => this.openColorPicker(e));
    this.btnEdit.addEventListener("click", e => this.editItem(e));
  }

  loadGroups() {
    // get List with all group Items from LocalStorage
    const items = Group.getItems();
    // add All items with EL to View
    items.forEach(item => {
      //get html template for Item
      const itemTemplate = item.getTemplate();
      // add event Listener to Item
      this.addEventListenerToItem(itemTemplate);
      // adds Item to View
      this.itemContainer.appendChild(itemTemplate);
    });
    // select first Item
    UI.selectFirstChild(this.itemContainer);
  }

  addGroup(e) {
    e.preventDefault();
    const name = this.inputName.value;
    if (name === "") {
      this.alertInvalidInput.show();
    } else {
      const color = this.inputColor.value;
      const groupItem = new Group(name, color);
      const item = groupItem.getTemplate();
      this.addEventListenerToItem(item);
      if (this.isEditOpen) this.toggleDeleteBtn(item);
      this.itemContainer.insertBefore(item, this.itemContainer.firstChild);
      groupItem.save();
      this.alertItemAdded.show();
      this.resetForm();
    }
  }

  addEventListenerToItem(item) {
    const itemDeleteBtn = item.querySelector(".groups-item-delete-btn");
    item.addEventListener("click", e => this.selectGroup(e));
    itemDeleteBtn.addEventListener("click", e => this.removeGroup(e));
  }

  removeGroup(e) {
    const item = e.target.parentElement;
    const id = item.dataset.id;
    item.remove();
    Group.removeGroupById(id);
    this.alertItemDeleted.show();
  }

  editItem(e) {
    e.preventDefault();
    const name = this.inputName.value;
    if (name == "") {
      this.alertInvalidInput.show();
    } else {
      const color = this.inputColor.value;
      const id = this.inputName.dataset.id;
      const selectedItem = UI.getSelectedItem(this.itemContainer);
      const group = new Group(name, color, id);
      Group.editItem(group);
      const template = group.getTemplate();
      this.addEventListenerToItem(template);
      this.toggleDeleteBtn(template);
      this.itemContainer.insertBefore(template, selectedItem);
      selectedItem.remove();
      UI.selectItem(template);
      this.alertItemEdited.show();
    }
  }

  selectGroup(e) {
    const item = e.target.classList.contains("groups-item") ? e.target : null;
    if (item != null) {
      if (this.isEditOpen) {
        if (UI.isItemSelected(item)) {
          UI.deselectItem(item);
          this.resetForm();
        } else {
          const id = item.dataset.id;
          const name = item.dataset.name;
          const color = item.dataset.color;

          UI.deselectItems(this.itemContainer);
          UI.selectItem(item);

          UI.showElement(this.btnEdit);
          UI.hideElement(this.btnAdd);
          this.inputName.dataset.id = id;
          this.inputName.value = name;
          this.inputColor.value = color;
          this.onColorInput();
        }
      } else {
        UI.deselectItems(this.itemContainer);
        UI.selectItem(item);
      }
    } else this.resetForm();
  }

  onEditClick(groupId) {
    UI.deselectItems(this.itemContainer);
    this.itemContainer
      .querySelectorAll(".groups-item")
      .forEach(group =>
        group.dataset.id === groupId ? UI.selectItem(group) : 0
      );
  }

  resetForm() {
    this.inputName.dataset.id = null;
    this.inputName.value = "";
    this.inputColor.value = this.defaultColor;
    this.onColorInput();
    UI.showElement(this.btnAdd);
    UI.hideElement(this.btnEdit);
  }

  onColorInput() {
    const inputColor = this.inputColor.value;
    const bgColor = Group.createBgColor(inputColor);
    const textColor = Group.createFontColor(inputColor);

    this.btnColor.style.backgroundColor = bgColor;
    this.btnColor.style.color = textColor;
  }

  openColorPicker(e) {
    e.preventDefault();
    this.inputColor.click();
  }

  getGroupItems() {
    return this.itemContainer.querySelectorAll(".groups-item");
  }

  closeForm(e) {
    e.preventDefault();
    this.isEditOpen = false;
    if (UI.getSelectedItem(this.itemContainer) == null) {
      UI.selectItem(this.itemContainer.firstElementChild);
    }
    this.getGroupItems().forEach(item => this.toggleDeleteBtn(item));
    this.btnOpenEdit.classList.toggle("hidden");
    this.inputForm.classList.toggle("hidden");
    this.resetForm();
  }

  openForm(e) {
    e.preventDefault();
    this.isEditOpen = true;
    UI.deselectItems(this.itemContainer);
    this.getGroupItems().forEach(item => this.toggleDeleteBtn(item));
    this.btnOpenEdit.classList.toggle("hidden");
    this.inputForm.classList.toggle("hidden");
    this.resetForm();
  }

  toggleDeleteBtn(item) {
    item.querySelector(".groups-item-delete-btn").classList.toggle("hidden");
  }
}

export { GroupsView };
