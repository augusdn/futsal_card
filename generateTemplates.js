const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

// Generate template backgrounds for bronze, silver, and gold tiers
function createTemplates() {
  const CARD_WIDTH = 1024;
  const CARD_HEIGHT = 1024;

  const tiers = {
    bronze: {
      gradient: ['#C9A876', '#B89968', '#9A7D52'],
      accent: '#6B5434',
      darkSection: 'rgba(61, 44, 28, 0.3)'
    },
    silver: {
      gradient: ['#E0E0E0', '#C8C8C8', '#B0B0B0'],
      accent: '#808080',
      darkSection: 'rgba(80, 80, 80, 0.3)'
    },
    gold: {
      gradient: ['#FFD700', '#EFBB00', '#D4A017'],
      accent: '#B8860B',
      darkSection: 'rgba(139, 90, 0, 0.3)'
    }
  };

  Object.keys(tiers).forEach(tier => {
    const canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT);
    const ctx = canvas.getContext('2d');
    const colors = tiers[tier];

    // Draw shield-shaped card background
    ctx.fillStyle = colors.gradient[1];
    drawShieldShape(ctx, CARD_WIDTH, CARD_HEIGHT, colors);

    // Horizontal separator line above name area
    const separatorY = 840;
    ctx.fillStyle = colors.darkSection;
    ctx.fillRect(0, separatorY, CARD_WIDTH, 4);

    // Darker bottom section for name and stats
    const nameAreaY = 844;
    const gradient2 = ctx.createLinearGradient(0, nameAreaY, 0, CARD_HEIGHT);
    gradient2.addColorStop(0, colors.gradient[1]);
    gradient2.addColorStop(0.3, colors.gradient[2]);
    gradient2.addColorStop(1, colors.gradient[2]);
    
    // Clip to shield shape for bottom gradient
    ctx.save();
    drawShieldShapePath(ctx, CARD_WIDTH, CARD_HEIGHT);
    ctx.clip();
    ctx.fillStyle = gradient2;
    ctx.fillRect(0, nameAreaY, CARD_WIDTH, CARD_HEIGHT - nameAreaY);
    ctx.restore();

    // Add subtle border
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 0;
    drawShieldShapePath(ctx, CARD_WIDTH, CARD_HEIGHT);
    ctx.stroke();

    // Save template
    const outputPath = path.join(__dirname, 'templates', `${tier}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    console.log(`✓ Created ${tier} template`);
  });

  console.log('\n✅ All templates generated successfully!');
}

function drawShieldShape(ctx, width, height, colors) {
  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height * 0.52);
  gradient.addColorStop(0, colors.gradient[0]);
  gradient.addColorStop(0.5, colors.gradient[1]);
  gradient.addColorStop(1, colors.gradient[1]);
  
  ctx.fillStyle = gradient;
  drawShieldShapePath(ctx, width, height);
  ctx.fill();
}

function drawShieldShapePath(ctx, width, height) {
  ctx.beginPath();
  
  // Top left curve
  const topRadius = 60;
  ctx.moveTo(topRadius, 0);
  ctx.lineTo(width - topRadius, 0);
  
  // Top right curve
  ctx.arcTo(width, 0, width, topRadius, topRadius);
  
  // Right side going down
  ctx.lineTo(width, height * 0.75);
  
  // Bottom right curve to point
  ctx.quadraticCurveTo(width * 0.85, height * 0.88, width / 2, height);
  
  // Bottom left curve from point
  ctx.quadraticCurveTo(width * 0.15, height * 0.88, 0, height * 0.75);
  
  // Left side going up
  ctx.lineTo(0, topRadius);
  
  // Top left curve
  ctx.arcTo(0, 0, topRadius, 0, topRadius);
  
  ctx.closePath();
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

// Run the generator
createTemplates();
