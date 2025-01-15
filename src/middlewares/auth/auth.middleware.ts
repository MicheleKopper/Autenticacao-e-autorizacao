import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../services";
import { JWT } from "../../utils/jwt";

// (Bearer) => Portador;

// headers: {
//   Authorizathion: `Bearer ${token}`;
// }

export class AuthMiddleware {
  public static async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const authorization = req.headers.authorization; // token

    if (!authorization) {
      res.status(401).json({
        ok: false,
        message: "Não autenticado!",
      });
      return;
    }

    // Remover Bearer antes de validar o token
    const [Bearer, token] = authorization.split(""); // => [ Bearer, "hsfdsfsdfgerfdsf"]

    const jwt = new JWT();
    const studentDecoded = jwt.verifyToken(token);

    if (!studentDecoded) {
      res.status(401).json({
        ok: false,
        message: "Não autenticado!",
      });
      return;
    }

    // Repassa essa informação.
    req.body.student = {
      id: studentDecoded.id,
      name: studentDecoded.name,
      email: studentDecoded.email,
      type: studentDecoded.type,
    };

    req.body.outro = "DEU BOM";

    next();
  }
}
