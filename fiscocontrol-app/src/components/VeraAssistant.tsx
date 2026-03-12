"use client";
import React, { useState } from 'react';

export const VeraAssistant: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button 
            className="btn-vera-float vera-pulse"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => window.open('https://www.veri.com.br', '_blank')}
            title="Assistente Vera IA"
        >
            <img 
                src={isHovered ? "/vera-ia/vera_acenando.gif" : "/vera-ia/vera.png"} 
                alt="Vera IA" 
            />
            <span className="vera-badge">1</span>
            <div className="vera-tooltip">
                💬 Olá! Eu sou a Vera. Como posso ajudar com sua gestão fiscal hoje?
            </div>
        </button>
    );
};
