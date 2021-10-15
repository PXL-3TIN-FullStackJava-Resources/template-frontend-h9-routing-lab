export class Student {
    name: string;
    age: number;
    group: string;
    _id: string;

    constructor(name: string, age: number, group: string, _id?: string){
        this.name = name;
        this.age = age;
        this.group = group;
        this._id = _id || '';
    }
}