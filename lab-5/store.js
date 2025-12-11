const STORAGE_KEY='lab5-shapes-state-v1';
export class Store{
 constructor(){
  this.subscribers=new Set();
  const saved=localStorage.getItem(STORAGE_KEY);
  if(saved){
   try{this.state=JSON.parse(saved);}catch(e){this.state={shapes:[]}}
  } else this.state={shapes:[]};
 }
 subscribe(fn){this.subscribers.add(fn);fn(this.state);return ()=>this.subscribers.delete(fn);}
 notify(){localStorage.setItem(STORAGE_KEY,JSON.stringify(this.state));for(const s of this.subscribers)s(this.state);}
 addShape(type,color){const id=Date.now().toString(36)+Math.random().toString(36).slice(2,8);this.state.shapes.push({id,type,color});this.notify();}
 removeShape(id){this.state.shapes=this.state.shapes.filter(s=>s.id!==id);this.notify();}
 recolor(type,color){for(const s of this.state.shapes){if(s.type===type)s.color=color;}this.notify();}
 getCounts(){return{square:this.state.shapes.filter(s=>s.type==='square').length,circle:this.state.shapes.filter(s=>s.type==='circle').length};}
}
export const store=new Store();