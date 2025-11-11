import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/molecules/Card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/atoms/avatars';
import { Badge } from '@/components/atoms/badge';

interface UserCardProps {
  user: {
    name: string | null;
    email: string;
    image: string | null;
    id: string;
    role?: string;
    isTwoFactorEnabled?: boolean;
    isOAuth?: boolean;
  };
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage
            src={user.image || undefined}
            alt={user.name || 'Usuario'}
            referrerPolicy="no-referrer"
          />
          <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-2xl">{user.name || 'Usuario'}</CardTitle>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">ID de Usuario</p>
            <p className="text-sm text-muted-foreground">{user.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Rol</p>
            <Badge variant="secondary" className="mt-1">
              {user.role || 'Sin rol'}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Autenticación de dos factores</p>
            <Badge
              variant={user.isTwoFactorEnabled ? 'default' : 'destructive'}
              className="mt-1 "
            >
              {user.isTwoFactorEnabled ? 'Activada' : 'Desactivada'}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium">Tipo de autenticación</p>
            <Badge
              variant={user.isOAuth ? 'default' : 'secondary'}
              className="mt-1 text-zinc-900"
            >
              {user.isOAuth ? 'OAuth' : 'Email/Contraseña'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
