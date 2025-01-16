import jwt from "jsonwebtoken";
import { StudentToken } from "../types/student.types";

// jwt.sign(dado, palavraSecreta, configs) - Gera um token
// jwt.decode() - Decodifica o token
// jwt.verify() - Verifica e decodifica o token

// IMPLEMENTAÇÃO
export class JWT {
  // Gerar o token - sign in
  public genereteToken(data: StudentToken): string {
    if (!process.env.JWT_SECRET) {
      throw new Error("Não foi definido a variável de ambiente JWT_SECRET");
    }

    const token = jwt.sign(data, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return token;
  }

  // Verificar o token
  public verifyToken(token: string): StudentToken | null {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error("Não foi definido a variável de ambiente JWT_SECRET");
      }
      // Token não assinado = quebra
      const studentValidate = jwt.verify(
        token,
        process.env.JWT_SECRET
      ) as StudentToken;
      return studentValidate;
    } catch {
      return null;
    }
  }
}
