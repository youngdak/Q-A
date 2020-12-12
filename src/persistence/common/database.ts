import { Container } from "inversify";

export default interface IDatabase {
	connect(container: Container) : Promise<void>;
}
