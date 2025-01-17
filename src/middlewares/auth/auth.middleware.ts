import { NextFunction, Request, Response } from "express";
import { JWT } from "../../utils/jwt";
import { log } from "console";

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
        message: "Não autenticado! 1",
      });
      return;
    }

    const token = authorization.split(" ")[1]; // [bearer, token]

    if (!token) {
      res.status(401).json({
        ok: false,
        message: "Não autenticado! 2",
      });
      return;
    }

    const jwt = new JWT();
    console.log(token);

    const studentDecoded = jwt.verifyToken(token);

    if (!studentDecoded) {
      console.log(studentDecoded);

      res.status(401).json({
        ok: false,
        message: "Não autenticado! 3",
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
