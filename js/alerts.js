class Alerts {
  constructor(msg, alertType) {
    this.msg = msg;
    this.alertType = alertType;
    this.container = document.querySelector(".container-alerts");
    this.itemContainer = this.container.querySelector(".alerts-items");
  }

  getTemplate() {
    const alertsItem = document.createElement("div");
    const p = document.createElement("p");
    const iconContainer = document.createElement("div");
    const icon = document.createElement("i");
    const txt = document.createTextNode(this.msg);
    p.classList.add("alerts-item-text");
    p.appendChild(txt);

    iconContainer.classList.add("alerts-item-icon");
    icon.className = "material-icons-outlined";
    icon.textContent = this.alertType.icon;
    iconContainer.appendChild(icon);

    alertsItem.classList.add("alerts-item");
    alertsItem.classList.add(this.alertType.name);
    alertsItem.appendChild(iconContainer);
    alertsItem.appendChild(p);

    return alertsItem;
  }

  show() {
    const template = this.getTemplate();
    this.itemContainer.insertBefore(template, this.itemContainer.firstChild);

    setTimeout(() => template.remove(), 5000);
  }
}

const alertType = {
  success: { name: "success", icon: "check" },
  warning: { name: "warning", icon: "priority_high" },
  danger: { name: "danger", icon: "error_outline" },
  light: { name: "light", icon: "info" }
};

export { Alerts, alertType };
