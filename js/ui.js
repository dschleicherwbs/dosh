import { Group } from "./group.js";

class UI {
  static deselectItems(container, className = "btn-selective") {
    const items = container.querySelectorAll("." + className);
    items.forEach(item => item.classList.remove("selected"));
  }
  static toggleselection(item) {
    item.classList.toggle("selected");
  }
  static selectItem(item) {
    item.classList.add("selected");
  }

  static deselectItem(item) {
    item.classList.remove("selected");
  }

  static isItemSelected(item) {
    return item.classList.contains("selected");
  }

  static selectFirstChild(container) {
    const firstItem = container.querySelector(".btn-selective");
    if (firstItem != null) {
      firstItem.classList.add("selected");
    }
  }

  static getSelectedItem(container) {
    const items = container.querySelectorAll(".btn-selective");
    const slecedtItem = Array.from(items).find(f =>
      f.classList.contains("selected")
    );
    return slecedtItem;
  }

  static setInputColorOnFocus(color, input) {
    input.style.backgroundColor = Group.createBgColor(color);
    input.style.borderColor = Group.createFontColor(color);
  }

  static setInputColorOnBlur(input) {
    input.style.backgroundColor = "inherit";
    input.style.borderColor = "inherit";
  }

  static clearItems(container) {
    while (container.firstChild) {
      container.firstChild.remove();
    }
  }

  static resizeInput(input) {
    const minSize = 13;
    input.style.width =
      input.value.length > minSize ? input.value.length + "ch" : minSize + "ch";
  }

  static showElement(el) {
    el.classList.remove("hidden");
    if (el.nodeName === "BUTTON") {
      el.disabled = false;
      el.type = "submit";
    }
  }

  static hideElement(el) {
    el.classList.add("hidden");
    if (el.nodeName === "BUTTON") {
      el.disabled = true;
      el.type = "button";
    }
  }
}

export { UI };
