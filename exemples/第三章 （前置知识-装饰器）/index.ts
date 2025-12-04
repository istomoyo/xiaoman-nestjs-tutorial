const doc:ClassDecorator = (target:any)=>{
    console.log('target :>> ', target);
    target.prototype.name = 'xiaoman';
}
interface Xiaoman{
    name:string;
}

@doc
class Xiaoman{
    constructor(){
    }
}

const xiaoman = new Xiaoman();
console.log('xiaoman :>> ', xiaoman);
console.log('xiaoman.name :>> ', xiaoman.name);