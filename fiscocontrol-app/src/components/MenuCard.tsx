"use client";

import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MenuCardProps {
    title: string;
    description?: string;
    icon: LucideIcon;
    href: string;
    badge?: string;
    badgeVariant?: 'red' | 'orange' | 'green' | 'blue';
}

const MenuCard: React.FC<MenuCardProps> = ({ 
    title, 
    description, 
    icon: Icon, 
    href, 
    badge,
    badgeVariant = 'green',
}) => {
    const router = useRouter();
    const [isActive, setIsActive] = useState(false);

    const handleClick = () => {
        setIsActive(true);
        setTimeout(() => {
            router.push(href);
        }, 150);
    };

    return (
        <div 
            className={`menu-card ${isActive ? 'variant-blue' : ''}`}
            onClick={handleClick}
            onMouseLeave={() => setIsActive(false)}
        >
            <div className="menu-card-left">
                <Icon size={22} className="menu-card-icon" />
                <span className="menu-card-title">{title}</span>
            </div>
            
            {badge && (
                <span className="menu-card-badge-new">
                    {badge}
                </span>
            )}

            <style jsx>{`
                .menu-card {
                    background: #ffffff;
                    border: 1px solid #eef0f2;
                    border-radius: 8px;
                    padding: 0 16px;
                    height: 54px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    position: relative;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }

                .menu-card.variant-blue {
                    background: #3b82f6;
                    border-color: #3b82f6;
                }

                .menu-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    transform: translateY(-1px);
                    border-color: #3b82f6;
                }

                .menu-card.variant-blue:hover {
                    background: #2563eb;
                }

                .menu-card-left {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .menu-card-icon {
                    color: #3b82f6;
                    flex-shrink: 0;
                }

                .variant-blue .menu-card-icon {
                    color: #ffffff;
                }

                .menu-card-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #4b5563;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .variant-blue .menu-card-title {
                    color: #ffffff;
                }

                .menu-card-badge-new {
                    background: #4ade80;
                    color: #ffffff;
                    font-size: 9px;
                    font-weight: 700;
                    padding: 3px 6px;
                    border-radius: 4px;
                    text-transform: uppercase;
                }
            `}</style>
        </div>
    );
};

export default MenuCard;
