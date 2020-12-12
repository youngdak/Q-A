export default interface IFake<T> {
	fake(): Promise<T>;
}
