import { User } from '@prisma/client';
export declare const getUserByEmail: (email: string) => Promise<({
    twoFactorConfirmation: {
        id: string;
        userId: string;
    } | null;
    accounts: {
        id: string;
        userId: string;
        type: string;
        provider: string;
        providerAccountId: string;
        refresh_token: string | null;
        access_token: string | null;
        expires_at: number | null;
        token_type: string | null;
        scope: string | null;
        id_token: string | null;
        session_state: string | null;
    }[];
} & {
    name: string | null;
    id: string;
    email: string;
    lastName: string | null;
    emailVerified: Date | null;
    image: string | null;
    password: string | null;
    contactNumber: string | null;
    terms: boolean;
    role: import(".prisma/client").$Enums.UserRole;
    isTwoFactorEnabled: boolean;
    groupIds: string[];
    tagIds: string[];
    resourceIds: string[];
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date | null;
}) | null>;
export declare const getUserById: (id: string) => Promise<({
    twoFactorConfirmation: {
        id: string;
        userId: string;
    } | null;
    accounts: {
        id: string;
        userId: string;
        type: string;
        provider: string;
        providerAccountId: string;
        refresh_token: string | null;
        access_token: string | null;
        expires_at: number | null;
        token_type: string | null;
        scope: string | null;
        id_token: string | null;
        session_state: string | null;
    }[];
} & {
    name: string | null;
    id: string;
    email: string;
    lastName: string | null;
    emailVerified: Date | null;
    image: string | null;
    password: string | null;
    contactNumber: string | null;
    terms: boolean;
    role: import(".prisma/client").$Enums.UserRole;
    isTwoFactorEnabled: boolean;
    groupIds: string[];
    tagIds: string[];
    resourceIds: string[];
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date | null;
}) | null>;
export declare const getUsers: () => Promise<({
    twoFactorConfirmation: {
        id: string;
        userId: string;
    } | null;
    accounts: {
        id: string;
        userId: string;
        type: string;
        provider: string;
        providerAccountId: string;
        refresh_token: string | null;
        access_token: string | null;
        expires_at: number | null;
        token_type: string | null;
        scope: string | null;
        id_token: string | null;
        session_state: string | null;
    }[];
} & {
    name: string | null;
    id: string;
    email: string;
    lastName: string | null;
    emailVerified: Date | null;
    image: string | null;
    password: string | null;
    contactNumber: string | null;
    terms: boolean;
    role: import(".prisma/client").$Enums.UserRole;
    isTwoFactorEnabled: boolean;
    groupIds: string[];
    tagIds: string[];
    resourceIds: string[];
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date | null;
})[] | null>;
export declare const updateUserById: (id: string, data: Partial<User>) => Promise<{
    name: string | null;
    id: string;
    email: string;
    lastName: string | null;
    emailVerified: Date | null;
    image: string | null;
    password: string | null;
    contactNumber: string | null;
    terms: boolean;
    role: import(".prisma/client").$Enums.UserRole;
    isTwoFactorEnabled: boolean;
    groupIds: string[];
    tagIds: string[];
    resourceIds: string[];
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date | null;
}>;
export declare const deleteUserById: (userId: string) => Promise<void>;
