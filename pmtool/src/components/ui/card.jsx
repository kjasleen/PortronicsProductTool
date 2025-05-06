// src/components/ui/card.jsx
import React from 'react';

export const Card = ({ children, title }) => {
  return (
    <div className="border p-4 rounded shadow-md">
      {title && <h3 className="text-xl font-semibold">{title}</h3>}
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return <div className="mt-2">{children}</div>;
};
