import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'pending' | 'done' | 'late';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'pending', className = '' }) => {
    const variantClass = {
        pending: 'badge-pending',
        done: 'badge-done',
        late: 'badge-late',
    }[variant];

    return (
        <span className={`badge ${variantClass} ${className}`}>
            {children}
        </span>
    );
};
