import { GroupsView } from "./groupView.js";
import { AddEntriesView } from "./addentriesView.js";
import { EntriesView } from "./entriesView.js";
import { FilterView } from "./filterView.js";

document.addEventListener("DOMContentLoaded", e => {
  const groupsView = new GroupsView();
  const addEntriesView = new AddEntriesView();
  const entriesView = new EntriesView();
  // const filterView = new FilterView();

  const observerSettings = {
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
    attributeOldValue: true
  };

  const observerGVItemContainer = new MutationObserver(mutations => {
    addEntriesView.onGroupSelectionChange();
  });

  const observerEVItemContainer = new MutationObserver(mutations => {
    let lastItem = "";
    mutations.forEach(mutation => {
      const target = mutation.target;
      if (target.classList.contains("edit-mode") && target != lastItem) {
        addEntriesView.onEditClick(mutation.target.dataset.id);
        groupsView.onEditClick(mutation.target.dataset.groupId);
        lastItem = target;
      }
    });
  });

  observerGVItemContainer.observe(groupsView.itemContainer, observerSettings);
  observerEVItemContainer.observe(entriesView.itemContainer, observerSettings);

  addEntriesView.btnAdd.addEventListener("click", e => {
    entriesView.onAddTask();
    // filterView.loadFilter();
  });
  addEntriesView.btnEdit.addEventListener("click", e => {
    entriesView.onAddTask();
    // filterView.loadFilter();
  });
});
