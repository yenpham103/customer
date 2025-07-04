import { useSession } from 'next-auth/react'

export function usePermissions() {
    const { data: session } = useSession()

    const hasPermission = (page: string, action: 'view' | 'edit') => {
        if (!session?.user?.permissions) return false

        if (session.user.role === 'root') return true

        let pageName = page
        if (page === 'store-data') pageName = 'storeData'
        if (page === 'user-administration') pageName = 'userAdministration'
        if (page === 'ignored-nicknames') pageName = 'ignoredNicknames'

        const permissionKey = `${pageName}${action.charAt(0).toUpperCase() + action.slice(1)}`
        return session.user.permissions[permissionKey] === true
    }

    const canViewPage = (page: string) => hasPermission(page, 'view')
    const canEditPage = (page: string) => hasPermission(page, 'edit')

    const canViewDashboardGuest = () => {
        if (session?.user?.role === 'root') return true
        return session?.user?.permissions?.dashboardGuest === true
    }

    const isRoot = () => session?.user?.role === 'root'
    const canManageUsers = () => isRoot()
    const canManagePermissions = () => isRoot()

    return {
        hasPermission,
        canViewPage,
        canEditPage,
        canViewDashboardGuest,

        canManageUsers,
        canManagePermissions,

        userRole: session?.user?.role,
        permissions: session?.user?.permissions,
        isRoot: isRoot(),
        isAdmin: session?.user?.role === 'admin'
    }
}
