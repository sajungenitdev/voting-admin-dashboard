import React from 'react';

const EmptyState = ({ title, description, icon, action }) => {
  return (
    <div className="text-center py-12 bg-black rounded-2xl border border-red-500/20">
      <div className="text-6xl mb-4">{icon || '📭'}</div>
      <h3 className="text-lg font-medium text-white">{title || 'No data found'}</h3>
      <p className="text-white/40 mt-1">{description || 'No records available'}</p>
      {action && action.onClick && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 rounded-xl text-white text-sm font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;