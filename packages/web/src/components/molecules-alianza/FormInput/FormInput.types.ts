import React from 'react';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  error?: string;
}
