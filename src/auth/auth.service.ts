import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // Nos proporciona la funcionalidad de generar y verificar los tokes "JWT"
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Principio de Responsabilidad única (SRP), este método se encargara únicamente de validar un usuario
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject(); // convierte el documento de Mongoose en un Objeto de JavaScript plano, que nos permita manipular el objeto.
      return result;
    }
    return null;
  }

  // Principio de Responsabilidad única (SRP), Este método se va encargar únicamente de generar el JWT
  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload), // Genera un token JWT firmado con el payload
    };
  }
}
