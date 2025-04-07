export interface IMenu {
    id: number;
    name: string;
    path?: string;
    icon?: string;
    category?: number;
    createdBy?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedAt?: string;
    isActive?: boolean;
}
