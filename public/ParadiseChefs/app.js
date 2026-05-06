const DB_NAME = "paradisechefs_db";
const DB_VERSION = 2;
const DEFAULT_SETTINGS = {
  appName: "ParadiseChefs",
  vesselName: "ParadiseChefs",
  brandLabel: "ParadiseChefs",
  accent: "#173f3b"
};

const DATA_STORES = ["charters", "guests", "crew", "sources", "ports", "ingredients", "inventory", "recipes", "menus", "prepTasks", "shoppingLists", "expenses", "notes"];
const STORES = ["settings", "users", "audit", "archives", ...DATA_STORES];
const ENTITIES = {
  users: {
    label: "Users",
    singular: "User",
    store: "users",
    titleField: "name"
  },
  charters: {
    label: "Charters",
    singular: "Charter",
    store: "charters",
    titleField: "name",
    description: "Trips, charter dates, regions, counts, and planning notes.",
    fields: [
      ["name", "Charter name", "text", true],
      ["startDate", "Start date", "date"],
      ["endDate", "End date", "date"],
      ["region", "Region", "text"],
      ["guestCount", "Guest count", "number"],
      ["crewCount", "Crew count", "number"],
      ["notes", "Notes", "textarea"]
    ],
    columns: ["name", "startDate", "endDate", "region"]
  },
  guests: {
    label: "Guests",
    singular: "Guest",
    store: "guests",
    titleField: "name",
    description: "Guest profiles, allergies, preferences, brand specs, and repeat history.",
    fields: [
      ["name", "Guest name", "text", true],
      ["charterId", "Charter", "charter"],
      ["email", "Email", "email"],
      ["phone", "Phone", "tel"],
      ["allergies", "Allergies", "textarea"],
      ["severeAllergy", "Severe allergy flag", "checkbox"],
      ["dietary", "Dietary protocols", "textarea"],
      ["dislikes", "Dislikes", "textarea"],
      ["favorites", "Favorites", "textarea"],
      ["beverages", "Beverage and brand specs", "textarea"],
      ["notes", "Private notes", "textarea"]
    ],
    columns: ["name", "charterId", "allergies", "severeAllergy"]
  },
  crew: {
    label: "Crew",
    singular: "Crew member",
    store: "crew",
    titleField: "name",
    description: "Crew contacts, roles, preferences, and dietary restrictions.",
    fields: [
      ["name", "Name", "text", true],
      ["role", "Crew role", "text"],
      ["email", "Email", "email"],
      ["phone", "Phone", "tel"],
      ["dietary", "Dietary notes", "textarea"],
      ["notes", "Notes", "textarea"]
    ],
    columns: ["name", "role", "email", "phone"]
  },
  sources: {
    label: "Sources",
    singular: "Source",
    store: "sources",
    titleField: "name",
    description: "Provisioners, markets, farms, fishermen, wholesalers, and specialty suppliers.",
    fields: [
      ["name", "Company or source name", "text", true],
      ["type", "Source type", "select:Provisioner|Market|Farm|Fisherman|Wholesaler|Specialty importer|Local contact|Other"],
      ["contactName", "Contact name", "text"],
      ["phone", "Phone", "tel"],
      ["email", "Email", "email"],
      ["whatsapp", "WhatsApp", "tel"],
      ["website", "Website", "url"],
      ["ports", "Ports or regions served", "textarea"],
      ["paymentMethods", "Payment methods", "text"],
      ["cashOnly", "Cash-only", "checkbox"],
      ["specialties", "Specialties", "textarea"],
      ["reliability", "Reliability notes", "textarea"],
      ["notes", "Notes", "textarea"]
    ],
    columns: ["name", "type", "contactName", "ports"]
  },
  ports: {
    label: "Ports",
    singular: "Port",
    store: "ports",
    titleField: "name",
    description: "Port and region notes for itinerary-aware provisioning.",
    fields: [
      ["name", "Port name", "text", true],
      ["region", "Region", "text"],
      ["country", "Country", "text"],
      ["notes", "Provisioning notes", "textarea"]
    ],
    columns: ["name", "region", "country", "notes"]
  },
  ingredients: {
    label: "Ingredients",
    singular: "Ingredient",
    store: "ingredients",
    titleField: "name",
    description: "Canonical ingredient records that recipes and inventory will share.",
    fields: [
      ["name", "Ingredient name", "text", true],
      ["category", "Category", "select:Protein|Produce|Dairy|Dry goods|Bakery|Beverage|Spice|Condiment|Frozen|Other"],
      ["unit", "Default unit", "select:ea|g|kg|oz|lb|ml|l|cup|qt|gal|case|box|bag"],
      ["allergens", "Allergen tags", "text"],
      ["storageDefault", "Default storage", "select:Dry|Fridge|Freezer|Walk-in|Drawer freezer|Beverage|Other"],
      ["lowStockDefault", "Default low-stock threshold", "number"],
      ["notes", "Notes", "textarea"]
    ],
    columns: ["name", "category", "unit", "stockSummary"]
  },
  inventory: {
    label: "Inventory",
    singular: "Inventory item",
    store: "inventory",
    titleField: "displayName",
    description: "On-hand stock linked back to canonical ingredients for live math.",
    fields: [
      ["ingredientId", "Ingredient", "ingredient", true],
      ["quantity", "Quantity on hand", "number", true],
      ["unit", "Unit", "select:ea|g|kg|oz|lb|ml|l|cup|qt|gal|case|box|bag"],
      ["zone", "Storage zone", "select:Dry|Fridge|Freezer|Walk-in|Drawer freezer|Beverage|Other"],
      ["expirationDate", "Expiration date", "date"],
      ["lowStockThreshold", "Low-stock threshold", "number"],
      ["watch", "Watch list", "checkbox"],
      ["sourceId", "Usual source", "source"],
      ["notes", "Notes", "textarea"]
    ],
    columns: ["ingredientId", "quantity", "zone", "status"]
  }
};

let db;
let state = {
  settings: { ...DEFAULT_SETTINGS },
  users: [],
  charters: [],
  guests: [],
  crew: [],
  sources: [],
  ports: [],
  ingredients: [],
  inventory: [],
  recipes: [],
  menus: [],
  prepTasks: [],
  shoppingLists: [],
  expenses: [],
  notes: [],
  audit: [],
  archives: [],
  session: null,
  view: "dashboard",
  online: navigator.onLine
};

const app = document.querySelector("#app");

function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function now() {
  return new Date().toISOString();
}

function titleCase(value) {
  return String(value || "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      for (const store of STORES) {
        if (!database.objectStoreNames.contains(store)) {
          database.createObjectStore(store, { keyPath: "id" });
        }
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function tx(store, mode = "readonly") {
  return db.transaction(store, mode).objectStore(store);
}

function getAll(store) {
  return new Promise((resolve, reject) => {
    const request = tx(store).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

function put(store, record) {
  return new Promise((resolve, reject) => {
    const request = tx(store, "readwrite").put(record);
    request.onsuccess = () => resolve(record);
    request.onerror = () => reject(request.error);
  });
}

function remove(store, id) {
  return new Promise((resolve, reject) => {
    const request = tx(store, "readwrite").delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function hashPin(pin, salt) {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(`${salt}:${pin}`));
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function logAudit(action, entityType, entityId, summary) {
  const record = {
    id: uid("audit"),
    action,
    entityType,
    entityId,
    summary,
    userId: state.session?.userId || "system",
    createdAt: now()
  };
  await put("audit", record);
  state.audit.unshift(record);
}

async function loadState() {
  const [settings, users, audit, archives, ...data] = await Promise.all([
    getAll("settings"),
    getAll("users"),
    getAll("audit"),
    getAll("archives"),
    ...DATA_STORES.map((store) => getAll(store))
  ]);
  state.settings = settings[0] || { id: "workspace", ...DEFAULT_SETTINGS, createdAt: now(), updatedAt: now() };
  state.users = users.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  state.audit = audit.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  state.archives = archives.sort((a, b) => b.archivedAt.localeCompare(a.archivedAt));
  DATA_STORES.forEach((store, index) => {
    state[store] = data[index].sort((a, b) => recordTitle(store, a).localeCompare(recordTitle(store, b)));
  });
  updateDocumentBranding();
}

function activeRecords(entityType) {
  return (state[entityType] || []).filter((record) => !record.archivedAt);
}

function recordTitle(entityType, record) {
  if (!record) return "";
  if (entityType === "inventory") return ingredientName(record.ingredientId) || record.displayName || "Inventory item";
  const meta = ENTITIES[entityType];
  return record[meta?.titleField || "name"] || record.name || record.title || record.id || "";
}

function ingredientName(id) {
  return state.ingredients.find((ingredient) => ingredient.id === id)?.name || "";
}

function sourceName(id) {
  return state.sources.find((source) => source.id === id)?.name || "";
}

function charterName(id) {
  return state.charters.find((charter) => charter.id === id)?.name || "";
}

function inventoryForIngredient(ingredientId) {
  return activeRecords("inventory").filter((item) => item.ingredientId === ingredientId);
}

function stockSummary(ingredient) {
  const items = inventoryForIngredient(ingredient.id);
  if (!items.length) return "No stock";
  const totals = items.reduce((acc, item) => {
    const unit = item.unit || ingredient.unit || "ea";
    acc[unit] = (acc[unit] || 0) + Number(item.quantity || 0);
    return acc;
  }, {});
  return Object.entries(totals).map(([unit, quantity]) => `${formatNumber(quantity)} ${unit}`).join(", ");
}

function inventoryStatus(item) {
  const threshold = Number(item.lowStockThreshold || 0);
  const quantity = Number(item.quantity || 0);
  if (threshold > 0 && quantity <= threshold) return "Low stock";
  if (item.watch) return "Watch";
  if (item.expirationDate) {
    const days = Math.ceil((new Date(item.expirationDate) - new Date()) / 86400000);
    if (days < 0) return "Expired";
    if (days <= 3) return "Expiring soon";
  }
  return "OK";
}

function formatNumber(value) {
  const number = Number(value || 0);
  return Number.isInteger(number) ? String(number) : number.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function updateDocumentBranding() {
  document.title = state.settings.appName || DEFAULT_SETTINGS.appName;
  document.querySelector('meta[name="apple-mobile-web-app-title"]')?.setAttribute("content", state.settings.appName || DEFAULT_SETTINGS.appName);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", state.settings.accent || DEFAULT_SETTINGS.accent);
  document.documentElement.style.setProperty("--strong", state.settings.accent || DEFAULT_SETTINGS.accent);
  setDynamicManifest();
}

function setDynamicManifest() {
  const manifest = {
    name: state.settings.appName || DEFAULT_SETTINGS.appName,
    short_name: state.settings.appName || DEFAULT_SETTINGS.appName,
    start_url: "./index.html",
    scope: "./",
    display: "standalone",
    background_color: "#fbfaf7",
    theme_color: state.settings.accent || DEFAULT_SETTINGS.accent,
    icons: [
      {
        src: `data:image/svg+xml,${encodeURIComponent(iconSvg(state.settings.accent || DEFAULT_SETTINGS.accent))}`,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable"
      }
    ]
  };
  const href = URL.createObjectURL(new Blob([JSON.stringify(manifest)], { type: "application/manifest+json" }));
  let link = document.querySelector('link[rel="manifest"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "manifest";
    document.head.append(link);
  }
  link.href = href;
}

function iconSvg(color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="88" fill="${color}"/><path d="M128 292h256l-38 92H166l-38-92Z" fill="#fbfaf7"/><path d="M148 252h216l20 40H128l20-40Z" fill="#f2d68d"/><path d="M246 96h34v156h-34z" fill="#fbfaf7"/><path d="M280 122c56 18 92 62 108 130H280V122Z" fill="#d0ddd7"/><path d="M246 134c-54 18-92 58-116 118h116V134Z" fill="#ffffff"/></svg>`;
}

function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem("paradisechefs_session"));
  } catch {
    return null;
  }
}

function setSession(user) {
  state.session = user ? { userId: user.id, role: user.role, name: user.name } : null;
  if (state.session) {
    sessionStorage.setItem("paradisechefs_session", JSON.stringify(state.session));
  } else {
    sessionStorage.removeItem("paradisechefs_session");
  }
}

function canManageUsers() {
  return state.session?.role === "chef_admin";
}

function roleLabel(role) {
  return {
    chef_admin: "Chef Admin",
    chef: "Chef",
    captain: "Captain",
    chief_stew: "Chief Stew",
    crew: "Crew",
    viewer: "Viewer"
  }[role] || titleCase(role);
}

function navItems() {
  return [
    ["dashboard", "Dashboard", "⌂"],
    ["charters", "Charters", "◇"],
    ["guests", "Guests", "◎"],
    ["crew", "Crew", "◌"],
    ["ingredients", "Ingredients", "◧"],
    ["inventory", "Inventory", "▤"],
    ["sources", "Sources", "☏"],
    ["ports", "Ports", "⌖"],
    ["settings", "ParadiseChefs", "⚙"],
    ["users", "Access", "◉"],
    ["archives", "Archive", "□"],
    ["backup", "Backup", "⇅"]
  ];
}

function render() {
  updateDocumentBranding();
  if (!state.users.length) {
    app.innerHTML = setupScreen();
    wireSetup();
    return;
  }
  const session = getSession();
  if (!state.session && session && state.users.some((user) => user.id === session.userId && !user.archivedAt)) {
    state.session = session;
  }
  if (!state.session) {
    app.innerHTML = unlockScreen();
    wireUnlock();
    return;
  }
  app.innerHTML = shell();
  wireShell();
}

function authHero() {
  return `
    <section class="auth-visual">
      <div class="brand-lockup">
        <span class="brand-mark" aria-hidden="true">◒</span>
        <span>${escapeHtml(state.settings.brandLabel || DEFAULT_SETTINGS.brandLabel)}</span>
      </div>
      <div>
        <h1>${escapeHtml(state.settings.appName || DEFAULT_SETTINGS.appName)}</h1>
        <p>Offline workspace for charter menus, inventory, provisioning, crew briefings, and the decisions that have to survive weak signal.</p>
      </div>
    </section>
  `;
}

function setupScreen() {
  return `
    <main class="auth-screen">
      ${authHero()}
      <section class="auth-panel">
        <form class="auth-card" id="setupForm">
          <p class="eyebrow">First setup</p>
          <h2>Create the Chef Admin</h2>
          <p class="muted">The name and vessel labels stay editable so the product can be renamed or white-labeled later.</p>
          <label class="field">
            App name
            <input name="appName" required value="${escapeHtml(state.settings.appName)}">
          </label>
          <label class="field">
            Vessel or workspace
            <input name="vesselName" required value="${escapeHtml(state.settings.vesselName)}">
          </label>
          <label class="field">
            Chef Admin name
            <input name="name" required placeholder="Chef name">
          </label>
          <label class="field">
            Local unlock PIN
            <input name="pin" required minlength="4" inputmode="numeric" autocomplete="new-password" type="password">
          </label>
          <button class="btn primary" type="submit">Create workspace</button>
        </form>
      </section>
    </main>
  `;
}

function unlockScreen() {
  return `
    <main class="auth-screen">
      ${authHero()}
      <section class="auth-panel">
        <form class="auth-card" id="unlockForm">
          <p class="eyebrow">${escapeHtml(state.settings.vesselName)}</p>
          <h2>Unlock workspace</h2>
          <label class="field">
            User
            <select name="userId" required>
              ${state.users.filter((user) => !user.archivedAt).map((user) => `<option value="${user.id}">${escapeHtml(user.name)} · ${roleLabel(user.role)}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            PIN
            <input name="pin" required inputmode="numeric" autocomplete="current-password" type="password">
          </label>
          <button class="btn primary" type="submit">Unlock</button>
        </form>
      </section>
    </main>
  `;
}

function shell() {
  const active = state.view;
  return `
    <main class="layout">
      <aside class="sidebar">
        <div>
          <div class="brand-lockup">
            <span class="brand-mark" aria-hidden="true">◒</span>
            <div>
              <strong>${escapeHtml(state.settings.appName)}</strong>
              <div class="workspace-label">${escapeHtml(state.settings.vesselName)}</div>
            </div>
          </div>
        </div>
        <nav class="nav" aria-label="Main navigation">
          ${navItems().map(([id, label, icon]) => `<button data-view="${id}" class="${active === id ? "active" : ""}" title="${label}"><span aria-hidden="true">${icon}</span><span>${label}</span></button>`).join("")}
        </nav>
        <div class="status-card">
          <strong>${escapeHtml(state.session.name)}</strong>
          <div>${roleLabel(state.session.role)}</div>
          <div>${state.online ? "Online" : "Offline"} · local-first</div>
          <button class="btn" id="lockButton" type="button">Lock</button>
        </div>
      </aside>
      <section class="main">
        ${viewMarkup()}
      </section>
    </main>
    <div id="toast" class="toast hidden"></div>
  `;
}

function topbar(title, subtitle, action = "") {
  return `
    <header class="topbar">
      <div>
        <h1>${escapeHtml(title)}</h1>
        <p class="muted">${escapeHtml(subtitle)}</p>
      </div>
      <div class="actions">${action}</div>
    </header>
  `;
}

function viewMarkup() {
  if (state.view === "settings") return settingsView();
  if (state.view === "users") return usersView();
  if (state.view === "archives") return archivesView();
  if (state.view === "backup") return backupView();
  if (ENTITIES[state.view]?.fields) return entityView(state.view);
  return dashboardView();
}

function dashboardView() {
  const activeUsers = state.users.filter((user) => !user.archivedAt).length;
  const lowStock = activeRecords("inventory").filter((item) => inventoryStatus(item) !== "OK").length;
  const severeAllergies = activeRecords("guests").filter((guest) => guest.severeAllergy).length;
  return `
    ${topbar("Dashboard", "Offline ParadiseChefs app with the first operational records for charters, people, sources, ingredients, and inventory.")}
    <section class="grid">
      <article class="panel metric">
        <span class="muted">Active users</span>
        <strong>${activeUsers}</strong>
        <span class="pill-row"><span class="pill">Role-based access</span><span class="pill">Local unlock</span></span>
      </article>
      <article class="panel metric">
        <span class="muted">Open charters</span>
        <strong>${activeRecords("charters").length}</strong>
        <span class="pill-row"><span class="pill">Editable</span><span class="pill">Archivable</span></span>
      </article>
      <article class="panel metric">
        <span class="muted">Inventory alerts</span>
        <strong>${lowStock}</strong>
        <span class="pill-row"><span class="pill warn">Low stock/watch/expiry</span></span>
      </article>
      <article class="panel metric">
        <span class="muted">Severe allergy flags</span>
        <strong>${severeAllergies}</strong>
        <span class="pill-row"><span class="pill warn">Visible risk signal</span></span>
      </article>
      <article class="panel metric">
        <span class="muted">Archived records</span>
        <strong>${state.archives.length}</strong>
        <span class="pill-row"><span class="pill">Recoverable</span><span class="pill warn">Hard delete guarded</span></span>
      </article>
      <article class="panel full">
        <h3>MVP Spine</h3>
        <div class="pill-row">
          <span class="pill">Offline app shell</span>
          <span class="pill">Configurable naming</span>
          <span class="pill">IndexedDB storage</span>
          <span class="pill">CRUD + archive</span>
          <span class="pill">Provisioner contacts</span>
          <span class="pill">Ingredient inventory links</span>
        </div>
      </article>
      <article class="panel full">
        <h3>Recent Activity</h3>
        ${activityList()}
      </article>
    </section>
  `;
}

function activityList() {
  if (!state.audit.length) return `<div class="empty">No activity recorded yet.</div>`;
  return `
    <div class="list">
      ${state.audit.slice(0, 8).map((item) => `
        <div class="record-row">
          <div>
            <strong>${escapeHtml(item.summary)}</strong>
            <p class="muted">${escapeHtml(titleCase(item.action))} · ${escapeHtml(titleCase(item.entityType))} · ${new Date(item.createdAt).toLocaleString()}</p>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function settingsView() {
  return `
    ${topbar("ParadiseChefs", "Rename the app or vessel without touching the code.")}
    <section class="grid">
      <form class="panel full" id="settingsForm">
        <label class="field">
          App name
          <input name="appName" required value="${escapeHtml(state.settings.appName)}">
        </label>
        <label class="field">
          Vessel or workspace name
          <input name="vesselName" required value="${escapeHtml(state.settings.vesselName)}">
        </label>
        <label class="field">
          Brand label
          <input name="brandLabel" value="${escapeHtml(state.settings.brandLabel)}">
        </label>
        <label class="field">
          Accent color
          <input name="accent" type="color" value="${escapeHtml(state.settings.accent || DEFAULT_SETTINGS.accent)}">
        </label>
        <button class="btn primary" type="submit">Save workspace</button>
      </form>
    </section>
  `;
}

function usersView() {
  const action = canManageUsers() ? `<button class="btn primary" id="newUserButton" type="button">Add user</button>` : "";
  return `
    ${topbar("Access", "Manage who can unlock this local workspace and what role they have.", action)}
    <section class="grid">
      <article class="panel full">
        ${!canManageUsers() ? `<p class="muted">Only Chef Admin can manage users.</p>` : ""}
        ${state.users.filter((user) => !user.archivedAt).length ? userTable() : `<div class="empty">No active users.</div>`}
      </article>
    </section>
  `;
}

function entityView(entityType) {
  const meta = ENTITIES[entityType];
  const records = activeRecords(entityType);
  const action = `<button class="btn primary" data-new-record="${entityType}" type="button">Add ${meta.singular.toLowerCase()}</button>`;
  return `
    ${topbar(meta.label, meta.description, action)}
    <section class="grid">
      ${entityType === "inventory" ? inventoryMathPanel() : ""}
      ${entityType === "ingredients" ? ingredientMathPanel() : ""}
      <article class="panel full">
        ${records.length ? entityTable(entityType, records) : `<div class="empty">No ${meta.label.toLowerCase()} yet.</div>`}
      </article>
    </section>
  `;
}

function inventoryMathPanel() {
  const items = activeRecords("inventory");
  const alerts = items.filter((item) => inventoryStatus(item) !== "OK");
  return `
    <article class="panel full">
      <h3>Inventory Math</h3>
      <p class="muted">Each inventory item links to a canonical ingredient. Recipes and provisioning will use this same link so required quantities, on-hand stock, and shopping gaps stay in sync.</p>
      <div class="pill-row">
        <span class="pill">${items.length} stock records</span>
        <span class="pill ${alerts.length ? "warn" : ""}">${alerts.length} alerts</span>
      </div>
    </article>
  `;
}

function ingredientMathPanel() {
  return `
    <article class="panel full">
      <h3>Ingredient Backbone</h3>
      <p class="muted">Ingredients are the shared source of truth. Inventory already totals against them; recipes and shopping lists will attach to these same records next.</p>
    </article>
  `;
}

function entityTable(entityType, records) {
  const meta = ENTITIES[entityType];
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            ${meta.columns.map((column) => `<th>${escapeHtml(columnLabel(column))}</th>`).join("")}
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${records.map((record) => `
            <tr>
              ${meta.columns.map((column, index) => `<td>${index === 0 ? `<strong>${fieldDisplay(entityType, record, column)}</strong>` : fieldDisplay(entityType, record, column)}</td>`).join("")}
              <td>
                <div class="actions">
                  <button class="btn" data-edit-record="${entityType}:${record.id}" type="button">Edit</button>
                  <button class="btn warn" data-archive-record="${entityType}:${record.id}" type="button">Archive</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function columnLabel(column) {
  return {
    charterId: "Charter",
    sourceId: "Source",
    ingredientId: "Ingredient",
    severeAllergy: "Risk",
    stockSummary: "On hand"
  }[column] || titleCase(column);
}

function fieldDisplay(entityType, record, field) {
  if (field === "charterId") return escapeHtml(charterName(record[field]) || "Unassigned");
  if (field === "sourceId") return escapeHtml(sourceName(record[field]) || "Unassigned");
  if (field === "ingredientId") return escapeHtml(ingredientName(record[field]) || "Unlinked");
  if (field === "severeAllergy") return record[field] ? `<span class="pill warn">Severe</span>` : `<span class="pill">Standard</span>`;
  if (field === "stockSummary") return escapeHtml(stockSummary(record));
  if (field === "status") {
    const status = inventoryStatus(record);
    return `<span class="pill ${status === "OK" ? "" : "warn"}">${escapeHtml(status)}</span>`;
  }
  if (field === "quantity") return escapeHtml(`${formatNumber(record.quantity)} ${record.unit || ""}`.trim());
  if (String(field).toLowerCase().includes("date") && record[field]) return escapeHtml(new Date(record[field]).toLocaleDateString());
  if (typeof record[field] === "boolean") return record[field] ? "Yes" : "No";
  return escapeHtml(record[field] || "—");
}

function userTable() {
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Name</th><th>Role</th><th>Created</th><th></th></tr>
        </thead>
        <tbody>
          ${state.users.filter((user) => !user.archivedAt).map((user) => `
            <tr>
              <td><strong>${escapeHtml(user.name)}</strong></td>
              <td>${roleLabel(user.role)}</td>
              <td>${new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <div class="actions">
                  <button class="btn" data-edit-user="${user.id}" ${!canManageUsers() ? "disabled" : ""} type="button">Edit</button>
                  <button class="btn warn" data-archive-user="${user.id}" ${!canManageUsers() || user.id === state.session.userId ? "disabled" : ""} type="button">Archive</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function archivesView() {
  return `
    ${topbar("Archive", "Archived records stay recoverable so history can remain intact.")}
    <section class="grid">
      <article class="panel full">
        ${state.archives.length ? archiveList() : `<div class="empty">Nothing has been archived yet.</div>`}
      </article>
    </section>
  `;
}

function archiveList() {
  return `
    <div class="list">
      ${state.archives.map((entry) => `
        <div class="record-row">
          <div>
            <strong>${escapeHtml(entry.label)}</strong>
            <p class="muted">${escapeHtml(titleCase(entry.entityType))} · archived ${new Date(entry.archivedAt).toLocaleString()}</p>
          </div>
          <div class="actions">
            <button class="btn" data-restore="${entry.id}" type="button">Restore</button>
            <button class="btn warn" data-delete-archive="${entry.id}" type="button">Delete</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function backupView() {
  return `
    ${topbar("Backup", "Export or restore the local workspace data.")}
    <section class="grid">
      <article class="panel">
        <h3>Export</h3>
        <p class="muted">Creates a JSON backup of settings, users, audit history, and archived records.</p>
        <button class="btn primary" id="exportButton" type="button">Export backup</button>
      </article>
      <article class="panel">
        <h3>Restore</h3>
        <p class="muted">Imports a backup file into this device. Existing matching records are updated.</p>
        <input id="importFile" type="file" accept="application/json">
      </article>
    </section>
  `;
}

function userModal(user = null) {
  const isEdit = Boolean(user);
  const pinLabel = isEdit ? "New PIN, optional" : "PIN";
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true">
      <form class="modal" id="userForm" data-user-id="${user?.id || ""}">
        <h2>${isEdit ? "Edit User" : "Add User"}</h2>
        <label class="field">
          Name
          <input name="name" required value="${escapeHtml(user?.name || "")}">
        </label>
        <label class="field">
          Role
          <select name="role" required>
            ${["chef_admin", "chef", "captain", "chief_stew", "crew", "viewer"].map((role) => `<option value="${role}" ${user?.role === role ? "selected" : ""}>${roleLabel(role)}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          ${pinLabel}
          <input name="pin" ${isEdit ? "" : "required"} minlength="4" inputmode="numeric" type="password">
        </label>
        <div class="actions">
          <button class="btn primary" type="submit">${isEdit ? "Save user" : "Create user"}</button>
          <button class="btn" id="closeModal" type="button">Cancel</button>
        </div>
      </form>
    </div>
  `;
}

function recordModal(entityType, record = null) {
  const meta = ENTITIES[entityType];
  const isEdit = Boolean(record);
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true">
      <form class="modal" id="recordForm" data-entity-type="${entityType}" data-record-id="${record?.id || ""}">
        <h2>${isEdit ? `Edit ${meta.singular}` : `Add ${meta.singular}`}</h2>
        ${meta.fields.map((field) => fieldInput(field, record || {})).join("")}
        <div class="actions">
          <button class="btn primary" type="submit">${isEdit ? "Save changes" : `Create ${meta.singular.toLowerCase()}`}</button>
          <button class="btn" id="closeModal" type="button">Cancel</button>
        </div>
      </form>
    </div>
  `;
}

function fieldInput([name, label, type, required], record) {
  const value = record[name] ?? "";
  const requiredAttr = required ? "required" : "";
  if (type === "textarea") {
    return `
      <label class="field">
        ${escapeHtml(label)}
        <textarea name="${name}" ${requiredAttr}>${escapeHtml(value)}</textarea>
      </label>
    `;
  }
  if (type === "checkbox") {
    return `
      <label class="check-field">
        <input name="${name}" type="checkbox" ${value ? "checked" : ""}>
        <span>${escapeHtml(label)}</span>
      </label>
    `;
  }
  if (type?.startsWith("select:")) {
    const options = type.replace("select:", "").split("|");
    return selectField(name, label, options.map((option) => [option, option]), value, required);
  }
  if (type === "charter") {
    return selectField(name, label, activeRecords("charters").map((item) => [item.id, item.name]), value, required, "Unassigned");
  }
  if (type === "ingredient") {
    return selectField(name, label, activeRecords("ingredients").map((item) => [item.id, item.name]), value, required, "Choose ingredient");
  }
  if (type === "source") {
    return selectField(name, label, activeRecords("sources").map((item) => [item.id, item.name]), value, required, "Unassigned");
  }
  return `
    <label class="field">
      ${escapeHtml(label)}
      <input name="${name}" type="${type || "text"}" ${requiredAttr} value="${escapeHtml(value)}">
    </label>
  `;
}

function selectField(name, label, options, value, required, placeholder = "Select") {
  const requiredAttr = required ? "required" : "";
  return `
    <label class="field">
      ${escapeHtml(label)}
      <select name="${name}" ${requiredAttr}>
        <option value="">${escapeHtml(placeholder)}</option>
        ${options.map(([optionValue, optionLabel]) => `<option value="${escapeHtml(optionValue)}" ${String(value) === String(optionValue) ? "selected" : ""}>${escapeHtml(optionLabel)}</option>`).join("")}
      </select>
    </label>
  `;
}

function wireSetup() {
  document.querySelector("#setupForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const timestamp = now();
    const settings = {
      id: "workspace",
      appName: form.get("appName").trim(),
      vesselName: form.get("vesselName").trim(),
      brandLabel: DEFAULT_SETTINGS.brandLabel,
      accent: DEFAULT_SETTINGS.accent,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    const salt = uid("salt");
    const user = {
      id: uid("user"),
      name: form.get("name").trim(),
      role: "chef_admin",
      pinSalt: salt,
      pinHash: await hashPin(form.get("pin"), salt),
      createdAt: timestamp,
      updatedAt: timestamp,
      archivedAt: null
    };
    await put("settings", settings);
    await put("users", user);
    state.settings = settings;
    state.users = [user];
    setSession(user);
    await logAudit("create", "workspace", "workspace", "ParadiseChefs workspace created");
    await logAudit("create", "users", user.id, `${user.name} created as Chef Admin`);
    await loadState();
    render();
  });
}

function wireUnlock() {
  document.querySelector("#unlockForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const user = state.users.find((candidate) => candidate.id === form.get("userId"));
    if (!user) return;
    const pinHash = await hashPin(form.get("pin"), user.pinSalt);
    if (pinHash !== user.pinHash) {
      toast("That PIN did not match.");
      return;
    }
    setSession(user);
    await logAudit("unlock", "users", user.id, `${user.name} unlocked workspace`);
    render();
  });
}

function wireShell() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      render();
    });
  });
  document.querySelector("#lockButton").addEventListener("click", () => {
    setSession(null);
    render();
  });
  document.querySelector("#settingsForm")?.addEventListener("submit", saveSettings);
  document.querySelector("#newUserButton")?.addEventListener("click", () => openUserModal());
  document.querySelectorAll("[data-new-record]").forEach((button) => {
    button.addEventListener("click", () => openRecordModal(button.dataset.newRecord));
  });
  document.querySelectorAll("[data-edit-record]").forEach((button) => {
    button.addEventListener("click", () => {
      const [entityType, id] = button.dataset.editRecord.split(":");
      openRecordModal(entityType, state[entityType].find((record) => record.id === id));
    });
  });
  document.querySelectorAll("[data-archive-record]").forEach((button) => {
    button.addEventListener("click", () => {
      const [entityType, id] = button.dataset.archiveRecord.split(":");
      archiveRecord(entityType, id);
    });
  });
  document.querySelectorAll("[data-edit-user]").forEach((button) => {
    button.addEventListener("click", () => openUserModal(state.users.find((user) => user.id === button.dataset.editUser)));
  });
  document.querySelectorAll("[data-archive-user]").forEach((button) => {
    button.addEventListener("click", () => archiveRecord("users", button.dataset.archiveUser));
  });
  document.querySelectorAll("[data-restore]").forEach((button) => {
    button.addEventListener("click", () => restoreArchive(button.dataset.restore));
  });
  document.querySelectorAll("[data-delete-archive]").forEach((button) => {
    button.addEventListener("click", () => deleteArchive(button.dataset.deleteArchive));
  });
  document.querySelector("#exportButton")?.addEventListener("click", exportBackup);
  document.querySelector("#importFile")?.addEventListener("change", importBackup);
}

async function saveSettings(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const settings = {
    ...state.settings,
    appName: form.get("appName").trim(),
    vesselName: form.get("vesselName").trim(),
    brandLabel: form.get("brandLabel").trim(),
    accent: form.get("accent"),
    updatedAt: now()
  };
  await put("settings", settings);
  state.settings = settings;
  await logAudit("update", "settings", "workspace", "ParadiseChefs settings updated");
  render();
  toast("ParadiseChefs saved.");
}

function openUserModal(user = null) {
  document.body.insertAdjacentHTML("beforeend", userModal(user));
  document.querySelector("#closeModal").addEventListener("click", closeModal);
  document.querySelector("#userForm").addEventListener("submit", saveUser);
}

function openRecordModal(entityType, record = null) {
  document.body.insertAdjacentHTML("beforeend", recordModal(entityType, record));
  document.querySelector("#closeModal").addEventListener("click", closeModal);
  document.querySelector("#recordForm").addEventListener("submit", saveRecord);
}

function closeModal() {
  document.querySelector(".modal-backdrop")?.remove();
}

async function saveUser(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const id = event.currentTarget.dataset.userId;
  const existing = state.users.find((user) => user.id === id);
  const timestamp = now();
  const user = existing ? { ...existing } : { id: uid("user"), createdAt: timestamp, archivedAt: null };
  user.name = form.get("name").trim();
  user.role = form.get("role");
  user.updatedAt = timestamp;
  const pin = form.get("pin");
  if (pin) {
    user.pinSalt = uid("salt");
    user.pinHash = await hashPin(pin, user.pinSalt);
  }
  await put("users", user);
  await loadState();
  await logAudit(existing ? "update" : "create", "users", user.id, `${user.name} ${existing ? "updated" : "created"}`);
  closeModal();
  render();
  toast(existing ? "User updated." : "User created.");
}

async function saveRecord(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const entityType = event.currentTarget.dataset.entityType;
  const meta = ENTITIES[entityType];
  const id = event.currentTarget.dataset.recordId;
  const existing = state[entityType].find((record) => record.id === id);
  const timestamp = now();
  const record = existing ? { ...existing } : { id: uid(entityType), createdAt: timestamp, archivedAt: null };

  for (const [name, , type] of meta.fields) {
    if (type === "checkbox") {
      record[name] = form.has(name);
    } else if (type === "number") {
      const value = form.get(name);
      record[name] = value === "" || value === null ? "" : Number(value);
    } else {
      record[name] = String(form.get(name) || "").trim();
    }
  }

  if (entityType === "inventory") {
    record.displayName = ingredientName(record.ingredientId) || "Inventory item";
    const ingredient = state.ingredients.find((item) => item.id === record.ingredientId);
    if (ingredient) {
      record.unit = record.unit || ingredient.unit || "";
      record.zone = record.zone || ingredient.storageDefault || "";
      record.lowStockThreshold = record.lowStockThreshold === "" ? Number(ingredient.lowStockDefault || 0) : record.lowStockThreshold;
    }
  }

  record.updatedAt = timestamp;
  await put(meta.store, record);
  await loadState();
  await logAudit(existing ? "update" : "create", entityType, record.id, `${recordTitle(entityType, record)} ${existing ? "updated" : "created"}`);
  closeModal();
  render();
  toast(`${meta.singular} ${existing ? "updated" : "created"}.`);
}

async function archiveRecord(entityType, id) {
  const meta = ENTITIES[entityType];
  if (!meta) return;
  const record = state[entityType].find((item) => item.id === id);
  if (!record) return;
  const archived = { ...record, archivedAt: now(), updatedAt: now() };
  await put(meta.store, archived);
  const archive = {
    id: uid("archive"),
    entityType,
    entityId: id,
    label: record.name || record.title || id,
    archivedAt: archived.archivedAt,
    snapshot: archived
  };
  await put("archives", archive);
  await logAudit("archive", entityType, id, `${archive.label} archived`);
  await loadState();
  render();
  toast(`${meta.singular} archived.`);
}

async function restoreArchive(archiveId) {
  const archive = state.archives.find((item) => item.id === archiveId);
  if (!archive) return;
  const meta = ENTITIES[archive.entityType];
  if (!meta) return;
  const restored = { ...archive.snapshot, archivedAt: null, updatedAt: now() };
  await put(meta.store, restored);
  await remove("archives", archive.id);
  await logAudit("restore", archive.entityType, archive.entityId, `${archive.label} restored`);
  await loadState();
  render();
  toast(`${meta.singular} restored.`);
}

async function deleteArchive(archiveId) {
  const archive = state.archives.find((item) => item.id === archiveId);
  if (!archive) return;
  const ok = confirm(`Permanently delete archived record "${archive.label}"? This cannot be undone.`);
  if (!ok) return;
  await remove("archives", archive.id);
  await logAudit("delete", archive.entityType, archive.entityId, `${archive.label} deleted from archive`);
  await loadState();
  render();
  toast("Archived record deleted.");
}

async function exportBackup() {
  const stores = {};
  for (const store of STORES) {
    stores[store] = await getAll(store);
  }
  const backup = {
    schemaVersion: DB_VERSION,
    exportedAt: now(),
    stores
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const cleanName = (state.settings.vesselName || "workspace").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  link.href = url;
  link.download = `${cleanName || "workspace"}-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  await logAudit("export", "backup", "workspace", "ParadiseChefs backup exported");
  await loadState();
  render();
}

async function importBackup(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const text = await file.text();
  const backup = JSON.parse(text);
  if (!backup.stores) {
    toast("That file is not a workspace backup.");
    return;
  }
  for (const store of STORES) {
    for (const record of backup.stores[store] || []) {
      await put(store, record);
    }
  }
  await logAudit("import", "backup", "workspace", "ParadiseChefs backup imported");
  await loadState();
  render();
  toast("Backup imported.");
}

function toast(message) {
  let target = document.querySelector("#toast");
  if (!target) {
    target = document.createElement("div");
    target.id = "toast";
    target.className = "toast";
    document.body.append(target);
  }
  target.textContent = message;
  target.classList.remove("hidden");
  setTimeout(() => target.classList.add("hidden"), 2800);
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    await navigator.serviceWorker.register("./sw.js");
  } catch (error) {
    console.warn("Service worker registration failed", error);
  }
}

window.addEventListener("online", () => {
  state.online = true;
  render();
});

window.addEventListener("offline", () => {
  state.online = false;
  render();
});

db = await openDb();
await loadState();
await registerServiceWorker();
render();
