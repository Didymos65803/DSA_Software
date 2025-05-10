// Min-Max Heap with Visualization
const heap = [];

function getLevel(i) {
    return Math.floor(Math.log2(i + 1));
}

function isMinLevel(i) {
    return getLevel(i) % 2 === 0;
}

async function swapNodes(i, j) {
    const nodes = document.querySelectorAll('.node');
    const nodeI = Array.from(nodes).find(node => node.dataset.index == i);
    const nodeJ = Array.from(nodes).find(node => node.dataset.index == j);

    if (!nodeI || !nodeJ) return; // Safeguard against missing nodes

    nodeI.classList.add('swap-highlight');
    nodeJ.classList.add('swap-highlight');
    await new Promise(resolve => setTimeout(resolve, 500));

    [heap[i], heap[j]] = [heap[j], heap[i]];
    nodeI.textContent = heap[i];
    nodeJ.textContent = heap[j];
    nodeI.dataset.index = i;
    nodeJ.dataset.index = j;

    render();

    await new Promise(resolve => setTimeout(resolve, 500));
    nodeI.classList.remove('swap-highlight');
    nodeJ.classList.remove('swap-highlight');
}

async function bubbleUp(i) {
    while (i > 0) {
        const parent = Math.floor((i - 1) / 2);
        const isMin = isMinLevel(i);

        if (isMin) {
            if (heap[i] > heap[parent]) {
                await swapNodes(i, parent);
                i = parent;
            } else {
                const grandparent = Math.floor((parent - 1) / 2);
                if (grandparent >= 0 && heap[i] < heap[grandparent]) {
                    await swapNodes(i, grandparent);
                    i = grandparent;
                } else {
                    break;
                }
            }
        } else {
            if (heap[i] < heap[parent]) {
                await swapNodes(i, parent);
                i = parent;
            } else {
                const grandparent = Math.floor((parent - 1) / 2);
                if (grandparent >= 0 && heap[i] > heap[grandparent]) {
                    await swapNodes(i, grandparent);
                    i = grandparent;
                } else {
                    break;
                }
            }
        }
    }
}

async function sinkDownMin(i) {
    const length = heap.length;
    while (true) {
        let smallest = i;
        const children = [2 * i + 1, 2 * i + 2].filter(idx => idx < length);
        const grandchildren = [4 * i + 3, 4 * i + 4, 4 * i + 5, 4 * i + 6].filter(idx => idx < length);

        children.forEach(idx => {
            if (heap[idx] < heap[smallest]) smallest = idx;
        });

        grandchildren.forEach(idx => {
            if (heap[idx] < heap[smallest]) smallest = idx;
        });

        if (smallest === i) break;

        const isGrandchild = grandchildren.includes(smallest);
        await swapNodes(i, smallest);

        if (isGrandchild) {
            const parent = Math.floor((smallest - 1) / 2);
            if (heap[smallest] > heap[parent]) {
                await swapNodes(smallest, parent);
            }
        }

        i = smallest;
    }
}

async function sinkDownMax(i) {
    const length = heap.length;
    while (true) {
        let largest = i;
        const children = [2 * i + 1, 2 * i + 2].filter(idx => idx < length);
        const grandchildren = [4 * i + 3, 4 * i + 4, 4 * i + 5, 4 * i + 6].filter(idx => idx < length);

        children.forEach(idx => {
            if (heap[idx] > heap[largest]) largest = idx;
        });

        grandchildren.forEach(idx => {
            if (heap[idx] > heap[largest]) largest = idx;
        });

        if (largest === i) break;

        const isGrandchild = grandchildren.includes(largest);
        await swapNodes(i, largest);

        if (isGrandchild) {
            const parent = Math.floor((largest - 1) / 2);
            if (heap[largest] < heap[parent]) {
                await swapNodes(largest, parent);
            }
        }

        i = largest;
    }
}

async function sinkDown(i) {
    if (isMinLevel(i)) {
        await sinkDownMin(i);
    } else {
        await sinkDownMax(i);
    }
}

async function insert() {
    const input = document.getElementById("input");
    const val = parseInt(input.value);
    if (isNaN(val) || val < 1 || val > 100000) return;
    
    // Optional: Limit heap size to prevent performance issues
    if (heap.length >= 127) return; // 6 levels max
    
    setButtonsEnabled(false);
    heap.push(val);
    render();
    const nodes = document.querySelectorAll('.node');
    const newNode = Array.from(nodes).find(node => node.dataset.index == heap.length - 1);
    if (newNode) {
        newNode.classList.add('new-node');
        setTimeout(() => newNode.classList.remove('new-node'), 1000);
    }

    await bubbleUp(heap.length - 1);
    input.value = "";
    setButtonsEnabled(true);
    updateButtons();
}

async function popMin() {
    if (heap.length === 0) return;

    setButtonsEnabled(false);
    const nodes = document.querySelectorAll('.node');
    const minNode = Array.from(nodes).find(node => node.dataset.index == 0);
    if (minNode) {
        minNode.classList.add('pre-pop');
        await new Promise(resolve => setTimeout(resolve, 1000));
        minNode.classList.remove('pre-pop');
    }

    const lastIndex = heap.length - 1;
    const last = heap[lastIndex];
    if (heap.length > 1) {
        await swapNodes(0, lastIndex);
    }
    heap.pop();
    render();
    if (heap.length > 0) {
        heap[0] = last;
        await sinkDownMin(0);
    }
    render();
    setButtonsEnabled(true);
    updateButtons();
}

async function popMax() {
    if (heap.length === 0) return;

    setButtonsEnabled(false);
    if (heap.length === 1) {
        const nodes = document.querySelectorAll('.node');
        const maxNode = Array.from(nodes).find(node => node.dataset.index == 0);
        if (maxNode) {
            maxNode.classList.add('pre-pop');
            await new Promise(resolve => setTimeout(resolve, 1000));
            maxNode.classList.remove('pre-pop');
        }
        heap.pop();
    } else {
        let maxIndex = 1;
        if (heap.length > 2 && heap[2] > heap[1]) maxIndex = 2;
        const nodes = document.querySelectorAll('.node');
        const maxNode = Array.from(nodes).find(node => node.dataset.index == maxIndex);
        if (maxNode) {
            maxNode.classList.add('pre-pop');
            await new Promise(resolve => setTimeout(resolve, 1000));
            maxNode.classList.remove('pre-pop');
        }
        const lastIndex = heap.length - 1;
        const last = heap[lastIndex];
        if (maxIndex < heap.length - 1) {
            await swapNodes(maxIndex, lastIndex);
        }
        heap.pop();
        render();
        if (maxIndex < heap.length) {
            heap[maxIndex] = last;
            await sinkDown(maxIndex);
        }
    }
    render();
    setButtonsEnabled(true);
    updateButtons();
}

function updateButtons() {
    // Limit heap size to 127 nodes
    const isFull = heap.length >= 127;
    document.getElementById("insertBtn").disabled = isFull;
    document.getElementById("insertBtn").style.opacity = isFull ? "0.5" : "1";
    document.getElementById("insertBtn").style.cursor = isFull ? "not-allowed" : "pointer";

    const state = heap.length > 0;
    document.getElementById("popMinBtn").disabled = !state;
    document.getElementById("popMinBtn").style.opacity = state ? "1" : "0.5";
    document.getElementById("popMinBtn").style.cursor = state ? "pointer" : "not-allowed";

    document.getElementById("popMaxBtn").disabled = !state;
    document.getElementById("popMaxBtn").style.opacity = state ? "1" : "0.5";
    document.getElementById("popMaxBtn").style.cursor = state ? "pointer" : "not-allowed";
}

function setButtonsEnabled(enabled) {
    const buttons = ["insertBtn", "popMinBtn", "popMaxBtn"].map(id => document.getElementById(id));
    buttons.forEach(btn => {
        btn.disabled = !enabled;
        btn.style.cursor = enabled ? "pointer" : "not-allowed";
        btn.style.opacity = enabled ? "1" : "0.5";
    });
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
        const displayRect = document.getElementById("heapDisplay").getBoundingClientRect();
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