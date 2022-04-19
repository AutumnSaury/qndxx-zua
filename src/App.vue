<script setup>
import html2canvas from 'html2canvas'
import { ref } from 'vue'
import statusBarImg from './assets/statusBar.png'
import api from './api/api.js'

const zhqnLoaded = ref(false)
const preview = ref(null)
const frame = ref(null)
const name = ref('foobar')
const id = ref(1234567890)
let zhqn

async function renderZhqn () {
  if (!zhqnLoaded.value) {
    alert('未加载完成')
    return
  }
  const bg = frame.value.contentDocument.getElementsByClassName('bg')[0] || frame.value.contentDocument.getElementsByClassName('bgalt')[0]
  const phArr = Array.from(frame.value.contentDocument.getElementsByClassName('input-placeholder'))
  // Change bg's style
  bg.className = 'bgalt'
  bg.style.background = 'linear-gradient(261deg, hsla(0, 0%, 63.9%, .09), hsla(0, 0%, 63.9%, .09) 33.3%, hsla(0, 0%, 39.2%, .09) 0, hsla(0, 0%, 39.2%, .09) 66.6%, hsla(0, 0%, 63.5%, .09) 0, hsla(0, 0%, 63.5%, .09) 99%),linear-gradient(107deg, hsla(0, 0%, 75.7%, .06), hsla(0, 0%, 75.7%, .06) 33.3%, hsla(0, 0%, 66.3%, .06) 0, hsla(0, 0%, 66.3%, .06) 66.6%, rgba(92, 92, 92, .06) 0, rgba(92, 92, 92, .06) 99%),linear-gradient(338deg, rgba(45, 45, 45, .03), rgba(45, 45, 45, .03) 33.3%, hsla(0, 0%, 87.5%, .03) 0, hsla(0, 0%, 87.5%, .03) 66.6%, hsla(0, 0%, 67.8%, .03) 0, hsla(0, 0%, 67.8%, .03) 99%),linear-gradient(129deg, hsla(0, 0%, 88.6%, .06), hsla(0, 0%, 88.6%, .06) 33.3%, rgba(81, 81, 81, .06) 0, rgba(81, 81, 81, .06) 66.6%, hsla(0, 0%, 72.9%, .06) 0, hsla(0, 0%, 72.9%, .06) 99%),linear-gradient(294deg, hsla(0, 0%, 88.2%, .04), hsla(0, 0%, 88.2%, .04) 33.3%, rgba(95, 95, 95, .04) 0, rgba(95, 95, 95, .04) 66.6%, rgba(39, 39, 39, .04) 0, rgba(39, 39, 39, .04) 99%),linear-gradient(337deg, hsla(0, 0%, 72.2%, .06), hsla(0, 0%, 72.2%, .06) 33.3%, rgba(0, 0, 0, .06) 0, rgba(0, 0, 0, .06) 66.6%, hsla(0, 0%, 54.9%, .06) 0, hsla(0, 0%, 54.9%, .06) 99.9%),linear-gradient(172deg, rgba(40, 40, 40, .07), rgba(40, 40, 40, .07) 33.3%, hsla(0, 0%, 83.9%, .07) 0, hsla(0, 0%, 83.9%, .07) 66.6%, hsla(0, 0%, 74.5%, .07) 0, hsla(0, 0%, 74.5%, .07) 99.9%),linear-gradient(270deg, hsla(0, 0%, 90.2%, 0), hsla(0, 0%, 90.2%, 0) 33.3%, hsla(0, 0%, 94.5%, 0) 0, hsla(0, 0%, 94.5%, 0) 66.6%, rgba(55, 55, 55, 0) 0, rgba(55, 55, 55, 0) 99%),linear-gradient(209deg, #2672e3, #0befc9)'
  bg.style.height = '100vh'
  // Make place-holders look like real input
  phArr.forEach(item => { item.style.color = 'black' })
  // Fill place-holders with given information
  phArr[0].textContent = name.value
  phArr[1].textContent = id.value.toString()
  // Render the page into canvas
  zhqn = await html2canvas(frame.value.contentWindow.document.getElementsByTagName('uni-app')[0], { scale: 2.5 })
  await drawPreview(zhqn, '中午11:51', '郑航青年大学习')
  api.authenticate(name.value, id.value)
  // saveAs(preview.value.toDataURL('image/jpeg'), `${id}${name}(1).jpg`)
}

async function renderCyol () {
  const lessonID = await api.getLatestLessonID()
  const title = await api.getTitle(lessonID)
  const end = await loadImage(`/lessonroot/${lessonID}/images/end.jpg`)
  await drawPreview(end, '中午12:05', title)
  // saveAs(preview.value.toDataURL('image/jpeg'), `${id}${name}(2).jpg`)
}

async function renderStatusBar (height, width, templateUrl, title, time) {
  const bar = document.createElement('canvas')
  bar.height = height
  bar.width = width
  const drawBar = bar.getContext('2d')
  const bg = await loadImage(templateUrl)
  // Place template
  drawBar.drawImage(bg, 0, 0)
  // Draw title
  drawBar.font = '4.5em sans serif'
  drawBar.textAlign = 'center'
  drawBar.textBaseline = 'middle'
  drawBar.fillText(title, 538, 135)
  // Draw time
  drawBar.font = '3.2em sans serif'
  drawBar.fillStyle = '#5f5f5f'
  drawBar.fillText(time, 970, 40)
  return bar
}

function loadImage (url) {
  return new Promise(resolve => {
    const image = new Image()
    image.src = url
    image.onload = () => resolve(image)
  })
}

async function drawPreview (content, time, title, top = statusBarImg) {
  const draw = preview.value.getContext('2d')
  const statusBar = await renderStatusBar(195, 1080, statusBarImg, title, time)
  draw.drawImage(content, 0, 195, 1080, 1965)
  statusBar.src = top
  draw.drawImage(statusBar, 0, 0, 1080, 195)
}

function saveAs (url, fileName) {
  const dllink = document.createElement('a')
  dllink.href = url
  dllink.download = fileName
  dllink.click()
  dllink.remove()
}

</script>

<template>
  <iframe
    id="frame"
    ref="frame"
    src="/zhqn"
    frameborder="0"
    @load="zhqnLoaded = true"
  />
  <canvas
    id="preview"
    ref="preview"
    width="1080"
    height="2160"
  />
  <div id="control">
    <input
      v-model="name"
      type="text"
    >
    <input
      v-model="id"
      type="number"
    >
    <button @click="renderZhqn">
      郑航青年
    </button>
    <button @click="renderCyol">
      中青在线
    </button>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
}

#control {
  width: 30vw;
  height: auto;
  display: flex;
  flex-direction: column;
}

#frame {
  z-index: -10;
  opacity: 0;
  position: absolute;
  /* transform: scale(0); */
  height: 864px;
  width: 432px;
}

#preview {
  height: 80vh;
  width: 40vh;
}
</style>
