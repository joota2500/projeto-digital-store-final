import React from 'react';

// Componente de seção reutilizável com título e link opcional
const Section = ({ title, titleAlign = 'left', link, children, className = '' }) => {
  return (
    <section className={`py-8 ${className}`}>
      <div className={`flex items-center mb-6 ${titleAlign === 'center' ? 'justify-center' : 'justify-between'}`}>
        <h2 className={`text-2xl font-bold text-dark-gray-2 ${titleAlign === 'center' ? 'text-center w-full' : ''}`}>
          {title}
        </h2>
        {link && (
          <a href={link.href} className="text-primary text-lg font-medium hover:underline">
            {link.text}
          </a>
        )}
      </div>
      {children}
    </section>
  );
};

export default Section;
