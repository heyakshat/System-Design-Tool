let blockId = 0;

function addBlock(label) {
  const canvas = document.getElementById('canvas');
  const block = document.createElement('div');
  block.className = 'block';
  block.textContent = label;
  block.id = `block-${blockId++}`;
  block.style.left = '100px';
  block.style.top = '100px';
  makeDraggable(block);
  canvas.appendChild(block);
}

function makeDraggable(element) {
  let offsetX = 0, offsetY = 0, isDragging = false;

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
  });

  function mouseMove(e) {
    if (!isDragging) return;
    const canvasRect = document.getElementById('canvas').getBoundingClientRect();
    element.style.left = `${e.clientX - canvasRect.left - offsetX}px`;
    element.style.top = `${e.clientY - canvasRect.top - offsetY}px`;
  }

  function mouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);
  }
}
let connectMode = false;
let firstBlock = null;

function toggleConnectMode() {
  connectMode = !connectMode;
  firstBlock = null;
  alert(connectMode ? "Connect Mode ON: Click 2 blocks" : "Connect Mode OFF");
}

document.getElementById('canvas').addEventListener('click', function (e) {
  if (!connectMode) return;

  if (e.target.classList.contains('block')) {
    if (!firstBlock) {
      firstBlock = e.target;
      firstBlock.style.borderColor = 'green'; // highlight
    } else {
      new LeaderLine(firstBlock, e.target, { color: 'gray', size: 2, dash: { animation: true } });
      firstBlock.style.borderColor = '#0284c7'; // reset
      firstBlock = null;
    }
  }
});
function saveDesign() {
  const blocks = document.querySelectorAll('.block');
  const data = [];

  blocks.forEach(block => {
    data.push({
      id: block.id,
      label: block.textContent,
      left: block.style.left,
      top: block.style.top
    });
  });

  localStorage.setItem('design', JSON.stringify(data));
  alert("✅ Design saved!");
}

function loadDesign() {
  const data = JSON.parse(localStorage.getItem('design'));
  if (!data) {
    alert("⚠️ No saved design found.");
    return;
  }
  document.getElementById('canvas').innerHTML = '';
  blockId = 0;

  data.forEach(blockData => {
    const canvas = document.getElementById('canvas');
    const block = document.createElement('div');
    block.className = 'block';
    block.textContent = blockData.label;
    block.id = blockData.id;
    block.style.left = blockData.left;
    block.style.top = blockData.top;

    makeDraggable(block);
    canvas.appendChild(block);
    blockId++;
  });

  alert("📂 Design loaded!");
}
function toggleConnectMode() {
  connectMode = !connectMode;
  firstBlock = null;

  const btn = document.getElementById('connect-btn');
  if (connectMode) {
    btn.classList.add('active');
    btn.textContent = '🟢 Connecting...';
  } else {
    btn.classList.remove('active');
    btn.textContent = '🔗 Connect Mode';
  }
}
function clearCanvas() {
  document.getElementById('canvas').innerHTML = '';
  localStorage.removeItem('blocks');
  localStorage.removeItem('connections');
  lines = [];
  blockId = 0;
  LeaderLine.removeAll();
  connectMode = false;
  firstBlock = null;
  const btn = document.getElementById('connect-btn');
  btn.classList.remove('active');
  btn.textContent = '🔗 Connect Mode';
  alert("🗑️ All blocks and connections cleared!");
}
if (savedLines && savedLines.length > 0) {
  requestAnimationFrame(() => {
    savedLines.forEach(line => {
      const from = document.getElementById(line.from);
      const to = document.getElementById(line.to);
      if (from && to) {
        const leaderLine = new LeaderLine(from, to, { color: '#6b7280', size: 2 });
        activeLines.push(leaderLine);
        lines.push({ from: from.id, to: to.id });
      }
    });
  });
}





