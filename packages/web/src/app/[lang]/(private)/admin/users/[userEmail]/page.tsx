'use client';
import React, { useState, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';
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
import { FormTextarea } from '@/components/molecules-alianza/FormTextarea';
import { TabsAlianza, TabItem } from '@/components/molecules-alianza/TabsAlianza';
import { Chip } from '@/components/atoms-alianza/Chip';
import { Toggle } from '@/components/atoms-alianza/Toggle';
import { Label } from '@/components/primitives/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/primitives/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/primitives/Dialog';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Shield,
  Key,
  Edit,
  Trash2,
  UserX,
  MessageSquare,
  LogIn,
  AlertTriangle,
  Save,
  Plus,
  Minus,
  Package,
  Users,
  Eye,
  EyeOff,
} from 'lucide-react';
import { UserRole } from '@alkitu/shared';
import { AdminPageHeader } from '@/components/molecules/admin-page-header';

interface PasswordValidation {
  minLength: boolean;
  maxLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

const validatePassword = (password: string): PasswordValidation => {
  return {
    minLength: password.length >= 8,
    maxLength: password.length <= 50,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
};

const isPasswordValid = (validation: PasswordValidation): boolean => {
  return Object.values(validation).every(Boolean);
};

const UserDetailPage = ({
  params,
}: {
  params: Promise<{ userEmail: string }>;
}) => {
  const resolvedParams = React.use(params);
  const { userEmail } = resolvedParams;
  const decodedEmail = decodeURIComponent(decodeURIComponent(userEmail));

  const { lang } = useParams();
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    contactNumber: '',
    role: 'CLIENT' as keyof typeof UserRole,
  });
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forceLogout, setForceLogout] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showImpersonateDialog, setShowImpersonateDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showAnonymizeDialog, setShowAnonymizeDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  React.useEffect(() => {
    console.log('Original userEmail param:', userEmail);
    console.log('Decoded email:', decodedEmail);
  }, [userEmail, decodedEmail]);

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = trpc.user.getUserByEmail.useQuery({ email: decodedEmail });

  const updateProfileMutation = trpc.user.updateProfile.useMutation();
  const resetPasswordMutation = trpc.user.resetUserPassword.useMutation();
  const bulkUpdateStatusMutation = trpc.user.bulkUpdateStatus.useMutation();
  const bulkDeleteUsersMutation = trpc.user.bulkDeleteUsers.useMutation();
  const adminChangePasswordMutation = trpc.user.adminChangePassword.useMutation();
  const sendMessageMutation = trpc.user.sendMessageToUser.useMutation();
  const anonymizeUserMutation = trpc.user.anonymizeUser.useMutation();
  const createImpersonationTokenMutation = trpc.user.createImpersonationToken.useMutation();

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: (user as any).name || (user as any).firstname || '',
        lastName: (user as any).lastName || (user as any).lastname || '',
        email: user.email,
        contactNumber: (user as any).contactNumber || (user as any).phone || '',
        role: user.role as keyof typeof UserRole,
      });
    }
  }, [user]);

  const handleSaveProfile = useCallback(async () => {
    if (!user) return;
    try {
      await updateProfileMutation.mutateAsync({
        id: user.id,
        name: formData.name,
        lastName: formData.lastName,
        contactNumber: formData.contactNumber,
        role: formData.role,
      });
      toast.success('Profile updated successfully');
      setEditMode(false);
      refetch();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  }, [formData, user, updateProfileMutation, refetch]);

  const handleChangePassword = useCallback(async () => {
    const validation = validatePassword(newPassword);
    if (!isPasswordValid(validation)) {
      toast.error('Password does not meet requirements');
      return;
    }
    if (!user) return;
    try {
      await adminChangePasswordMutation.mutateAsync({
        userId: user.id,
        newPassword: newPassword,
      });
      toast.success('Password updated successfully');
      setShowPasswordDialog(false);
      setNewPassword('');
    } catch (error) {
      toast.error('Failed to update password');
    }
  }, [newPassword, user, adminChangePasswordMutation]);

  const handleResetPassword = useCallback(async () => {
    if (!user) return;
    try {
      await resetPasswordMutation.mutateAsync({
        userId: user.id,
        sendEmail: true,
      });
      toast.success('Password reset email sent');
    } catch (error) {
      toast.error('Failed to send reset email');
    }
  }, [user, resetPasswordMutation]);

  const handleSendMessage = useCallback(async () => {
    if (!user || !messageText.trim()) return;
    try {
      await sendMessageMutation.mutateAsync({
        userId: user.id,
        message: messageText,
      });
      toast.success('Message sent successfully');
      setShowMessageDialog(false);
      setMessageText('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  }, [messageText, user, sendMessageMutation]);

  const handleImpersonate = useCallback(async () => {
    if (!user) return;
    try {
      const adminId = 'current-admin-id';
      await createImpersonationTokenMutation.mutateAsync({
        adminId,
        targetUserId: user.id,
      });
      toast.success('Impersonating user...');
      router.push(`/${lang}/dashboard`);
    } catch (error) {
      toast.error('Failed to impersonate user');
    }
  }, [user, createImpersonationTokenMutation, router, lang]);

  const handleSuspendUser = useCallback(async () => {
    if (!user) return;
    try {
      const isSuspending = user.status !== 'SUSPENDED';
      await bulkUpdateStatusMutation.mutateAsync({
        userIds: [user.id],
        isActive: !isSuspending, // if we are suspending, isActive should be false. If activating, true.
      });
      toast.success(isSuspending ? 'User suspended successfully' : 'User activated successfully');
      setShowSuspendDialog(false);
      refetch();
    } catch (error) {
      toast.error(user.status === 'SUSPENDED' ? 'Failed to activate user' : 'Failed to suspend user');
    }
  }, [user, bulkUpdateStatusMutation, refetch]);

  const handleAnonymizeUser = useCallback(async () => {
    if (!user) return;
    try {
      await anonymizeUserMutation.mutateAsync({
        userId: user.id,
      });
      toast.success('User data anonymized');
      setShowAnonymizeDialog(false);
      refetch();
    } catch (error) {
      toast.error('Failed to anonymize user');
    }
  }, [user, anonymizeUserMutation, refetch]);

  const handleDeleteUser = useCallback(async () => {
    if (!user) return;
    try {
      await bulkDeleteUsersMutation.mutateAsync({
        userIds: [user.id],
      });
      toast.success('User deleted successfully');
      router.push(`/${lang}/admin/users`);
    } catch (error) {
      toast.error('Failed to delete user');
    }
  }, [user, bulkDeleteUsersMutation, router, lang]);

  const addTag = useCallback(() => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  }, [newTag, tags]);

  const removeTag = useCallback(
    (tagToRemove: string) => {
      setTags(tags.filter((tag) => tag !== tagToRemove));
    },
    [tags],
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'EMPLOYEE':
        return 'solid';
      case 'CLIENT':
        return 'outline';
      case 'LEAD':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-lg">Loading user details...</div></div>;
  if (isError) return <div className="flex items-center justify-center h-64"><div className="text-lg text-red-500">Error loading user details.</div></div>;
  if (!user) return <div className="flex items-center justify-center h-64"><div className="text-lg">User not found.</div></div>;

  const passwordValidation = validatePassword(newPassword);

  const tabs: TabItem[] = [
    {
      value: 'profile',
      label: 'Profile',
      content: (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription className='mb-4'>
              Manage user&apos;s basic information and role assignment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {editMode && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Save className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">
                    Edit Mode Active
                  </span>
                </div>
                <p className="text-sm text-blue-600">
                  Make your changes and click &quot;Save Changes&quot; to update the user&apos;s profile.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button onClick={handleSaveProfile} iconLeft={<Save className="h-4 w-4" />}>
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Email"
                id="email"
                type="email"
                value={formData.email}
                disabled
              />
              <FormInput
                label="First Name"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!editMode}
              />
              <FormInput
                label="Last Name"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={!editMode}
              />
              <FormInput
                label="Contact Number"
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                disabled={!editMode}
              />
              <FormSelect
                label="Role"
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as keyof typeof UserRole })}
                disabled={!editMode}
                options={[
                  { value: 'ADMIN', label: 'Admin' },
                  { value: 'EMPLOYEE', label: 'Employee' },
                  { value: 'CLIENT', label: 'Client' },
                  { value: 'LEAD', label: 'Lead' },
                ]}
              />
              <div className="flex flex-col gap-[3px] items-start w-full">
                <label className="body-sm text-base-foreground-b w-full">Account Status</label>
                <div className="flex items-center gap-2 h-[var(--input-height)]">
                  <Chip variant={user.terms ? 'solid' : 'destructive'}>
                    {user.terms ? 'Active' : 'Inactive'}
                  </Chip>
                  <span className="text-sm text-gray-600">
                    Created {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-2">
              <label className="body-sm text-base-foreground-b w-full">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <Chip key={index} variant="outline" className="flex items-center gap-1">
                    {tag}
                    {editMode && (
                      <button onClick={() => removeTag(tag)} className="ml-1 hover:bg-gray-200 rounded-full p-1">
                        <Minus className="h-3 w-3" />
                      </button>
                    )}
                  </Chip>
                ))}
              </div>
              {editMode && (
                <div className="flex gap-2">
                  <FormInput
                    label="Add Tag"
                    placeholder="New tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} iconOnly iconLeft={<Plus className="h-4 w-4" />} className="mt-6" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )
    },
    {
      value: 'security',
      label: 'Security',
      content: (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Authentication
            </CardTitle>
            <CardDescription className='mb-4'>
              Manage user&apos;s password and authentication settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Change Password</h4>
                  <p className="text-sm text-gray-600">Update user&apos;s password with validation</p>
                </div>
                <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" iconLeft={<Key className="h-4 w-4" />}>
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Set a new password for {user.email}. Password must meet security requirements.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <FormInput
                          label="New Password"
                          id="newPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
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
                      </div>

                      {/* Password Requirements */}
                      <div className="space-y-2">
                        <Label>Password Requirements</Label>
                        <div className="space-y-1 text-sm">
                          {[
                            { valid: passwordValidation.minLength, text: 'At least 8 characters' },
                            { valid: passwordValidation.maxLength, text: 'Maximum 50 characters' },
                            { valid: passwordValidation.hasUppercase, text: 'One uppercase letter' },
                            { valid: passwordValidation.hasLowercase, text: 'One lowercase letter' },
                            { valid: passwordValidation.hasNumber, text: 'One number' },
                            { valid: passwordValidation.hasSpecialChar, text: 'One special character' },
                          ].map((req, i) => (
                            <div key={i} className={`flex items-center gap-2 ${req.valid ? 'text-green-600' : 'text-gray-500'}`}>
                              {req.valid ? '✓' : '○'} {req.text}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Toggle checked={forceLogout} onCheckedChange={setForceLogout} />
                        <Label>Force logout from all devices</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
                      <Button
                        onClick={handleChangePassword}
                        disabled={!isPasswordValid(passwordValidation) || adminChangePasswordMutation.isPending}
                      >
                        {adminChangePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Reset Password</h4>
                  <p className="text-sm text-gray-600">Send password reset email to user</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleResetPassword}
                  disabled={resetPasswordMutation.isPending}
                  iconLeft={<Mail className="h-4 w-4" />}
                >
                  {resetPasswordMutation.isPending ? 'Sending...' : 'Send Reset Email'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Status: {user.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
                </div>
                <Chip variant={user.isTwoFactorEnabled ? 'solid' : 'outline'}>
                  {user.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Chip>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    },
    {
      value: 'products',
      label: 'Products',
      content: (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Enrollment
            </CardTitle>
            <CardDescription className='mb-4'>
              Manage user&apos;s product subscriptions and progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Product management features coming soon</p>
              <Button variant="outline" className="mt-4" iconLeft={<Plus className="h-4 w-4" />}>
                Enroll in Product
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    },
    {
      value: 'groups',
      label: 'Groups',
      content: (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Group Membership
            </CardTitle>
            <CardDescription className='mb-4'>
              Manage user&apos;s group memberships and access levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Group management features coming soon</p>
              <Button variant="outline" className="mt-4" iconLeft={<Plus className="h-4 w-4" />}>
                Add to Group
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    },
    {
      value: 'actions',
      label: 'Actions',
      content: (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              User Actions
            </CardTitle>
            <CardDescription className='mb-4'>
              Perform administrative actions on this user account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Communication Actions */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-700 uppercase tracking-wide">Communication</h4>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h5 className="font-medium">Send Message</h5>
                  <p className="text-sm text-gray-600">Send a direct message to this user</p>
                </div>
                <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" iconLeft={<MessageSquare className="h-4 w-4" />}>
                      Send Message
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Message to {user.email}</DialogTitle>
                      <DialogDescription>
                        This message will be sent as a notification to the user.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <FormTextarea
                        label="Message"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type your message here..."
                        rows={4}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowMessageDialog(false)}>Cancel</Button>
                      <Button onClick={handleSendMessage} disabled={!messageText.trim() || sendMessageMutation.isPending}>
                        {sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Administrative Actions */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-700 uppercase tracking-wide">Administrative</h4>
                              <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                                <div>
                                  <h5 className="font-medium">Login as User (Coming Soon)</h5>
                                  <p className="text-sm text-gray-600">Impersonate this user (requires confirmation)</p>
                                </div>
                                <Button variant="outline" iconLeft={<LogIn className="h-4 w-4" />} disabled>
                                  Impersonate
                                </Button>
                              </div>            </div>

            {/* Dangerous Actions */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-red-700 uppercase tracking-wide">Dangerous Actions</h4>
              <div className={cn(
                "flex items-center justify-between p-4 border rounded-lg",
                user.status === 'SUSPENDED' ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"
              )}>
                <div>
                  <h5 className={cn("font-medium", user.status === 'SUSPENDED' ? "text-green-800" : "text-orange-800")}>
                    {user.status === 'SUSPENDED' ? "Activate User" : "Suspend User"}
                  </h5>
                  <p className={cn("text-sm", user.status === 'SUSPENDED' ? "text-green-600" : "text-orange-600")}>
                    {user.status === 'SUSPENDED' ? "Restore user access to the platform" : "Temporarily disable user access"}
                  </p>
                </div>
                <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={cn(
                        "border-current",
                        user.status === 'SUSPENDED' ? "text-green-700 hover:bg-green-100" : "text-orange-700 hover:bg-orange-100"
                      )} 
                      iconLeft={user.status === 'SUSPENDED' ? <LogIn className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                    >
                      {user.status === 'SUSPENDED' ? "Activate" : "Suspend"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {user.status === 'SUSPENDED' ? "Activate User Account" : "Suspend User Account"}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {user.status === 'SUSPENDED' 
                          ? `This will restore ${user.email}'s account access. They will be able to log in again.`
                          : `This will temporarily suspend ${user.email}'s account. They will not be able to log in until the suspension is lifted.`
                        }
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSuspendUser}>
                        Confirm {user.status === 'SUSPENDED' ? "Activation" : "Suspension"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <h5 className="font-medium text-red-800">Anonymize User</h5>
                  <p className="text-sm text-red-600">Remove personal data (irreversible)</p>
                </div>
                <AlertDialog open={showAnonymizeDialog} onOpenChange={setShowAnonymizeDialog}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" iconLeft={<AlertTriangle className="h-4 w-4" />}>
                      Anonymize
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Anonymize User Data</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove all personal identifiable information for {user.email}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleAnonymizeUser}>Confirm Anonymization</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="flex items-center justify-between p-4 border border-red-300 rounded-lg bg-red-100">
                <div>
                  <h5 className="font-medium text-red-900">Delete User</h5>
                  <p className="text-sm text-red-700">Permanently delete user account (irreversible)</p>
                </div>
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" iconLeft={<Trash2 className="h-4 w-4" />}>
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete User Account</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {user.email}&apos;s account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteUser}>Confirm Deletion</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title={(user as any).name || user.email}
        description={user.email}
        backHref={`/${lang}/admin/users`}
        backLabel="Back to Users"
        actions={
          <>
            <div className="flex gap-2">
              <Chip variant={user.role === 'ADMIN' ? 'destructive' : user.role === 'EMPLOYEE' ? 'solid' : 'outline'}>{user.role}</Chip>
              {user.status === 'SUSPENDED' && (
                <Chip variant="destructive">SUSPENDED</Chip>
              )}
            </div>
            <Button
              variant={editMode ? 'main' : 'outline'}
              onClick={() => setEditMode(!editMode)}
              iconLeft={<Edit className="h-4 w-4" />}
            >
              {editMode ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          </>
        }
      />

      <TabsAlianza tabs={tabs} />
    </div>
  );
};

export default UserDetailPage;