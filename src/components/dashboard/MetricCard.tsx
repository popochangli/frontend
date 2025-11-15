import React from 'react';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  loading?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  loading = false,
  trend,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {loading ? (
            <SkeletonLoader lines={1} className="h-8 w-24" />
          ) : (
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          )}
          {trend && !loading && (
            <p
              className={`text-sm mt-2 ${
                trend.isPositive ? 'text-success-600' : 'text-danger-600'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="p-3 bg-primary-100 rounded-lg">
          <Icon size={24} className="text-primary-600" />
        </div>
      </div>
    </div>
  );
};

