// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const selectLogBtn = document.getElementById('select-log-button')
const selectClass = document.getElementById('class-select')
const timerListEle = document.getElementById('timer-list')

selectLogBtn.addEventListener('click', () => {
  window.fileStream.openFile()
})

selectClass.addEventListener('change', (e) => {
  console.log(e.target.value)
})

window.fileStream.startTimer((_, data) => {
  const { type, target, time, icon } = data
  const guid = Math.random().toString().slice(2, 10)
  addTimerElement(guid, type, target, time, icon)
  startNewTimer(guid, time)
  addCloseListener(guid)
})

function addCloseListener (guid) {
  const closeButton = document.getElementById(`close-${guid}`)
  closeButton.addEventListener('click', (e) => {
    const timer = document.getElementById(`timer-box-${guid}`)
    timer.remove()
  })
}

function addTimerElement (guid, type, target, time, icon) {
  const timerElement = document.createElement('div')
  timerElement.classList.add('timer-box')
  timerElement.classList.add('list-group-item')
  timerElement.id = `timer-box-${guid}`
  timerElement.innerHTML = `<div class="box-info">  
                              <div id="close-${guid}">X</div>
                              <div class="spell ${icon}"></div>
                              <div class="box-header">
                                <h5>${type}</h5>
                                <h4>${target}</h4>
                              </div>
                              <div id="countdown-${guid}" class="countdown">${getTimeString(time)}</div>
                            </div>
                            <div class="progress-box">
                              <div id="progress-bar-${guid}" class="progress-bar"></div>
                            </div>`
  timerListEle.appendChild(timerElement)
}

function startNewTimer (guid, time) {
  const progressBar = document.getElementById(`progress-bar-${guid}`)
  const countDown = document.getElementById(`countdown-${guid}`)
  const incrementAmount = 100 / time

  const timer = setInterval(() => {
    time--
    if (time === 0) {
      clearInterval(timer)
      removeTimerElement(guid)
    } else {
      if (time > 5 && (time * incrementAmount <= 55)) {
        progressBar.classList.add('warning')
        countDown.classList.add('warning')
      }
      if (time <= 5) {
        progressBar.classList.add('panic')
        countDown.classList.add('panic')
      }

      progressBar.style.width = `${time * incrementAmount}%`

      countDown.innerHTML = getTimeString(time)
    }
  }, 1000)
}

function getTimeString (time) {
  let timeString = ''
  if (time >= 3600) {
    timeString += `${Math.floor(time / 3600)}:`
    time -= 3600
  }
  if (time >= 60) {
    timeString += (timeString !== '' && Math.floor(time / 60) < 10) ? '0' : ''
    timeString += `${Math.floor(time / 60)}:`
  }
  const seconds = time % 60
  if (seconds < 10) {
    timeString += '0'
  }
  timeString += seconds
  return timeString
}

function removeTimerElement (guid) {
  const timer = document.getElementById(`timer-box-${guid}`)
  timer?.remove()
}
