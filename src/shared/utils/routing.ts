export const getTargetRoute = (user: any, lastGuard: string | null): string => {
    const empRole = user.employee_role || '';
    const userRoles = user.roles || [];

    const hasRole = (role: string) => userRoles.includes(role) || empRole === role;
    
    let targetRoute = '/(auth)/login';

    if (hasRole('admin')) targetRoute = '/(admin)/dashboard';
    else if (hasRole('gomla')) targetRoute = '/(gomla)/dashboard';
    else if (hasRole('employee') || ['employee', 'reviewer', 'preparation', 'control', 'distribution'].some(hasRole)) targetRoute = '/(employee)/dashboard';
    else targetRoute = '/(pharmacy)';

    // Override based on the last visited dashboard if user has permissions
    if ((lastGuard === 'reviewer' || lastGuard === 'employee') && (hasRole('admin') || user.can_access_reviewer || user.canAccessReviewer || ['employee', 'reviewer', 'preparation', 'control', 'distribution', 'gomla'].some(hasRole))) {
        targetRoute = '/(employee)/dashboard';
    } else if (lastGuard === 'admin' && hasRole('admin')) {
        targetRoute = '/(admin)/dashboard';
    } else if (lastGuard === 'gomla' && (hasRole('admin') || hasRole('gomla'))) {
        targetRoute = '/(gomla)/dashboard';
    } else if (lastGuard === 'pharmacist' && (hasRole('admin') || hasRole('pharmacist') || hasRole('pharmacy'))) {
        targetRoute = '/(pharmacy)';
    }

    return targetRoute;
};