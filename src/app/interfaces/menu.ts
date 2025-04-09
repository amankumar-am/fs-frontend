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


export interface IUserMenu {
    userId: number,
    userLoginId: string,
    userName: string,
    userEmail: string,
    userProfileImage: string,
    menuId: number,
    menuName: string,
    menuPath: string,
    menuIcon: string,
    menuCategory: number,
    canAdd: boolean,
    canDelete: boolean,
    canUpdate: boolean,
    canView: boolean,
}
