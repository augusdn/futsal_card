// Client-side card generator using HTML5 Canvas
const CARD_WIDTH = 1024;
const CARD_HEIGHT = 1024;

// Load countries on page load
document.addEventListener('DOMContentLoaded', async () => {
  await loadCountries();
});

// Load country dropdown
async function loadCountries() {
  try {
    const response = await fetch('https://flagcdn.com/en/codes.json');
    const countries = await response.json();
    
    const countrySelect = document.getElementById('country');
    const sortedCountries = Object.entries(countries).sort((a, b) => 
      a[1].localeCompare(b[1])
    );
    
    sortedCountries.forEach(([code, name]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = name;
      countrySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading countries:', error);
  }
}

// Handle form submission
document.getElementById('cardForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value.toUpperCase(),
    tier: document.getElementById('tier').value,
    position: document.getElementById('position').value.toUpperCase(),
    country: document.getElementById('country').value,
    overall: parseInt(document.getElementById('overall').value),
    skill: parseInt(document.getElementById('skill').value),
    manner: parseInt(document.getElementById('manner').value),
    photoFile: document.getElementById('photo').files[0]
  };

  if (!formData.photoFile) {
    alert('Please select a photo');
    return;
  }

  // Show loading state
  document.getElementById('loading').style.display = 'block';
  document.getElementById('placeholder').style.display = 'none';
  document.getElementById('preview').classList.remove('show');
  document.getElementById('downloadBtn').classList.remove('show');
  document.getElementById('generateBtn').disabled = true;

  try {
    await generateCard(formData);
  } catch (error) {
    console.error('Error generating card:', error);
    alert('Failed to generate card. Please try again.');
    document.getElementById('loading').style.display = 'none';
    document.getElementById('placeholder').style.display = 'flex';
  } finally {
    document.getElementById('generateBtn').disabled = false;
  }
});

// Generate card using HTML5 Canvas
async function generateCard(data) {
  const canvas = document.getElementById('preview');
  const ctx = canvas.getContext('2d');

  // Clear canvas
  ctx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Load all images
  const [backgroundImg, shieldImg, playerImg, flagImg] = await Promise.all([
    loadImage(`templates/${data.tier}_background.png`),
    loadImage(`templates/${data.tier}_shield.png`),
    loadImageFromFile(data.photoFile),
    loadImage(`https://flagcdn.com/w80/${data.country.toLowerCase()}.png`).catch(() => null)
  ]);

  // Draw background layer
  ctx.drawImage(backgroundImg, 0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Draw player photo with cyan glow
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

  // Draw photo (centered and cropped)
  const scale = Math.max(photoWidth / playerImg.width, photoHeight / playerImg.height);
  const scaledWidth = playerImg.width * scale;
  const scaledHeight = playerImg.height * scale;
  const cropX = photoX - (scaledWidth - photoWidth) / 2;
  const cropY = photoY - (scaledHeight - photoHeight) / 2;
  
  ctx.drawImage(playerImg, cropX, cropY, scaledWidth, scaledHeight);
  ctx.restore();

  // Draw overall rating (top-left)
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  ctx.font = 'bold 126px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(data.overall, 295, 246);

  // Draw position (below rating)
  ctx.font = 'bold 42px Arial';
  ctx.fillText(data.position, 295, 290);
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Country flag (top-right)
  if (flagImg) {
    const flagX = CARD_WIDTH - 354;
    const flagY = 165;
    const flagWidth = 110;
    const flagHeight = 75;
    ctx.drawImage(flagImg, flagX, flagY, flagWidth, flagHeight);
  }

  // Draw shield layer on top
  ctx.drawImage(shieldImg, 0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Draw stats on top of shield
  const statsY = 786;
  
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 8;
  ctx.font = 'bold 83px Arial';
  ctx.textAlign = 'center';
  
  // Skill score (left)
  ctx.fillText(data.skill, 271, statsY);
  
  // Manner score (right)
  ctx.fillText(data.manner, CARD_WIDTH - 271, statsY);
  ctx.shadowBlur = 0;

  // Draw player name on top of shield
  const nameY = 863;
  
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 10;
  ctx.font = 'bold 54px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(data.name, CARD_WIDTH / 2, nameY);
  ctx.shadowBlur = 0;

  // Show preview and download button
  document.getElementById('loading').style.display = 'none';
  document.getElementById('preview').classList.add('show');
  document.getElementById('downloadBtn').classList.add('show');
}

// Load image from URL
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Load image from file input
function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Download card
document.getElementById('downloadBtn').addEventListener('click', () => {
  const canvas = document.getElementById('preview');
  const name = document.getElementById('name').value.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${name}_card.png`;
  
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
});
