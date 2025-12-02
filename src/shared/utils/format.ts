export const formatUtils = {
    // Currency formatting (Indian Rupees)
    formatCurrency: (amount: number): string => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
        }).format(amount);
    },

    // Format number without currency symbol
    formatNumber: (amount: number): string => {
        return new Intl.NumberFormat('en-IN').format(amount);
    },

    // Format date
    formatDate: (date: Date | string | null | undefined): string => {
        if (!date) return '-';
        const d = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    },

    // Format date with time
    formatDateTime: (date: Date | string | null | undefined): string => {
        if (!date) return '-';
        const d = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    },

    // Format time only
    formatTime: (date: Date | string | null | undefined): string => {
        if (!date) return '-';
        const d = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    },

    // Format relative time (e.g., "2 hours ago")
    formatRelativeTime: (date: Date | string | null | undefined): string => {
        if (!date) return '';
        const d = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(d.getTime())) return '';
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSecs < 60) return 'just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return formatUtils.formatDate(d);
    },

    // Format phone number
    formatPhoneNumber: (phone: string): string => {
        // Remove all non-numeric characters
        const cleaned = phone.replace(/\D/g, '');

        // Format as Indian phone number
        if (cleaned.length === 10) {
            return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
        }

        return phone;
    },

    // Format weight
    formatWeight: (weight: number, unit: string = 'kg'): string => {
        return `${weight.toFixed(3)} ${unit}`;
    },

    // Format quantity
    formatQuantity: (quantity: number, unit: string = 'bags'): string => {
        return `${quantity} ${unit}`;
    },

    // Truncate text
    truncateText: (text: string, maxLength: number): string => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    },

    // Capitalize first letter
    capitalize: (text: string): string => {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },

    // Title case
    titleCase: (text: string): string => {
        return text.replace(/\w\S*/g, (txt) =>
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    },

    // Format percentage
    formatPercentage: (value: number, decimals: number = 1): string => {
        return `${value.toFixed(decimals)}%`;
    },

    // Calculate days between dates
    daysBetween: (startDate: Date | string, endDate: Date | string): number => {
        const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
        const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
};
