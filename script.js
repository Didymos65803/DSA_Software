const heap = [];

function insert() {
  const input = document.getElementById("input");
  const val = parseInt(input.value);
  if (isNaN(val) || val < 1 || val > 100) return;
  if(heap.length >= 31) return;
  heap.push(val);
  bubbleUp(heap.length - 1);
  input.value = "";
  render();
  if (heap.length >= 31) {
    document.getElementById("insertBtn").disabled = true;
    document.getElementById("insertBtn").style.opacity = "0.5";
    document.getElementById("insertBtn").style.cursor = "not-allowed";
  }if (heap.length > 0) {
    const btn1 = document.getElementById("popMinBtn");
    btn1.disabled = false;
    btn1.style.opacity = "1";
    btn1.style.cursor = "pointer";
    const btn2 = document.getElementById("popMaxBtn");
    btn2.disabled = false;
    btn2.style.opacity = "1";
    btn2.style.cursor = "pointer";
  }
}

function bubbleUp(i) {
  let parent = Math.floor((i - 1) / 2);
  let level = Math.floor(Math.log2(i));

  while (i > 0) {
    if (level % 2 === 0) { // Min level
      if (heap[i] < heap[parent]) {
        [heap[i], heap[parent]] = [heap[parent], heap[i]];
        i = parent;
        parent = Math.floor((i - 1) / 2);
      } else {
        break;
      }
    } else { // Max level
      if (heap[i] > heap[parent]) {
        [heap[i], heap[parent]] = [heap[parent], heap[i]];
        i = parent;
        parent = Math.floor((i - 1) / 2);
      } else {
        break;
      }
    }
    level = Math.floor(Math.log2(i));
  }
}

function popMin() {
  if (heap.length === 0) return;
  const last = heap.pop();
  if (heap.length > 0) {
    heap[0] = last;
    sinkDownMin(0);
  }
  render();
  if (heap.length < 31) {
    const btn = document.getElementById("insertBtn");
    btn.disabled = false;
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  }if (heap.length <= 0) {
    document.getElementById("popMinBtn").disabled = true;
    document.getElementById("popMinBtn").style.opacity = "0.5";
    document.getElementById("popMinBtn").style.cursor = "not-allowed";
    document.getElementById("popMaxBtn").disabled = true;
    document.getElementById("popMaxBtn").style.opacity = "0.5";
    document.getElementById("popMaxBtn").style.cursor = "not-allowed";
  }
}

function sinkDownMin(i) {
  const length = heap.length;
  const el = heap[i];
  while (true) {
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    let swap = null;

    if (left < length && heap[left] < el) swap = left;
    if (right < length && heap[right] < (swap === null ? el : heap[left])) swap = right;

    if (swap === null) break;
    [heap[i], heap[swap]] = [heap[swap], heap[i]];
    i = swap;
  }
}

function popMax() {
  if (heap.length === 0) return;
  let maxIndex = 0;
  for (let i = 1; i < heap.length; i++) {
    if (heap[i] > heap[maxIndex]) maxIndex = i;
  }
  heap.splice(maxIndex, 1);
  render();
  if (heap.length < 31) {
    const btn = document.getElementById("insertBtn");
    btn.disabled = false;
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  }if (heap.length <= 0) {
    document.getElementById("popMinBtn").disabled = true;
    document.getElementById("popMinBtn").style.opacity = "0.5";
    document.getElementById("popMinBtn").style.cursor = "not-allowed";
    document.getElementById("popMaxBtn").disabled = true;
    document.getElementById("popMaxBtn").style.opacity = "0.5";
    document.getElementById("popMaxBtn").style.cursor = "not-allowed";
  }
}

function render() {
  const display = document.getElementById("heapDisplay");
  const svg = document.getElementById("connectorSVG");
  display.innerHTML = "";
  svg.innerHTML = "";

  const nodeElements = [];
  let level = 0;
  let index = 0;

  while (index < heap.length) {
    const count = Math.pow(2, level);

    const levelDiv = document.createElement("div");
    levelDiv.className = "level";
    levelDiv.style.top = `${level * 100 - 10}px`;
    display.appendChild(levelDiv);

    for (let i = 0; i < count && index < heap.length; i++) {
      const node = document.createElement("div");
      node.className = "node";
      node.textContent = heap[index];
      node.dataset.index = index;
      display.appendChild(node); 

      nodeElements.push({
        el: node,
        level: level,
        positionInLevel: i,
      });

      index++;
    }

    level++;
  }

  requestAnimationFrame(() => {
    const displayRect = display.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const spacingY = 100;

    const positions = [];

    nodeElements.forEach(({ el, level, positionInLevel }, idx) => {
      const nodeWidth = el.offsetWidth;
      const nodeHeight = el.offsetHeight;

      const parts = Math.pow(2, level) + 1;
      const spacingX = displayRect.width / parts;

      const x = (positionInLevel + 1) * spacingX;
      const y = level * spacingY + 40;

      positions[idx] = { x, y };

      el.style.left = `${x - nodeWidth}px`;
      el.style.top = `${y - nodeHeight}px`;
    });

    for (let i = 1; i < heap.length; i++) {
      const parentIndex = Math.floor((i - 1) / 2);
      const child = positions[i];
      const parent = positions[parentIndex];

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", parent.x); 
      line.setAttribute("y1", parent.y); 
      line.setAttribute("x2", child.x); 
      line.setAttribute("y2", child.y);   
      svg.appendChild(line);
    }
  });
}