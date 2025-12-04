import React from 'react';

const ParameterCard = ({ title, value, unit, icon, color, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center space-x-4 transform hover:scale-105 transition-transform duration-200 transition-colors ${onClick ? 'cursor-pointer' : ''}`}
        >
            <div className={`p-3 rounded-full ${color} text-white`}>
                {icon}
            </div>
            <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
                <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span>
                </div>
            </div>
        </div>
    );
};

export default ParameterCard;
