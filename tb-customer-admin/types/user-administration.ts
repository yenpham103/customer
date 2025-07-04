export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'pma' | 'ctv' | 'cse' | 'dev' | 'root';
  avatar?: string;
  permissions: RolePermissions;
}

export interface Role {
  id: string;
  name: string;
  assignedTo: number;
  createdAt: string;
}

export interface PagePermission {
  id: string;
  name: string;
  hasCollapsible: boolean;
}

export interface RolePermissions {
  [roleId: string]: {
    [pageId: string]: boolean;
  };
}