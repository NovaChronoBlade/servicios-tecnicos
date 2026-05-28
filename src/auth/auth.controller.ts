import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { JwtAuthGuard } from './guards/jwt.guard';

@ApiTags('Autenticacion')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registra un usuario y entrega un JWT de acceso junto con un refresh token.
   * Body: datos basicos del usuario, credenciales y rol.
   * Respuesta: usuario publico, access_token, refresh_token y alias token.
   */
  @Post('register')
  @ApiOperation({ summary: 'Registrar usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({
    status: 409,
    description: 'Documento, correo o telefono duplicado',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Autentica un usuario activo con correo y contrasena.
   * Body: email y password.
   * Respuesta: usuario publico, access_token, refresh_token y alias token.
   */
  @Post('login')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @Throttle({ login: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Iniciar sesion' })
  @ApiResponse({ status: 200, description: 'Credenciales validas' })
  @ApiResponse({
    status: 401,
    description: 'Credenciales invalidas o usuario inactivo',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Renueva el JWT de acceso usando un refresh token vigente.
   * Body: refresh_token.
   * Respuesta: nuevo access_token y nuevo refresh_token rotado.
   */
  @Post('refresh')
  @ApiOperation({ summary: 'Renovar token JWT' })
  @ApiResponse({ status: 201, description: 'Token renovado exitosamente' })
  @ApiResponse({ status: 401, description: 'Refresh token invalido' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto.refresh_token);
  }

  /**
   * Invalida el JWT actual y opcionalmente el refresh token enviado.
   * Header: Authorization Bearer.
   * Body opcional: refresh_token.
   * Respuesta: confirmacion de cierre de sesion.
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesion e invalidar token activo' })
  @ApiResponse({ status: 201, description: 'Sesion cerrada exitosamente' })
  async logout(@Body() logoutDto: LogoutDto, @Request() req) {
    return this.authService.logout(req.user, logoutDto.refresh_token);
  }
}
