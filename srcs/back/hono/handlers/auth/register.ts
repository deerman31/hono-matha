import { Context } from "hono";
import { RegisterRequest } from "../../interfaces/dto/auth.ts";
import { AuthServiceImpl } from "../../services/auth/index.ts";
import { HTTPException } from "hono/http-exception";

const registerHandler = async (
  c: Context,
  service: AuthServiceImpl,
): Promise<Response> => {
  const body = await c.req.json();
  const req = body as RegisterRequest;

  try {
    await service.register(req);
    return c.json({
      message: "User registered successfully",
      status: 201,
    }, 201);
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({
        message: error.message,
        status: error.status,
        errorType: "HTTPException",
      }, error.status);
    } else {
      console.error("Unexpected error during registration:", error);
      // その他の予期せぬエラーの処理
      return c.json({
        message: "Internal Server Error",
        status: 500,
        errorType: "UnexpectedError",
      }, 500);
    }
  }
};

export default registerHandler;
