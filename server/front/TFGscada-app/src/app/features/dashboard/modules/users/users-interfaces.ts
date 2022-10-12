export interface IUser {
    id: number;
    name: string;
    telephone: string;
    celular: string;
    address: string;
    email: string;
    dni: string;
    roles: number;
    user_name: string;
    roleText: string | undefined;
    pass: string | undefined;
}

export const RoleText: string[] = ['Administrador', 'Operario', 'Usuario']