'use client';

import { Card } from '@/components/primitives/Card';
import { Users, Briefcase, TrendingUp, UserCheck, UserCog } from 'lucide-react';
import { trpc } from '@/lib/trpc';

import { AdminPageHeader } from '@/components/molecules/admin-page-header';

export default function AdminDashboardPage() {
  // ALI-122: Fetch user statistics
  const { data: stats, isLoading } = trpc.user.getUserStats.useQuery();

  return (
    <div className="min-h-screen bg-background p-6">
      <AdminPageHeader
        title="Admin Dashboard"
        description="Panel de administración del sistema"
      />

      {/* User Statistics - ALI-122 */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Estadísticas de Usuarios</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Usuarios</p>
                <p className="text-3xl font-bold text-foreground">
                  {isLoading ? '...' : stats?.total || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          {/* Clients */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Clientes</p>
                <p className="text-3xl font-bold text-foreground">
                  {isLoading ? '...' : stats?.byRole?.CLIENT || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          {/* Employees */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Empleados</p>
                <p className="text-3xl font-bold text-foreground">
                  {isLoading ? '...' : stats?.byRole?.EMPLOYEE || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>

          {/* Admins */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Administradores</p>
                <p className="text-3xl font-bold text-foreground">
                  {isLoading ? '...' : stats?.byRole?.ADMIN || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <UserCog className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold">Actividad Reciente</h3>
                <p className="text-sm text-muted-foreground">Últimos 30 días</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Nuevos usuarios</span>
                <span className="text-lg font-semibold">
                  {isLoading ? '...' : stats?.recentUsers || 0}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-500"
                  style={{
                    width: `${stats?.total ? Math.min((stats.recentUsers / stats.total) * 100, 100) : 0}%`,
                  }}
                />
              </div>
            </div>
          </Card>

          {/* User Distribution */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold">Distribución de Usuarios</h3>
                <p className="text-sm text-muted-foreground">Por tipo de rol</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Clientes</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${stats?.total ? ((stats.byRole?.CLIENT || 0) / stats.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {stats?.total ? Math.round(((stats.byRole?.CLIENT || 0) / stats.total) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Empleados</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{
                        width: `${stats?.total ? ((stats.byRole?.EMPLOYEE || 0) / stats.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {stats?.total ? Math.round(((stats.byRole?.EMPLOYEE || 0) / stats.total) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Admins</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{
                        width: `${stats?.total ? ((stats.byRole?.ADMIN || 0) / stats.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {stats?.total ? Math.round(((stats.byRole?.ADMIN || 0) / stats.total) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
