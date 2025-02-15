// interfaces/dto/auth.ts
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  repassword: string;
}

export interface CreateUserDTO {
  username: string;
  email: string;
  passwordHash: string;
}
