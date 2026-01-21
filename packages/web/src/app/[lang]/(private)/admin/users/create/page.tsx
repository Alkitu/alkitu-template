'use client';
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/primitives/Card';
import { Button } from '@/components/molecules-alianza/Button';
import { FormInput } from '@/components/molecules-alianza/FormInput';
import { FormSelect } from '@/components/molecules-alianza/FormSelect';
import { Checkbox } from '@/components/molecules-alianza/Checkbox';
import { toast } from 'sonner';
import { Save, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { UserRole } from '@alkitu/shared';
import { AdminPageHeader } from '@/components/molecules/admin-page-header';

interface CreateUserForm {
  name: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: keyof typeof UserRole;
  terms: boolean;
}

interface CreateUserFormErrors {
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  role?: string;
  terms?: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[\S]+@[\S]+\.[\S]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    password.length <= 50 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^a-zA-Z0-9\s]/.test(password)
  );
};

const CreateUserPage = () => {
  const router = useRouter();
  const { lang } = useParams();

  const [formData, setFormData] = useState<CreateUserForm>({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'CLIENT',
    terms: false,
  });

  const [errors, setErrors] = useState<CreateUserFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const registerMutation = trpc.user.register.useMutation({
    onSuccess: () => {
      toast.success('User created successfully!');
      router.push(`/${lang}/admin/users`);
    },
    onError: (error) => {
      toast.error(`Failed to create user: ${error.message}`);
    },
  });

  const validateForm = (): boolean => {
    const newErrors: CreateUserFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        'Password must be 8-50 characters with uppercase, lowercase, number, and special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.terms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors as CreateUserFormErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof CreateUserForm,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await registerMutation.mutateAsync({
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        role: formData.role,
        terms: formData.terms,
      });
    } catch (error) {
      // Error is handled by onError callback
    }
  };

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Create New User"
        description="Add a new user to the system"
        backHref={`/${lang}/admin/users`}
        backLabel="Back to Users"
      />

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Fill in the user details below. The user will receive a welcome
            email with their account information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="First Name *"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                placeholder="Enter first name"
              />

              <FormInput
                label="Last Name *"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={errors.lastName}
                placeholder="Enter last name"
              />

              <FormInput
                label="Email Address *"
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                placeholder="user@example.com"
              />

              <FormInput
                label="Phone Number"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={errors.phone}
                placeholder="+1 (555) 123-4567"
              />

              <div className="space-y-2">
                <FormInput
                  label="Password *"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  error={errors.password}
                  placeholder="Enter password"
                  iconRight={
                    <Button
                      type="button"
                      variant="nude"
                      size="sm"
                      iconOnly
                      iconLeft={showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  }
                />
                {!errors.password && (
                  <p className="text-xs text-gray-500 mt-1">
                    8-50 characters, uppercase, lowercase, number, and special character
                  </p>
                )}
              </div>

              <FormInput
                label="Confirm Password *"
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                placeholder="Confirm password"
              />

              <FormSelect
                label="Role"
                value={formData.role}
                onValueChange={(value) => handleInputChange('role', value as keyof typeof UserRole)}
                options={[
                  { value: 'CLIENT', label: 'Client' },
                  { value: 'LEAD', label: 'Lead' },
                  { value: 'EMPLOYEE', label: 'Employee' },
                  { value: 'ADMIN', label: 'Admin' },
                ]}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.terms}
                  onCheckedChange={(checked) => handleInputChange('terms', checked)}
                />
                <label 
                  className="text-sm cursor-pointer select-none"
                  onClick={() => handleInputChange('terms', !formData.terms)}
                >
                  I accept the terms and conditions *
                </label>
              </div>
              {errors.terms && (
                <p className="text-sm text-red-500">{errors.terms}</p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="min-w-[120px]"
                iconLeft={<Save className="h-4 w-4" />}
              >
                {registerMutation.isPending ? 'Creating...' : 'Create User'}
              </Button>
              <Link href={`/${lang}/admin/users`}>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUserPage;