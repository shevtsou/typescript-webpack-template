//@ts-check
const piece1 = {x: 3,y: 8,size: 3};
const piece2 = {x: 3, y: 3, size: 3};

const deltaX = Math.abs(piece1.x - piece2.x)
const deltaY = Math.abs(piece1.y - piece2.y)

let d = Math.sqrt(deltaX * deltaX + deltaY + deltaY)
const a = (piece1.size * piece1.size - piece2.size * piece2.size + d * d) / 2/d
const h = Math.sqrt(piece1.size * piece1.size - a * a)

const PX = piece1.x + a/d * (piece2.x - piece1.x);
const PY = piece1.y + a/d * (piece2.y - piece1.y);

const targetX0 = PX + h / d * (piece2.y - piece1.y)
const targetY0 = PY - h / d * (piece2.x - piece1.x)

const targetX1 = PX - h / d * (piece2.y - piece1.y)
const targetY1 = PY + h / d * (piece2.x - piece1.x)

