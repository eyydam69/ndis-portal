/**
 * Defines the configuration for a single action in the menu.
 */
export interface TableAction {
  label: string; // The text shown in the menu (e.g., 'Approve')
  actionKey: string; // The identifier sent to the parent (e.g., 'approve')
  class?: string; // Optional Tailwind classes for styling
}

/**
 * Defines the configuration for a single table column.
 */
export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'action' | 'category' | 'name' | 'status' | 'view';
  actionLabel?: string; // Optional: Single button custom text[cite: 17]
  actions?: TableAction[]; // Optional: Array for multiple menu items[cite: 17]
}
