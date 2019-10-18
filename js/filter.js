import { Group } from "./group.js";
import { Entrie } from "./entrie.js";

class Filter {
  constructor() {}

  static getGroupFilterTemplates() {
    const items = Group.getItems();
    const entries = Entrie.getItems().filter(f => f.isDone === false);

    const filterTemplates = [];

    items.forEach(item => {
      let counter = 0;
      entries.forEach(entrie => (entrie.group.id == item.id ? counter++ : 0));
      if (counter > 0) filterTemplates.push(item.getFilterTemplate(counter));
    });

    return filterTemplates;
  }

  static;
}

export { Filter };
