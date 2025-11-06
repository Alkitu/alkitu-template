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
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/atomic-design/atoms/typography';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowLeft, User, Save } from 'lucide-react';
import Link from 'next/link';
import { UserRole } from '@alkitu/shared';

interface CreateUserForm {
  name: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactNumber: string;
  role: keyof typeof UserRole;
  terms: boolean;
}

interface CreateUserFormErrors {
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  contactNumber?: string;
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
    contactNumber: '',
    role: 'CLIENT',
    terms: false,
  });

  const [errors, setErrors] = useState<CreateUserFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const registerMutation = trpc.user.register.useMutation({
    // TODO: Implement this
    onSuccess: () => {
      toast.success('User created successfully!');
      router.push(`/${lang}/dashboard/users`);
    },
    onError: (error) => {
      // TODO: Implement this
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
        contactNumber: formData.contactNumber || undefined,
        terms: formData.terms,
      });
    } catch (error) {
      // Error is handled by onError callback
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/${lang}/dashboard/users`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </Link>
        <div>
          <Typography
            variant="h1"
            className="text-2xl font-bold flex items-center gap-2"
          >
            <User className="h-6 w-6" />
            Create New User
          </Typography>
          <Typography variant="p" className="text-gray-600">
            Add a new user to the system
          </Typography>
        </div>
      </div>

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
              <div className="space-y-2">
                <Label htmlFor="name">First Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                  placeholder="Enter first name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange('lastName', e.target.value)
                  }
                  className={errors.lastName ? 'border-red-500' : ''}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                  placeholder="user@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    handleInputChange('contactNumber', e.target.value)
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  className={errors.password ? 'border-red-500' : ''}
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
                <p className="text-xs text-gray-500">
                  8-50 characters, uppercase, lowercase, number, and special
                  character
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange('confirmPassword', e.target.value)
                  }
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    handleInputChange('role', value as keyof typeof UserRole)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLIENT">Client</SelectItem>
                    <SelectItem value="LEAD">Lead</SelectItem>
                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.terms}
                onCheckedChange={(checked) =>
                  handleInputChange('terms', checked as boolean)
                }
              />
              <Label htmlFor="terms" className="text-sm">
                I accept the terms and conditions *
              </Label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-500">{errors.terms}</p>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="min-w-[120px]"
              >
                <Save className="h-4 w-4 mr-2" />
                {registerMutation.isPending ? 'Creating...' : 'Create User'}
              </Button>
              <Link href={`/${lang}/dashboard/users`}>
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
