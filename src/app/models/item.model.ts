export interface Item {
  id?: string; // Database ID
  name: string; // Item Name
  nameSearch: string; // Item Name for Searching (Lowercase)
  type: 'AV' | 'Book'; // Category of Item --> Book or AV
  stock: 'In' | 'Out' | 'Over'; // Item Stock Status
  sku: string; // SKU of Item
  borrowed: Array<Borrow>; // Array of Borrowed Item History
}

interface Borrow {
  user: string; // Name of Borrower
  checkout: number; // Date Borrowed
  due: number; // Date Due
  return: number; // Date Returned
}
