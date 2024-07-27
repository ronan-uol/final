
export interface User {
    name: string;
    email: string;
    password: string;
}

export interface UserWithId extends Omit<User, "password"> {
    id: string;
}