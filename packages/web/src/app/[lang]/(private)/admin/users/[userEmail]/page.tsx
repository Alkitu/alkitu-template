'use client';
import React, { useState, useCallback } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/atomic-design/atoms/typography';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
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
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
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
  ArrowLeft,
  Plus,
  Minus,
  Package,
  Users,
  Eye,
  EyeOff,
} from 'lucide-react';
import { UserRole } from '@alkitu/shared';
import Link from 'next/link';

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
  // Use React.use() to unwrap the params Promise
  const resolvedParams = React.use(params);
  const { userEmail } = resolvedParams;

  // Decode the email parameter properly - handle double encoding
  const decodedEmail = decodeURIComponent(decodeURIComponent(userEmail));

  const { lang } = useParams();
  const router = useRouter();

  // Form states
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

  // Dialog states
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showImpersonateDialog, setShowImpersonateDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showAnonymizeDialog, setShowAnonymizeDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Add console.log to debug the email
  React.useEffect(() => {
    console.log('Original userEmail param:', userEmail);
    console.log('Decoded email:', decodedEmail);
  }, [userEmail, decodedEmail]);

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = trpc.user.getUserByEmail.useQuery({ email: decodedEmail }); // TODO: Implement this

  // Add mutations
  const updateProfileMutation = trpc.user.updateProfile.useMutation(); // TODO: Implement this
  const resetPasswordMutation = trpc.user.resetUserPassword.useMutation(); // TODO: Implement this
  const bulkUpdateStatusMutation = trpc.user.bulkUpdateStatus.useMutation(); // TODO: Implement this
  const bulkDeleteUsersMutation = trpc.user.bulkDeleteUsers.useMutation(); // TODO: Implement this
  const adminChangePasswordMutation =
    trpc.user.adminChangePassword.useMutation(); // TODO: Implement this
  const sendMessageMutation = trpc.user.sendMessageToUser.useMutation(); // TODO: Implement this
  const anonymizeUserMutation = trpc.user.anonymizeUser.useMutation(); // TODO: Implement this
  const createImpersonationTokenMutation =
    trpc.user.createImpersonationToken.useMutation(); // TODO: Implement this

  // Initialize form data when user loads
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        lastName: user.lastName || '',
        email: user.email,
        contactNumber: user.contactNumber || '',
        role: user.role as keyof typeof UserRole,
      });
      // Initialize tags if available
      // setTags(user.tags || []);
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
      if (forceLogout) {
        // TODO: Implement force logout for user
      }
    } catch (error) {
      toast.error('Failed to update password');
    }
  }, [newPassword, forceLogout, user, adminChangePasswordMutation]);

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
      // TODO: Get current admin user ID from session/context
      const adminId = 'current-admin-id'; // This should come from authentication context
      await createImpersonationTokenMutation.mutateAsync({
        adminId,
        targetUserId: user.id,
      });
      toast.success('Impersonating user...');
      // Redirect to main app as this user
      router.push(`/${lang}/dashboard`);
    } catch (error) {
      toast.error('Failed to impersonate user');
    }
  }, [user, createImpersonationTokenMutation, router, lang]);

  const handleSuspendUser = useCallback(async () => {
    if (!user) return;

    try {
      await bulkUpdateStatusMutation.mutateAsync({
        userIds: [user.id],
        isActive: false, // false = suspended
      });
      toast.success('User suspended successfully');
      setShowSuspendDialog(false);
      refetch();
    } catch (error) {
      toast.error('Failed to suspend user');
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
      router.push(`/${lang}/dashboard/users`);
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
        return 'default';
      case 'CLIENT':
        return 'secondary';
      case 'LEAD':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading user details...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">Error loading user details.</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">User not found.</div>
      </div>
    );
  }

  const passwordValidation = validatePassword(newPassword);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
              {user.name || user.email}
            </Typography>
            <Typography variant="p" className="text-gray-600">
              {user.email}
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
          <Button
            variant={editMode ? 'default' : 'outline'}
            onClick={() => setEditMode(!editMode)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {editMode ? 'Cancel Edit' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
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
                    Make your changes and click &quot;Save Changes&quot; to
                    update the user&apos;s profile.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button onClick={handleSaveProfile} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditMode(false)}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">First Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactNumber: e.target.value,
                      })
                    }
                    disabled={!editMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        role: value as keyof typeof UserRole,
                      })
                    }
                    disabled={!editMode}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="EMPLOYEE">Employee</SelectItem>
                      <SelectItem value="CLIENT">Client</SelectItem>
                      <SelectItem value="LEAD">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Account Status</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.terms ? 'default' : 'destructive'}>
                      {user.terms ? 'Active' : 'Inactive'}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Created {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      {editMode && (
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:bg-gray-200 rounded-full p-1"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {editMode && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Authentication
              </CardTitle>
              <CardDescription>
                Manage user&apos;s password and authentication settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Change Password</h4>
                    <p className="text-sm text-gray-600">
                      Update user&apos;s password with validation
                    </p>
                  </div>
                  <Dialog
                    open={showPasswordDialog}
                    onOpenChange={setShowPasswordDialog}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                          Set a new password for {user.email}. Password must
                          meet security requirements.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showPassword ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Enter new password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="space-y-2">
                          <Label>Password Requirements</Label>
                          <div className="space-y-1 text-sm">
                            <div
                              className={`flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}`}
                            >
                              {passwordValidation.minLength ? '✓' : '○'} At
                              least 8 characters
                            </div>
                            <div
                              className={`flex items-center gap-2 ${passwordValidation.maxLength ? 'text-green-600' : 'text-gray-500'}`}
                            >
                              {passwordValidation.maxLength ? '✓' : '○'} Maximum
                              50 characters
                            </div>
                            <div
                              className={`flex items-center gap-2 ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}
                            >
                              {passwordValidation.hasUppercase ? '✓' : '○'} One
                              uppercase letter
                            </div>
                            <div
                              className={`flex items-center gap-2 ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}
                            >
                              {passwordValidation.hasLowercase ? '✓' : '○'} One
                              lowercase letter
                            </div>
                            <div
                              className={`flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}
                            >
                              {passwordValidation.hasNumber ? '✓' : '○'} One
                              number
                            </div>
                            <div
                              className={`flex items-center gap-2 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}
                            >
                              {passwordValidation.hasSpecialChar ? '✓' : '○'}{' '}
                              One special character
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="forceLogout"
                            checked={forceLogout}
                            onCheckedChange={setForceLogout}
                          />
                          <Label htmlFor="forceLogout">
                            Force logout from all devices
                          </Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowPasswordDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleChangePassword}
                          disabled={
                            !isPasswordValid(passwordValidation) ||
                            adminChangePasswordMutation.isPending
                          }
                        >
                          {adminChangePasswordMutation.isPending
                            ? 'Changing...'
                            : 'Change Password'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Reset Password</h4>
                    <p className="text-sm text-gray-600">
                      Send password reset email to user
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleResetPassword}
                    disabled={resetPasswordMutation.isPending}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {resetPasswordMutation.isPending
                      ? 'Sending...'
                      : 'Send Reset Email'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">
                      Status: {user.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <Badge
                    variant={user.isTwoFactorEnabled ? 'default' : 'secondary'}
                  >
                    {user.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Enrollment
              </CardTitle>
              <CardDescription>
                Manage user&apos;s product subscriptions and progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Product management features coming soon</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Enroll in Product
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Group Membership
              </CardTitle>
              <CardDescription>
                Manage user&apos;s group memberships and access levels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Group management features coming soon</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Group
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                User Actions
              </CardTitle>
              <CardDescription>
                Perform administrative actions on this user account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Communication Actions */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700 uppercase tracking-wide">
                  Communication
                </h4>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h5 className="font-medium">Send Message</h5>
                    <p className="text-sm text-gray-600">
                      Send a direct message to this user
                    </p>
                  </div>
                  <Dialog
                    open={showMessageDialog}
                    onOpenChange={setShowMessageDialog}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Message to {user.email}</DialogTitle>
                        <DialogDescription>
                          This message will be sent as a notification to the
                          user.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Type your message here..."
                            rows={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowMessageDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSendMessage}
                          disabled={
                            !messageText.trim() || sendMessageMutation.isPending
                          }
                        >
                          {sendMessageMutation.isPending
                            ? 'Sending...'
                            : 'Send Message'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <Separator />

              {/* Administrative Actions */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700 uppercase tracking-wide">
                  Administrative
                </h4>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h5 className="font-medium">Login as User</h5>
                    <p className="text-sm text-gray-600">
                      Impersonate this user (requires confirmation)
                    </p>
                  </div>
                  <AlertDialog
                    open={showImpersonateDialog}
                    onOpenChange={setShowImpersonateDialog}
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">
                        <LogIn className="h-4 w-4 mr-2" />
                        Impersonate
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Confirm Impersonation
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          You are about to log in as {user.email}. This will
                          give you access to their account and data. This action
                          will be logged for security purposes.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleImpersonate}>
                          Confirm Impersonation
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <Separator />

              {/* Dangerous Actions */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-red-700 uppercase tracking-wide">
                  Dangerous Actions
                </h4>

                <div className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <div>
                    <h5 className="font-medium text-orange-800">
                      Suspend User
                    </h5>
                    <p className="text-sm text-orange-600">
                      Temporarily disable user access
                    </p>
                  </div>
                  <AlertDialog
                    open={showSuspendDialog}
                    onOpenChange={setShowSuspendDialog}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-orange-300 text-orange-700 hover:bg-orange-100"
                      >
                        <UserX className="h-4 w-4 mr-2" />
                        Suspend
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Suspend User Account
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will temporarily suspend {user.email}&apos;s
                          account. They will not be able to log in until the
                          suspension is lifted. This action can be reversed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSuspendUser}>
                          Confirm Suspension
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <h5 className="font-medium text-red-800">Anonymize User</h5>
                    <p className="text-sm text-red-600">
                      Remove personal data (irreversible)
                    </p>
                  </div>
                  <AlertDialog
                    open={showAnonymizeDialog}
                    onOpenChange={setShowAnonymizeDialog}
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Anonymize
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Anonymize User Data</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove all personal identifiable
                          information for {user.email}
                          from the platform. This action is IRREVERSIBLE and
                          only affects platform data (not external services like
                          Stripe or CRM).
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleAnonymizeUser}>
                          Confirm Anonymization
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="flex items-center justify-between p-4 border border-red-300 rounded-lg bg-red-100">
                  <div>
                    <h5 className="font-medium text-red-900">Delete User</h5>
                    <p className="text-sm text-red-700">
                      Permanently delete user account (irreversible)
                    </p>
                  </div>
                  <AlertDialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User Account</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete {user.email}&apos;s
                          account and all associated platform data. This action
                          is IRREVERSIBLE. External data in Stripe, CRM, or
                          email services will not be affected.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUser}>
                          Confirm Deletion
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetailPage;
