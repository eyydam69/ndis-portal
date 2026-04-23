/**
 * Defines the configuration for a single table column.
 */
export interface TableColumn {
  key: string; // The property name from the data object (e.g., 'service')
  label: string; // The display text for the table header
  type?: 'text' | 'badge' | 'action' | 'category'; // UI variants
}
