import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No data available',
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      {icon || <Inbox size={48} className="mb-4 text-gray-400" />}
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
};

