const circle = (player, circle) => {
  const dx = player.x - circle.x;
  const dy = player.y - circle.y;

  const distance = Math.hypot(dx, dy);
  const radius = circle.r - player.r;

  if (circle.inverted && distance > radius) {
    const nx = dx / distance;
    const ny = dy / distance;

    player.x = circle.x + nx * radius;
    player.y = circle.y + ny * radius;

    const dot = player.vx * nx + player.vy * ny;
    if (dot > 0) {
      player.vx -= 2 * dot * nx;
      player.vy -= 2 * dot * ny;
    }
  }
  if (!circle.inverted && distance < radius) {
    const nx = dx / distance;
    const ny = dy / distance;
    
    player.x = circle.x + nx * radius;
    player.y = circle.y + ny * radius;
    
    const dot = player.vx * nx + player.vy * ny;
    
    if (dot < 0) {
      player.vx -= 2 * dot * nx;
      player.vy -= 2 * dot * ny;
    }
  }
};

const grapple = (player) => {
  if (!player.grapple.active) return;

  const dx = player.x - player.grapple.x;
  const dy = player.y - player.grapple.y;

  const distance = Math.hypot(dx, dy);

  if (distance <= player.grapple.length) return;

  // Normal pointing from anchor -> player
  const nx = dx / distance;
  const ny = dy / distance;

  // Put player exactly on rope
  player.x = player.grapple.x + nx * player.grapple.length;
  player.y = player.grapple.y + ny * player.grapple.length;

  // Velocity along rope
  const radialVelocity =
    player.vx * nx +
    player.vy * ny;

  // Only remove velocity going AWAY from anchor
  if (radialVelocity > 0) {
    player.vx -= radialVelocity * nx;
    player.vy -= radialVelocity * ny;
  }
}

export const constrain = (player, level) => {
  grapple(player);

  for (const object of level) {
    if (object.type == 'circle') {
      circle(player, object);
    }
  }
};