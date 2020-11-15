import UserId from "../../../domain/users/userId";
import UserDto from "../queries/userDto";

export default interface IUserQuery {
    getAll(): Promise<UserDto[]>;
    getById(id: UserId): Promise<UserDto>;
    getByEmail(email: string): Promise<UserDto>;
}