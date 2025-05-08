// 1-based array
// Min-Max Heap Implementation in JavaScript
let heap = [];
let heapSize = 0;

// Swap two elements in the heap
function swap(i, j) {
  let temp = heap[i];
  heap[i] = heap[j];
  heap[j] = temp;
}

// Check if a level is a "min level"
function minLevel(i) {
  let level = 0;
  while (i >= 1) {
    i = Math.floor(i / 2);
    level++;
  }
  return level % 2 === 1;
}

// Push-Up operation for max levels
function pushUpMax(i) {
  if (i > 7) {
    if (heap[i] > heap[Math.floor(i / 4)]) {
      swap(i, Math.floor(i / 4));
      pushUpMax(Math.floor(i / 4));
    }
  }
}

// Push-Up operation for min levels
function pushUpMin(i) {
  if (i > 3) {
    if (heap[i] < heap[Math.floor(i / 4)]) {
      swap(i, Math.floor(i / 4));
      pushUpMin(Math.floor(i / 4));
    }
  }
}

// Push-Up operation (handles both min and max levels)
function pushUp(i) {
  if (i === 1) return; // root element

  if (minLevel(i)) {
    // min level
    if (heap[i] > heap[Math.floor(i / 2)]) {
      swap(i, Math.floor(i / 2));
      pushUpMax(Math.floor(i / 2));
    } else {
      pushUpMin(i);
    }
  } else {
    // max level
    if (heap[i] < heap[Math.floor(i / 2)]) {
      swap(i, Math.floor(i / 2));
      pushUpMin(Math.floor(i / 2));
    } else {
      pushUpMax(i);
    }
  }
}

// Push-Down operation for min levels
function pushDownMin(i) {
  if (i * 2 <= heapSize) {
    let grandchildren = false;
    let childrenAndGrandchildren = [2 * i, 2 * i + 1, 4 * i, 4 * i + 1, 4 * i + 2, 4 * i + 3];
    let j = 0;
    let min = 2 * i;

    // Find the minimum element among the children and grandchildren
    while (childrenAndGrandchildren[j] <= heapSize) {
      if (heap[childrenAndGrandchildren[j]] < heap[min]) {
        min = childrenAndGrandchildren[j];
        if (j >= 2) {
          grandchildren = true;
        }
      }
      j++;
      if (j > 5) break;
    }

    // Handle swapping and push-down logic
    if (grandchildren) {
      if (heap[min] < heap[i]) {
        swap(min, i);
        if (heap[min] > heap[Math.floor(min / 2)]) {
          swap(min, Math.floor(min / 2));
        }
        pushDown(min);
      }
    } else if (heap[min] < heap[i]) {
      swap(min, i);
    }
  }
}

// Push-Down operation for max levels
function pushDownMax(i) {
  if (i * 2 <= heapSize) {
    let grandchildren = false;
    let childrenAndGrandchildren = [2 * i, 2 * i + 1, 4 * i, 4 * i + 1, 4 * i + 2, 4 * i + 3];
    let j = 0;
    let max = 2 * i;

    // Find the maximum element among the children and grandchildren
    while (childrenAndGrandchildren[j] <= heapSize) {
      if (heap[childrenAndGrandchildren[j]] > heap[max]) {
        max = childrenAndGrandchildren[j];
        if (j >= 2) {
          grandchildren = true;
        }
      }
      j++;
      if (j > 5) break;
    }

    // Handle swapping and push-down logic
    if (grandchildren) {
      if (heap[max] > heap[i]) {
        swap(max, i);
        if (heap[max] < heap[Math.floor(max / 2)]) {
          swap(max, Math.floor(max / 2));
        }
        pushDown(max);
      }
    } else if (heap[max] > heap[i]) {
      swap(max, i);
    }
  }
}

// Push-Down operation (handles both min and max levels)
function pushDown(i) {
  if (minLevel(i)) {
    pushDownMin(i);
  } else {
    pushDownMax(i);
  }
}

// Insert a new element into the heap
function insert(value) {
  heapSize++;
  heap[heapSize] = value;
  pushUp(heapSize);
}

// Remove and return the top element (root)
function remove() {
  if (heapSize === 0) {
    console.log("No elements in the heap");
    return;
  }

  const root = heap[1];
  heap[1] = heap[heapSize];
  heapSize--;
  pushDown(1);

  return root;
}

// Get the current heap (for debugging)
function getHeap() {
  return heap.slice(1, heapSize + 1); // Skip the 0th index to match 1-based index
}

