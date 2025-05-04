import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function StatusCard({
  title,
  value,
  description,
  icon,
  color,
  link,
}) {
  const CardWrapper = ({ children }) => {
    if (link) {
      return (
        <Link
          to={link}
          className="block transition-transform hover:-translate-y-1"
        >
          {children}
        </Link>
      );
    }
    return <>{children}</>;
  };

  return (
    <CardWrapper>
      <Card className="overflow-hidden">
        <div className={`h-1.5 ${color}`} />
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <p className="text-3xl font-bold mt-1">{value}</p>
              <p className="text-xs text-gray-500 mt-1.5">{description}</p>
            </div>
            <div
              className={`h-12 w-12 rounded-lg flex items-center justify-center ${color
                .replace('bg-', 'bg-')
                .replace('500', '100')}`}
            >
              <div className={`${color.replace('bg-', 'text-')}`}>{icon}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}
