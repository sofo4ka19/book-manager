export interface ISerializer<T> {
    deserialize(data: any): T; // Перетворення в об'єкт
    serialize(obj: T): any; // Перетворення в формат джерела
}

export abstract class Serializer<T> implements ISerializer<T> {
    abstract deserialize(data: any): T;
    abstract serialize(obj: T): any;
}