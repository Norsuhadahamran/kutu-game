const participants = [
  "JAMILAH 1",
  "JAMILAH 2",
  "FATIN 1",
  "FATIN 2",
  "AZURA",
  "INTAN",
  "DIYANA",
  "ATIKAH",
  "MAULANA",
  "KIKI 1",
  "KIKI 2",
  "LENNI 1",
  "LENNI 2"
];

let dates = [
  "31 May",
  "15 June",
  "30 June",
  "15 July",
  "31 July",
  "15 August",
  "31 August",
  "15 September",
  "30 September",
  "15 October",
  "31 October",
  "15 November",
  "30 November"
];

let remainingDates = shuffle([...dates]);
let selectedPlayers = [];
let results = [];
let spinning = false;
let angle = 0;

const nameInput = document.getElementById("nameInput");
const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");

const colors = [
  "#ff6384", "#36a2eb", "#ffce56", "#4bc0c0",
  "#9966ff", "#ff9f40", "#f06595", "#20c997",
  "#845ef7", "#51cf66", "#ffd43b", "#74c0fc", "#fa5252"
];

function loadDropdown() {
  participants.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    nameInput.appendChild(option);
  });
}

function drawWheel() {
  const slice = (2 * Math.PI) / dates.length;
  const center = wheel.width / 2;
  const radius = 170;

  ctx.clearRect(0, 0, wheel.width, wheel.height);

  dates.forEach((date, i) => {
    const start = angle + i * slice;
    const end = start + slice;

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, start, end);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(start + slice / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "bold 13px Arial";
    ctx.fillText(date, radius - 10, 5);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(center, center, 35, 0, 2 * Math.PI);
  ctx.fillStyle = "#d63384";
  ctx.fill();

  ctx.fillStyle = "white";
  ctx.font = "bold 15px Arial";
  ctx.textAlign = "center";
  ctx.fillText("KUTU", center, center + 5);
}

function cabutUndian() {
  const playerName = nameInput.value;
  const winnerBox = document.getElementById("winnerBox");
  const winnerName = document.getElementById("winnerName");
  const winnerDate = document.getElementById("winnerDate");
  const loading = document.getElementById("loading");
  const suspenseText = document.getElementById("suspenseText");
  const drawBtn = document.getElementById("drawBtn");

  if (playerName === "") {
    alert("Sila pilih nama dahulu.");
    return;
  }

  if (selectedPlayers.includes(playerName)) {
    alert("Nama ini sudah cabut undian.");
    return;
  }

  if (remainingDates.length === 0) {
    alert("Semua tarikh sudah habis.");
    return;
  }

  spinning = true;
  drawBtn.disabled = true;
  winnerBox.classList.add("hidden");
  loading.classList.remove("hidden");

  const spinSound = document.getElementById("spinSound");
  spinSound.currentTime = 0;
  spinSound.play();

  let suspenseInterval = setInterval(() => {
    const randomDate = remainingDates[Math.floor(Math.random() * remainingDates.length)];
    suspenseText.textContent = "📅 " + randomDate;
  }, 150);

  const randomSpin = Math.random() * 360 + 1800;
  const duration = 4000;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);

    angle = (randomSpin * easeOut * Math.PI) / 180;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      clearInterval(suspenseInterval);

      const randomIndex = Math.floor(Math.random() * remainingDates.length);
      const selectedDate = remainingDates[randomIndex];

      remainingDates.splice(randomIndex, 1);
      selectedPlayers.push(playerName);

      results.push({
        name: playerName,
        date: selectedDate
      });

      loading.classList.add("hidden");
      winnerName.textContent = playerName;
      winnerDate.textContent = "📅 " + selectedDate;
      winnerBox.classList.remove("hidden");

      playWinnerSound();
      createConfetti();
      updateResultList();
      updateDropdown();

      nameInput.selectedIndex = 0;
      spinning = false;
      drawBtn.disabled = false;
    }
  }

  requestAnimationFrame(animate);
}

function playWinnerSound() {
  const winSound = document.getElementById("winSound");
  const clapSound = document.getElementById("clapSound");
  const crowdSound = document.getElementById("crowdSound");

  winSound.currentTime = 0;
  clapSound.currentTime = 0;
  crowdSound.currentTime = 0;

  winSound.play();

  setTimeout(() => {
    clapSound.play();
  }, 500);

  setTimeout(() => {
    crowdSound.play();
  }, 800);
}

function updateResultList() {
  const resultList = document.getElementById("resultList");
  resultList.innerHTML = "";

  results.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${item.name} → ${item.date}`;
    resultList.appendChild(li);
  });
}

function updateDropdown() {
  for (let i = 0; i < nameInput.options.length; i++) {
    const option = nameInput.options[i];

    if (selectedPlayers.includes(option.value)) {
      option.disabled = true;
      option.textContent = option.value + " ✅ SUDAH CABUT";
    }
  }
}

function createConfetti() {
  const confetti = document.getElementById("confetti");
  confetti.innerHTML = "";

  for (let i = 0; i < 80; i++) {
    const span = document.createElement("span");
    span.style.left = Math.random() * 100 + "vw";
    span.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    span.style.animationDuration = Math.random() * 2 + 2 + "s";
    span.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.appendChild(span);

    setTimeout(() => {
      span.remove();
    }, 3500);
  }
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

loadDropdown();
drawWheel();