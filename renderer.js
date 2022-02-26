// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const selectLogBtn = document.getElementById('select-log-button');
const timerListEle = document.getElementById('timer-list');

selectLogBtn.addEventListener('click', () => {
  window.fileStream.openFile();
});

window.fileStream.startTimer((_, data) => {
  const { type, target } = data;
  let time = data.time;
  const timerElement = document.createElement("div");
  const guid = Math.random().toString().slice(2,10);

  timerElement.classList.add('timer-box');
  timerElement.id = `timer-box-${guid}`;
  timerElement.innerHTML = `<div class="box-info">
                              <div class="box-header">
                                <h5>${type}</h5>
                                <h4>${target}</h4>
                              </div>
                              <div id="countdown-${guid}" class="countdown">${time}</div>
                            </div>
                            <div class="progress-box">
                              <div id="progress-bar-${guid}" class="progress-bar"></div>
                            </div>`;              
  timerListEle.appendChild(timerElement);

  const progressBar = document.getElementById(`progress-bar-${guid}`);
  const countDown = document.getElementById(`countdown-${guid}`);
  const incrementAmount = 100/time;

  let timer = setInterval(() => {
    if(time === 0) {
      clearInterval(timer);
    } else {
      time--;
      progressBar.style.width = `${time * incrementAmount}%`;
      countDown.innerHTML = time;
    }
  }, 1000);
});

window.fileStream.stopTimer((_, data) => {
  console.log('effect end:', data.type);
});
