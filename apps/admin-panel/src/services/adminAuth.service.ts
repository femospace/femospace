export const AdminRole = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    MANAGER: 'MANAGER',
    SUPPORT_AGENT: 'SUPPORT_AGENT',
    COMPLAINT_SPECIALIST: 'COMPLAINT_SPECIALIST',
    GENERAL_STAFF: 'GENERAL_STAFF'
} as const;

export type AdminRoleType = typeof AdminRole[keyof typeof AdminRole];

export interface AdminUser {
    id: string;
    firstName: string;
    lastName: string;
    serviceNumber: string;
    role: AdminRoleType;
    department?: string;
    notes?: string;
}

const SUPER_ADMIN_SEED: AdminUser & { secretKey: string } = {
    id: '1',
    firstName: 'Shan',
    lastName: 'Sandaruwan',
    serviceNumber: '0209990701114440',
    secretKey: 'F6*95SP62*05In',
    role: AdminRole.SUPER_ADMIN
};

class AdminAuthService {
    private employees: (AdminUser & { secretKey: string })[] = [];
    private currentUser: AdminUser | null = null;

    constructor() {
        try {
            const saved = localStorage.getItem('admin_employees');
            if (saved) {
                this.employees = JSON.parse(saved);
                if (!Array.isArray(this.employees)) {
                    throw new Error('Stored employees is not an array');
                }
                // Ensure Super Admin is always present (in case of stale or corrupted localStorage)
                const hasSuperAdmin = this.employees.some(e => e.id === '1');
                if (!hasSuperAdmin) {
                    this.employees = [SUPER_ADMIN_SEED, ...this.employees];
                    this.save();
                }
            } else {
                this.employees = [SUPER_ADMIN_SEED];
                this.save();
            }
        } catch (e) {
            console.error('Failed to load admin employees, resetting to seed', e);
            this.employees = [SUPER_ADMIN_SEED];
            this.save();
        }

        try {
            const session = localStorage.getItem('admin_session');
            if (session) {
                this.currentUser = JSON.parse(session);
            }
        } catch (e) {
            console.error('Failed to load admin session', e);
            localStorage.removeItem('admin_session');
            this.currentUser = null;
        }
    }

    async login(firstName: string, lastName: string, serviceNumber: string, secretKey: string): Promise<AdminUser | null> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const cleanFirstName = firstName.trim();
        const cleanLastName = lastName.trim();
        const cleanServiceNumber = serviceNumber.trim();
        const cleanSecretKey = secretKey.trim();

        // Also allow matching against the seed directly as a fallback if localStorage becomes deeply broken
        const user = this.employees.find(e =>
            e.firstName === cleanFirstName &&
            e.lastName === cleanLastName &&
            e.serviceNumber === cleanServiceNumber &&
            e.secretKey === cleanSecretKey
        ) || (
                cleanFirstName === SUPER_ADMIN_SEED.firstName &&
                    cleanLastName === SUPER_ADMIN_SEED.lastName &&
                    cleanServiceNumber === SUPER_ADMIN_SEED.serviceNumber &&
                    cleanSecretKey === SUPER_ADMIN_SEED.secretKey
                    ? SUPER_ADMIN_SEED
                    : undefined
            );

        if (user) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { secretKey: _, ...safeUser } = user;
            this.currentUser = safeUser;
            localStorage.setItem('admin_session', JSON.stringify(safeUser));
            return safeUser;
        }

        return null;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('admin_session');
    }

    getCurrentUser(): AdminUser | null {
        return this.currentUser;
    }

    registerEmployee(data: Omit<AdminUser, 'id'> & { secretKey: string }, initiator: AdminUser): AdminUser {
        if (initiator.role !== AdminRole.SUPER_ADMIN) {
            throw new Error('Only Super Admin can register employees');
        }

        const newEmployee = {
            ...data,
            id: Math.random().toString(36).substr(2, 9)
        };

        this.employees.push(newEmployee);
        this.save();

        const { secretKey: _, ...safeEmployee } = newEmployee;
        return safeEmployee;
    }

    getEmployees(initiator: AdminUser): AdminUser[] {
        if (initiator.role !== AdminRole.SUPER_ADMIN && initiator.role !== AdminRole.MANAGER) {
            throw new Error('Unauthorized access to employee list');
        }
        // Return without secret keys
        return this.employees.map(({ secretKey, ...safe }) => safe);
    }

    private save() {
        localStorage.setItem('admin_employees', JSON.stringify(this.employees));
    }
}

export const adminAuthService = new AdminAuthService();
