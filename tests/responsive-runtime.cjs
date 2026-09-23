const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

// Exercise the real animation controller with controlled viewport/element sizes.
// These are runtime tests, not a substitute for browser layout or screenshot tests.
function expandHarness(width, height, cardHeight = 420, reduced = false) {
  const events = {}, motionEvents = {}, frames = new Map();
  let frame = 0, top = 0;
  const node = () => ({ style: { setProperty(k,v) { this[k] = v; } }, setAttribute() {} });
  const selectors = Object.fromEntries(['track','stage','frame','media','title','hint','overlay','scrim','glass-card'].map(k => ['.scroll-expand__'+k,node()]));
  const card = selectors['.scroll-expand__glass-card']; card.offsetHeight = cardHeight;
  selectors['.scroll-expand__track'].getBoundingClientRect = () => ({ top });
  const root = { clientWidth: width, clientHeight: height, dataset: {}, appendChild(el) { this.probe=el; }, querySelector: q => selectors[q] };
  const motion = { matches: reduced, addEventListener(k,fn) { motionEvents[k]=fn; } };
  const window = { innerWidth: width, innerHeight: height, matchMedia: () => motion, addEventListener(k,fn) { events[k]=fn; } };
  const document = { getElementById: () => root, createElement() { const el=node(); Object.defineProperty(el,'offsetHeight',{get:()=>window.innerHeight}); return el; }, addEventListener() {} };
  const context = { window, document, ResizeObserver: class { observe() {} }, requestAnimationFrame(fn) { frames.set(++frame,fn); return frame; }, cancelAnimationFrame(id) { frames.delete(id); } };
  vm.runInNewContext(fs.readFileSync('js/scroll-expand.js','utf8'),context);
  window.initScrollExpand('scroll-expand-section');
  return { root, selectors, motion, window, resize(w,h) { window.innerWidth=w; window.innerHeight=h; root.clientWidth=w; events.resize(); }, reduce(value) { motion.matches=value; motionEvents.change(); }, scroll(y) { top=-y; events.scroll(); for(let i=0;frames.size && i<200;i++) { const batch=[...frames.values()]; frames.clear(); batch.forEach(fn=>fn()); } assert.equal(frames.size,0,'animation should settle'); } };
}

for (const [w,h] of [[320,568],[390,844],[768,1024],[1024,768],[1366,768],[1920,1080],[844,390]]) {
  test(`expand animation: ${w}×${h}`,()=>{
    const ui=expandHarness(w,h);
    const stageHeight=parseFloat(ui.selectors['.scroll-expand__stage'].style.height);
    assert.ok(stageHeight>=h && stageHeight>=552,'stage fits viewport and card');
    assert.ok(parseFloat(ui.selectors['.scroll-expand__track'].style.height)>stageHeight);
    assert.equal(ui.root.dataset.static,'false');
    ui.scroll(stageHeight*2);
    assert.equal(ui.selectors['.scroll-expand__frame'].style.clipPath,'inset(0% 0% 0% 0% round 0px)');
    assert.equal(ui.selectors['.scroll-expand__overlay'].style.opacity,'1');
    assert.equal(ui.selectors['.scroll-expand__overlay'].style.pointerEvents,'auto');
  });
}
test('rotation remeasures the starting frame and large text remains contained',()=>{
  const ui=expandHarness(390,844,900);
  assert.equal(ui.selectors['.scroll-expand__frame'].style.clipPath,'inset(16% 7% 16% 7% round 18px)');
  ui.resize(1024,768);
  assert.equal(ui.selectors['.scroll-expand__frame'].style.clipPath,'inset(20% 27% 20% 27% round 28px)');
  assert.equal(ui.selectors['.scroll-expand__stage'].style.height,'1032px');
});
test('reduced motion shows actionable content without a long scroll track',()=>{
  const ui=expandHarness(390,844);
  ui.reduce(true);
  assert.equal(ui.root.dataset.static,'true');
  assert.equal(ui.selectors['.scroll-expand__stage'].style.height,ui.selectors['.scroll-expand__track'].style.height);
  assert.equal(ui.selectors['.scroll-expand__overlay'].style.opacity,'1');
  assert.equal(ui.selectors['.scroll-expand__overlay'].style.pointerEvents,'auto');
  ui.reduce(false);
  assert.equal(ui.root.dataset.static,'false');
});

test('all local assets and internal section links resolve',()=>{
  const html=fs.readFileSync('index.html','utf8');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size);
  for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const path=m[1];
    if(path.startsWith('#') && path.length>1) assert.ok(ids.includes(path.slice(1)),path);
    else if(!/^(?:https?:|data:|javascript:|mailto:|tel:|#)/.test(path)) assert.ok(fs.existsSync(path),path);
  }
});

test('phone menu initializes compactly and keyboard navigation closes the menu',()=>{
  const makeNode = () => ({
    children: [], events: {}, attributes: {}, scrollHeight: 48,
    classList: { add() {}, remove() {} },
    style: { setProperty(k,v) { this[k]=v; } },
    setAttribute(k,v) { this.attributes[k]=v; },
    addEventListener(k,fn) { this.events[k]=fn; },
    appendChild(el) { this.children.push(el); }
  });
  const root=makeNode(); root.clientWidth=288;
  let closed=false, navigated=false;
  const window={ innerWidth:320, addEventListener() {}, removeEventListener() {}, matchMedia:()=>({matches:true}), toggleMenu(open) { closed=!open; } };
  const document={ documentElement:{}, body:makeNode(), createElement:makeNode, addEventListener() {}, getElementById:id=>id==='test-wheel'?root:null, querySelector:()=>({scrollIntoView(){navigated=true;}}) };
  const context={window,document,performance:{now:()=>0},getComputedStyle:()=>({fontSize:'16px'}),requestAnimationFrame:()=>1,cancelAnimationFrame(){},setTimeout:fn=>fn(),clearTimeout(){},ResizeObserver:class{observe(){} disconnect(){}}};
  vm.runInNewContext(fs.readFileSync('js/option-wheel.js','utf8'),context);
  window.initOptionWheel('test-wheel');
  assert.ok(parseFloat(root.style['--ow-font-size'])<=1.35,'compact sizing runs on initial load');
  root.events.keydown({key:'Enter',preventDefault(){}});
  assert.equal(closed,true,'shared close handler resumes page scrolling');
  assert.equal(navigated,true,'selected destination is reached');
});
