// Min-Max Heap with Visualization
const heap = [];

function getLevel(i) {
    return Math.floor(Math.log2(i + 1));
}

function isMinLevel(i) {
    return getLevel(i) % 2 === 0;
}

function bubbleUp(i) {
    while (i > 0) {
        const parent = Math.floor((i - 1) / 2);
        const isMin = isMinLevel(i);

        if (isMin) {
            if (heap[i] > heap[parent]) {
                [heap[i], heap[parent]] = [heap[parent], heap[i]];
                i = parent;
            } else {
                const grandparent = Math.floor((parent - 1) / 2);
                if (grandparent >= 0 && heap[i] < heap[grandparent]) {
                    [heap[i], heap[grandparent]] = [heap[grandparent], heap[i]];
                    i = grandparent;
                } else {
                    break;
                }
            }
        } else {
            if (heap[i] < heap[parent]) {
                [heap[i], heap[parent]] = [heap[parent], heap[i]];
                i = parent;
            } else {
                const grandparent = Math.floor((parent - 1) / 2);
                if (grandparent >= 0 && heap[i] > heap[grandparent]) {
                    [heap[i], heap[grandparent]] = [heap[grandparent], heap[i]];
                    i = grandparent;
                } else {
                    break;
                }
            }
        }
    }
}

function sinkDownMin(i) {
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
        [heap[i], heap[smallest]] = [heap[smallest], heap[i]];

        if (isGrandchild) {
            const parent = Math.floor((smallest - 1) / 2);
            if (heap[smallest] > heap[parent]) {
                [heap[smallest], heap[parent]] = [heap[parent], heap[smallest]];
            }
        }

        i = smallest;
    }
}

function sinkDownMax(i) {
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
        [heap[i], heap[largest]] = [heap[largest], heap[i]];

        if (isGrandchild) {
            const parent = Math.floor((largest - 1) / 2);
            if (heap[largest] < heap[parent]) {
                [heap[largest], heap[parent]] = [heap[parent], heap[largest]];
            }
        }

        i = largest;
    }
}

function sinkDown(i) {
    if (isMinLevel(i)) {
        sinkDownMin(i);
    } else {
        sinkDownMax(i);
    }
}

function insert() {
    const input = document.getElementById("input");
    const val = parseInt(input.value);
    if (isNaN(val) || val < 1 || val > 100) return;
    if (heap.length >= 31) return;
    heap.push(val);
    bubbleUp(heap.length - 1);
    input.value = "";
    render();
    updateButtons();
}

function popMin() {
    if (heap.length === 0) return;
    const last = heap.pop();
    if (heap.length > 0) {
        heap[0] = last;
        sinkDownMin(0);
    }
    render();
    updateButtons();
}

function popMax() {
    if (heap.length === 0) return;
    if (heap.length === 1) {
        heap.pop();
    } else {
        let maxIndex = 1;
        if (heap.length > 2 && heap[2] > heap[1]) maxIndex = 2;
        const last = heap.pop();
        if (maxIndex < heap.length) {
            heap[maxIndex] = last;
            sinkDown(maxIndex);
        }
    }
    render();
    updateButtons();
}

function updateButtons() {
    document.getElementById("insertBtn").disabled = heap.length >= 31;
    document.getElementById("insertBtn").style.opacity = heap.length >= 31 ? "0.5" : "1";
    document.getElementById("insertBtn").style.cursor = heap.length >= 31 ? "not-allowed" : "pointer";

    const state = heap.length > 0;
    document.getElementById("popMinBtn").disabled = !state;
    document.getElementById("popMinBtn").style.opacity = state ? "1" : "0.5";
    document.getElementById("popMinBtn").style.cursor = state ? "pointer" : "not-allowed";

    document.getElementById("popMaxBtn").disabled = !state;
    document.getElementById("popMaxBtn").style.opacity = state ? "1" : "0.5";
    document.getElementById("popMaxBtn").style.cursor = state ? "pointer" : "not-allowed";
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
