import { NextFunction, Request, Response } from "express";
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
    const authorization = req.headers.authorization; // bearer token -> `Bearer ${token}`

    if (!authorization) {
      res.status(401).json({
        ok: false,
        message: "Não autenticado!",
      });
      return;
    }

    const token = authorization.split("")[1]; // [bearer, token]

    if (!token) {
      res.status(401).json({
        ok: false,
        message: "Não autenticado!",
      });
      return;
    }

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
    req.authStudent = {
      id: studentDecoded.id,
      name: studentDecoded.name,
      email: studentDecoded.email,
      type: studentDecoded.type,
    };

    next();
  }
}
