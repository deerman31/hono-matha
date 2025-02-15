export interface UserRepository {
  create(user: CreateUserDTO): Promise<number>;
  checkDuplicateCredentials(
    username: string,
    email: string,
  ): Promise<DuplicateCheckResult>;
  withTransaction<T>(
    operation: (repository: UserRepository) => Promise<T>,
  ): Promise<T>;
}

// DTOの定義
export interface CreateUserDTO {
  username: string;
  email: string;
  passwordHash: string;
}

export interface DuplicateCheckResult {
  usernameExists: boolean;
  emailExists: boolean;
}
