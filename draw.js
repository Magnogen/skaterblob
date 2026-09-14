const circle = (ctx, { x, y, r, inverted = false }) => {
  ctx.fillStyle = '#202020';
  ctx.beginPath();
  if (inverted) ctx.rect(-10, -10, 20, 20);
  ctx.arc(x, y, r, 0, 2*Math.PI);
  ctx.fill(inverted ? 'evenodd' : 'nonzero');
};

const grapple = (ctx, { x, y }) => {
  ctx.fillStyle = '#1b7944';
  ctx.beginPath();
  ctx.arc(x, y, 0.01, 0, 2*Math.PI);
  ctx.fill();
};

export const draw = (ctx, level) => {
  for (const object of level) {
    if (object.type == 'circle') circle(ctx, object);
    if (object.type == 'grapple') grapple(ctx, object);
  }
};