import { store } from './store.js';
const shapesList=document.getElementById('shapes-list');
const countSquareEl=document.getElementById('count-square');
const countCircleEl=document.getElementById('count-circle');

function createShapeElement(shape){
 const li=document.createElement('li');
 li.className='shape '+(shape.type==='circle'?'circle':'square');
 li.dataset.id=shape.id;
 li.dataset.type=shape.type;
 li.style.background=shape.color;
 return li;
}

let lastIds=new Set();
store.subscribe(state=>{
 const currentIds=new Set(state.shapes.map(s=>s.id));
 for(const s of state.shapes) if(!lastIds.has(s.id)) shapesList.appendChild(createShapeElement(s));
 for(const id of lastIds) if(!currentIds.has(id)){const el=shapesList.querySelector(`[data-id="${id}"]`);if(el)el.remove();}
 const counts=store.getCounts();
 countSquareEl.textContent=`Kwadraty: ${counts.square}`;
 countCircleEl.textContent=`Kółka: ${counts.circle}`;
 lastIds=currentIds;
});

shapesList.addEventListener('click',e=>{
 const li=e.target.closest('.shape');
 if(li) store.removeShape(li.dataset.id);
});