/**
 * @param {{x: number, y: number, size: number}} circle1
 * @param {{x: number, y: number, size: number}} circle2
 * @return {Array<{x: number, y: number}>}
 */
function getCircleIntercectPoints(circle1, circle2) {
  const mergePoints = [];
  //to optimize
  const piece1 = circle1;
  const piece2 = circle2;
  const deltaX = Math.abs(piece1.x - piece2.x);
  const deltaY = Math.abs(piece1.y - piece2.y);

  let d = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const a =
    (piece1.size * piece1.size - piece2.size * piece2.size + d * d) / 2 / d;
  const h = Math.sqrt(piece1.size * piece1.size - a * a);

  const PX = piece1.x + (a / d) * (piece2.x - piece1.x);
  const PY = piece1.y + (a / d) * (piece2.y - piece1.y);

  const targetX0 = PX + (h / d) * (piece2.y - piece1.y);
  const targetY0 = PY - (h / d) * (piece2.x - piece1.x);

  const targetX1 = PX - (h / d) * (piece2.y - piece1.y);
  const targetY1 = PY + (h / d) * (piece2.x - piece1.x);
  if (targetX0 !== NaN && targetY0 !== NaN) {
    mergePoints.push({ x: targetX0, y: targetY0 });
  }
  if (targetX1 !== NaN && targetY1 !== NaN) {
    mergePoints.push({ x: targetX1, y: targetY1 });
  }
  return mergePoints;
}

export { getCircleIntercectPoints };