import { prisma } from "../database/prisma.database";
import { LoginDto } from "../dtos";
import { ResponseApi } from "../types";
import { JWT} from "../utils/jwt";
import { StudentToken } from "../types/student.types";

export class AuthService {
  public async login(data: LoginDto): Promise<ResponseApi> {
    const { email, password } = data;

    // 1 - Verificar o email
    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student) {
      return {
        ok: false,
        code: 404,
        message: "E-mail ou senha incorretos. (email)",
      };
    }

    if (password !== student.password) {
      return {
        ok: false,
        code: 404,
        message: "E-mail ou senha incorretos.",
      };
    }

    // Gerar o token (uid)
    const jwt = new JWT();

    const payload: StudentToken = {
      id: student.id,
      name: student.name,
      email: student.email,
      type: student.type,
    };

    const token = jwt.genereteToken(payload);

    // Feed de sucesso retornando o token (uid)
    return {
      ok: true,
      code: 200,
      message: "Login efetuado com sucesso!",
      data: {
        student: payload,
        token,
      },
    };
  }
}
