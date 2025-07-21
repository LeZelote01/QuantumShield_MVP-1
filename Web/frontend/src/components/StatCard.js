import React from 'react';

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'quantum',
  trend = null,
  onClick = null 
}) => {
  const colorClasses = {
    quantum: 'bg-gradient-to-r from-quantum-500 to-quantum-600',
    green: 'bg-gradient-to-r from-green-500 to-green-600',
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600',
    orange: 'bg-gradient-to-r from-orange-500 to-orange-600'
  };

  const cardClass = `
    ${colorClasses[color]} text-white rounded-lg p-6 shadow-lg transform transition-all duration-200
    ${onClick ? 'cursor-pointer hover:scale-105' : ''}
  `;

  return (
    <div className={cardClass} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-white/70 text-sm mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <span className={`${trend.isPositive ? 'text-green-300' : 'text-red-300'}`}>
                {trend.isPositive ? '↗' : '↘'} {trend.value}
              </span>
              <span className="text-white/70 ml-1">{trend.period}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="bg-white/20 p-3 rounded-lg">
            <Icon className="h-8 w-8 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;