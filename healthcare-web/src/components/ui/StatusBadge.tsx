import React from 'react';

type Status = 'Active' | 'Pending' | 'Cancelled' | 'Confirmed' | 'On Leave' | string;

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-700';

  if (status === 'Active' || status === 'Confirmed') {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
  } else if (status === 'Pending') {
    bgColor = 'bg-amber-100';
    textColor = 'text-amber-800';
  } else if (status === 'Cancelled') {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
  } else if (status === 'On Leave') {
    bgColor = 'bg-gray-200';
    textColor = 'text-gray-600';
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
}
