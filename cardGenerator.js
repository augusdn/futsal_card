const { createCanvas, loadImage } = require('@napi-rs/canvas');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Card dimensions
const CARD_WIDTH = 1024;
const CARD_HEIGHT = 1024;

async function generateCard(cardData) {
  const { name, tier, position, country, overall, skill, manner, photoPath } = cardData;
  
  // Load the background and shield templates
  const backgroundPath = path.join(__dirname, 'templates', `${tier}_background.png`);
  const shieldPath = path.join(__dirname, 'templates', `${tier}_shield.png`);
  
  if (!fs.existsSync(backgroundPath)) {
    throw new Error(`Background template not found for tier: ${tier}`);
  }
  if (!fs.existsSync(shieldPath)) {
    throw new Error(`Shield template not found for tier: ${tier}`);
  }

  const backgroundImage = await loadImage(backgroundPath);
  const shieldImage = await loadImage(shieldPath);
  
  // Create canvas
  const canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT);
  const ctx = canvas.getContext('2d');

  // Draw background layer
  ctx.drawImage(backgroundImage, 0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Load and draw player photo with cyan glow (as second layer)
  try {
    const playerImage = await loadImage(photoPath);
    
    // Photo dimensions and position (center, with cyan outline)
    const photoWidth = 676;
    const photoHeight = 676;
    const photoX = (CARD_WIDTH - photoWidth) / 2;
    const photoY = 77;
    
    // Draw cyan glow outline
    ctx.save();
    ctx.strokeStyle = '#00D9FF';
    ctx.lineWidth = 12;
    ctx.shadowColor = '#00D9FF';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(photoX + photoWidth / 2, photoY + photoHeight / 2, photoWidth / 2 + 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    
    // Clip to circle for photo
    ctx.save();
    ctx.beginPath();
    ctx.arc(photoX + photoWidth / 2, photoY + photoHeight / 2, photoWidth / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    
    // Draw photo
    ctx.drawImage(playerImage, photoX, photoY, photoWidth, photoHeight);
    ctx.restore();

  } catch (error) {
    console.error('Error loading player photo:', error);
    // Draw placeholder circle
    ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
    ctx.beginPath();
    ctx.arc(CARD_WIDTH / 2, 415, 338, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw overall rating (top-left)
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  ctx.font = 'bold 126px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(overall, 295, 246);

  // Draw position (below rating)
  ctx.font = 'bold 42px Arial';
  // ctx.fillText(position.toUpperCase(), 275, 365);
  ctx.fillText(position.toUpperCase(), 295, 290);
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Country flag (top-right)
  const flagX = CARD_WIDTH - 354;
  const flagY = 165;
  const flagWidth = 110;
  const flagHeight = 75;
  
  // Load and draw country flag from flagcdn.com
  try {
    const flagUrl = `https://flagcdn.com/w80/${country.toLowerCase()}.png`;
    const flagImage = await loadImage(flagUrl);
    ctx.drawImage(flagImage, flagX, flagY, flagWidth, flagHeight);
  } catch (error) {
    console.error('Error loading flag:', error);
    // Fallback: draw placeholder with country code
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(flagX, flagY, flagWidth, flagHeight);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 35px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(country.toUpperCase(), flagX + flagWidth / 2, flagY + flagHeight / 2 + 12);
  }

  // Draw shield layer on top as final overlay
  ctx.drawImage(shieldImage, 0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Draw stats on top of shield
  const statsY = 786;
  
  // Skill score (left side)
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 8;
  ctx.font = 'bold 83px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(skill, 271, statsY);

  // Manner score (right side)
  ctx.fillText(manner, CARD_WIDTH - 271, statsY);
  ctx.shadowBlur = 0;

  // Draw player name on top of shield
  const nameY = 863;
  
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 10;
  ctx.font = 'bold 54px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(name, CARD_WIDTH / 2, nameY);
  ctx.shadowBlur = 0;

  // Save to file with clean filename
  const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '_');
  const timestamp = Date.now();
  const filename = `${timestamp}_${sanitizedName}.png`;
  const outputPath = path.join(__dirname, 'output', filename);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);

  return outputPath;
}

module.exports = { generateCard };
