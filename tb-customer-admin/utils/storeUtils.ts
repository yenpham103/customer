export const validateDomain = (domain: string): boolean => {
    const domainRegex = /^[a-z0-9-]+\.myshopify\.com$/i;
    return domainRegex.test(domain.trim());
};

export const formatDate = (dateString: string) => {
    if (!dateString) return '';

    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
};

export const getPlanBadgeTone = (planName: string) => {
    switch (planName) {
        case 'partner_test':
            return 'info';
        case 'basic':
            return 'success';
        case 'professional':
            return 'warning';
        case 'unlimited':
            return 'critical';
        default:
            return 'new';
    }
};

export const formatPlanName = (planName: string): string => {
    if (!planName) return '';

    return planName
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export const formatAppName = (appName: string): string => {
    const appMapping: Record<string, string> = {
        'lock': 'B2B BSS Lock',
        'solution': 'B2B BSS Solution',
        'portal': 'B2B BSS Portal'
    };

    return appMapping[appName.toLowerCase()] || appName;
};

export const getTimeSinceCreated = (createdAt: string | undefined): string => {
    if (!createdAt) return '0 months';

    const created = new Date(createdAt);
    const now = new Date();

    const months = (now.getFullYear() - created.getFullYear()) * 12 +
        (now.getMonth() - created.getMonth());

    if (months < 12) {
        return `${months} months`;
    } else {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        if (remainingMonths === 0) {
            return `${years} ${years === 1 ? 'year' : 'years'}`;
        } else {
            return `${years}y ${remainingMonths}m`;
        }
    }
};