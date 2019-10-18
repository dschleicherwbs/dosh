import { Filter } from "./filter.js";
import { UI } from "./ui.js";

class FilterView {
  constructor() {
    this.container = document.querySelector(".container-filter");
    this.itemsGroupsContainer = this.container.querySelector(
      ".filter-items-groups"
    );
    this.itemsGroupsDays = this.container.querySelector(".filter-items-days");
    this.initialize();
  }

  initialize() {
    this.loadFilter();
  }

  loadFilter() {
    const groupFilter = Filter.getGroupFilterTemplates();
    UI.clearItems(this.itemsGroupsContainer);
    groupFilter.forEach(item => this.itemsGroupsContainer.appendChild(item));
  }
}

export { FilterView };
