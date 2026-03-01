import React from 'react';

interface UserBadgeProps {
    type: 'vip' | 'creator';
    size?: number | string;
    className?: string;
}

export const UserBadge: React.FC<UserBadgeProps> = ({ type, size = 18, className = "" }) => {
    const badgeStyle = {
        width: size,
        height: size,
        objectFit: 'contain' as const,
    };

    if (type === 'vip') {
        return (
            <div className={`inline-flex items-center justify-center ${className}`}>
                <img
                    src="/icons/vip_badge_light_mode.png"
                    alt="VIP Badge"
                    style={badgeStyle}
                    className="dark:hidden block"
                />
                <img
                    src="/icons/vip_badge_dark_mode.png"
                    alt="VIP Badge"
                    style={badgeStyle}
                    className="hidden dark:block"
                />
            </div>
        );
    }

    if (type === 'creator') {
        return (
            <div className={`inline-flex items-center justify-center ${className}`}>
                <img
                    src="/icons/creator_certified_badge_light_mode.png"
                    alt="Creator Certified"
                    style={badgeStyle}
                    className="dark:hidden block"
                />
                <img
                    src="/icons/creator_certified_vadge_dark_mode.png"
                    alt="Creator Certified"
                    style={badgeStyle}
                    className="hidden dark:block"
                />
            </div>
        );
    }

    return null;
};
