interface UserStatsProps {
  stats: {
    total: number;
    byRole: Record<string, number>;
    recentUsers: number;
  };
}

export function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold">Total Users</h2>
        <p className="text-2xl font-bold">{stats.total}</p>
      </div>
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold">Users by Role</h2>
        <ul>
          {Object.entries(stats.byRole).map(([role, count]) => (
            <li key={role}>{role}: {count}</li>
          ))}
        </ul>
      </div>
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold">New Users (Last 30 Days)</h2>
        <p className="text-2xl font-bold">{stats.recentUsers}</p>
      </div>
    </div>
  );
}
