export interface UserClaims {
    sub: string;
    email: string;
    name: string;
    roles: string[];
    exp: number;
}

export interface Task {
    id: number;
    title: string;
    completed: boolean;
    userId: number;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: Date;
}
