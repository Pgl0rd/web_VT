const fs = require('fs').promises;
const path = require('path');
const dataFile = path.join(__dirname, 'products.json');

async function read() {
  try {
    const txt = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(txt || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(dataFile, '[]', 'utf8');
      return [];
    }
    throw err;
  }
}

async function write(items) {
  await fs.writeFile(dataFile, JSON.stringify(items, null, 2), 'utf8');
}

exports.list = async () => {
  return await read();
};

exports.get = async (id) => {
  const items = await read();
  return items.find(p => String(p.id) === String(id));
};

exports.create = async (data) => {
  const items = await read();
  const nextId = (items.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0) + 1);
  const item = Object.assign({ id: nextId }, data);
  items.push(item);
  await write(items);
  return item;
};

exports.update = async (id, data) => {
  const items = await read();
  const idx = items.findIndex(p => String(p.id) === String(id));
  if (idx === -1) return null;
  items[idx] = Object.assign({}, items[idx], data);
  await write(items);
  return items[idx];
};

exports.remove = async (id) => {
  const items = await read();
  const idx = items.findIndex(p => String(p.id) === String(id));
  if (idx === -1) return false;
  items.splice(idx, 1);
  await write(items);
  return true;
};
