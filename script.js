const heap = [];

function insert() {
  const input = document.getElementById("input");
  const val = parseInt(input.value);
  if (isNaN(val) || val < 1 || val > 100) return;
  heap.push(val);
  bubbleUp(heap.length - 1);
  input.value = "";
  render();
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
}

function render() {
    const display = document.getElementById("heapDisplay");
    const svg = document.getElementById("connectorSVG");
    display.innerHTML = "";
    svg.innerHTML = "";
  
    
    let level = 0;
    let index = 0;
    const nodePositions = [];
  
    while (index < heap.length) {
      const count = Math.pow(2, level);
      const levelDiv = document.createElement("div");
      levelDiv.className = "level";
  
      for (let i = 0; i < count && index < heap.length; i++) {
        const node = document.createElement("div");
        node.className = "node";
        node.textContent = heap[index];
        node.dataset.index = index;
  
        levelDiv.appendChild(node);
        index++;
      }
  
      display.appendChild(levelDiv);
      level++;
    }

    requestAnimationFrame(() => {
      const nodes = document.querySelectorAll(".node");
      const positions = [];
  
      nodes.forEach(node => {
        const rect = node.getBoundingClientRect();
        const parentRect = display.getBoundingClientRect();
        positions.push({
          x: rect.left + rect.width / 2 - parentRect.left,
          y: rect.top + rect.height / 2 - parentRect.top,
        });
      });
  
      for (let i = 0; i < positions.length; i++) {
        const parentIndex = Math.floor((i - 1) / 2);
        if (parentIndex >= 0) {
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", positions[parentIndex].x);
          line.setAttribute("y1", positions[parentIndex].y);
          line.setAttribute("x2", positions[i].x);
          line.setAttribute("y2", positions[i].y);
          line.setAttribute("stroke", "#94a3b8");
          line.setAttribute("stroke-width", "2");
          svg.appendChild(line);
        }
      }
    });
  }
  
