import './ui.js';
import { store } from './store.js';
import { randomColor } from './helpers.js';

const addSquareBtn=document.getElementById('add-square');
const addCircleBtn=document.getElementById('add-circle');
const colorSquareInput=document.getElementById('color-square');
const colorCircleInput=document.getElementById('color-circle');

addSquareBtn.addEventListener('click',()=>store.addShape('square',colorSquareInput.value||randomColor()));
addCircleBtn.addEventListener('click',()=>store.addShape('circle',colorCircleInput.value||randomColor()));

colorSquareInput.addEventListener('input',e=>store.recolor('square',e.target.value));
colorCircleInput.addEventListener('input',e=>store.recolor('circle',e.target.value));
