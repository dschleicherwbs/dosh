class Store {
  static getNewId(path) {
    let lastId = window.localStorage.getItem(path);
    lastId = lastId === null ? 0 : parseInt(lastId, 10) + 1;
    window.localStorage.setItem(path, lastId);
    return lastId;
  }

  static save(path, item) {
    let items = this.load(path);
    items.push(item);
    window.localStorage.setItem(path, JSON.stringify(items));
  }

  static load(path) {
    let items = JSON.parse(window.localStorage.getItem(path));
    if (items === null) items = [];
    return items;
  }

  static getById(path, id) {
    const items = this.load(path);
    return items.find(f => f.id == id);
  }

  static removeById(path, id) {
    const items = this.load(path);
    const filteredItems = items.filter(f => f.id != id);

    window.localStorage.setItem(path, JSON.stringify(filteredItems));
  }

  static editById(path, item) {
    const items = this.load(path);
    const filteredItems = items.filter(f => f.id != item.id);
    filteredItems.push(item);

    window.localStorage.setItem(path, JSON.stringify(filteredItems));
  }
}

export { Store };
