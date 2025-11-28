import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service';
import { UserFacadeService } from './services';
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/token.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserTagsDto } from './dto/update-user-tags.dto';
import {
  BulkDeleteUsersDto,
  BulkUpdateRoleDto,
  BulkUpdateStatusDto,
  AdminResetPasswordDto,
} from './dto/bulk-users.dto';

interface AuthenticatedRequest {
  user: {
    id: string;
    role: string;
    [key: string]: any;
  };
}

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    // ✅ SOLID Architecture: Using Facade Service for backward compatibility
    private readonly userFacadeService: UserFacadeService,
    // Legacy service maintained for gradual migration
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async register(@Body() createUserDto: CreateUserDto) {
    // ✅ SOLID: Using Facade Service
    return this.userFacadeService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginUserDto) {
    // ✅ SOLID: Using Facade Service for authentication
    const user = await this.userFacadeService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Obtener el usuario completo con rol para asegurar que esté incluido
    const fullUser = await this.userFacadeService.findOne(user.id);

    return this.authService.login(fullUser);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    // ✅ SOLID: Using Facade Service
    return this.userFacadeService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @Get('filtered')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get users with filtering, pagination, and search' })
  @ApiResponse({
    status: 200,
    description: 'Filtered list of users with pagination',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAllFiltered(@Query() filterDto: FilterUsersDto) {
    // ✅ SOLID: Using Facade Service
    return this.userFacadeService.findAllWithFilters(filterDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @Get('stats')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({ status: 200, description: 'User statistics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserStats() {
    // ✅ SOLID: Using Facade Service for analytics
    return this.userFacadeService.getUserStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get authenticated user profile (ALI-116)' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getMyProfile(@Req() req: AuthenticatedRequest) {
    // ✅ SOLID: Using Facade Service to fetch user profile
    const user = await this.userFacadeService.findOne(req.user.userId);
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string) {
    // ✅ SOLID: Using Facade Service
    return this.userFacadeService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // ✅ SOLID: Using Facade Service
    return this.userFacadeService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @Patch(':id/tags')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user tags by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User tags successfully updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateTags(
    @Param('id') id: string,
    @Body() updateUserTagsDto: UpdateUserTagsDto,
  ) {
    // ✅ SOLID: Using Facade Service
    return this.userFacadeService.updateTags(id, updateUserTagsDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Param('id') id: string) {
    // ✅ SOLID: Using Facade Service
    return this.userFacadeService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/role')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get authenticated user role' })
  @ApiResponse({ status: 200, description: 'User role retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMeRole(@Req() req: AuthenticatedRequest) {
    return { role: req.user.role };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/sessions')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Revoke all my sessions (logout from all devices)' })
  @ApiResponse({
    status: 200,
    description: 'All user sessions revoked successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async revokeMySessions(@Req() req: AuthenticatedRequest) {
    const revokedCount = await this.tokenService.revokeAllUserSessions(
      req.user.id,
    );
    return {
      message: 'All your sessions have been revoked. Please log in again.',
      revokedSessions: revokedCount,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/profile')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update authenticated user profile (ALI-116)' })
  @ApiResponse({ status: 200, description: 'Profile successfully updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async updateMyProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    // ✅ SOLID: Using Users Service for profile update
    // Note: address and contactPerson are only allowed for CLIENT role
    const updatedUser = await this.usersService.updateProfile(
      req.user.userId,
      updateProfileDto,
    );
    return {
      user: updatedUser,
      message: 'Profile updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Change authenticated user password' })
  @ApiResponse({ status: 200, description: 'Password successfully changed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 400,
    description:
      'Invalid current password or new password does not meet requirements',
  })
  async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    // ✅ SOLID: Using Facade Service for password change
    await this.userFacadeService.changePassword(req.user.id, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  // Bulk Operations
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('bulk/delete')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Bulk delete users' })
  @ApiResponse({ status: 200, description: 'Users deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async bulkDeleteUsers(@Body() bulkDeleteDto: BulkDeleteUsersDto) {
    // ✅ SOLID: Using Facade Service for bulk operations
    return this.userFacadeService.bulkDeleteUsers(bulkDeleteDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('bulk/update-role')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Bulk update user roles' })
  @ApiResponse({ status: 200, description: 'User roles updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async bulkUpdateRole(@Body() bulkUpdateRoleDto: BulkUpdateRoleDto) {
    // ✅ SOLID: Using Facade Service for bulk operations
    return this.userFacadeService.bulkUpdateRole(bulkUpdateRoleDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('bulk/update-status')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Bulk update user status (activate/deactivate)' })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async bulkUpdateStatus(@Body() bulkUpdateStatusDto: BulkUpdateStatusDto) {
    // ✅ SOLID: Using Facade Service for bulk operations
    return this.userFacadeService.bulkUpdateStatus(bulkUpdateStatusDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async resetUserPassword(@Body() resetPasswordDto: AdminResetPasswordDto) {
    // ✅ SOLID: Using Facade Service for password reset
    return this.userFacadeService.resetUserPassword(resetPasswordDto);
  }
}
