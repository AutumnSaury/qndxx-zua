<script setup>
import html2canvas from 'html2canvas'
import { ref, watch } from 'vue'
import statusBarImg from './assets/statusBar.png'
import api from './api/api.js'
import './assets/check-mark.svg'

const zhqnLoaded = ref(false)
const preview = ref(null)
const frame = ref(null)
const name = ref('')
const id = ref('')
const zhqnSelected = ref(null)
const fileName1 = ref('')
const fileName2 = ref('')
let zhqn

async function renderZhqn () {
  if (!zhqnLoaded.value) {
    alert('未加载完成')
    zhqnSelected.value = null
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
  zhqn = await html2canvas(frame.value.contentDocument.getElementsByTagName('uni-app')[0], { scale: 2.5 })
  await drawPreview(zhqn, '中午11:51', '郑航青年大学习')
}

async function renderCyol () {
  const lessonID = await api.getLatestLessonID()
  const title = await api.getTitle(lessonID)
  const end = await loadImage(`/lessonroot/${lessonID}/images/end.jpg`)
  await drawPreview(end, '中午12:05', title)
}

async function download () {
  await renderZhqn()
  saveAs(preview.value.toDataURL('image/jpeg'), fileName1.value || `${id.value}${name.value}(1).jpg`)
  await renderCyol()
  saveAs(preview.value.toDataURL('image/jpeg'), fileName2.value || `${id.value}${name.value}(2).jpg`)
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

watch(zhqnSelected, nv => {
  if (nv) {
    renderZhqn()
  } else if (nv === false) {
    renderCyol()
  }
})
</script>

<template>
  <iframe
    id="frame"
    ref="frame"
    src="/zhqn"
    frameborder="0"
    @load="zhqnLoaded = true"
  />
  <div id="border">
    <canvas id="preview" ref="preview" width="1080" height="2160" />
  </div>
  <fieldset id="control">
    <div id="title">
      设置
    </div>
    <fieldset id="switcher" class="section">
      <legend>预览切换</legend>
      <input
        id="zhqn"
        v-model="zhqnSelected"
        class="radio"
        :value="true"
        type="radio"
        name="prev"
      >
      <label for="zhqn" :class="{selected: zhqnSelected}">郑航青年</label>
      <input
        id="cyol"
        v-model="zhqnSelected"
        class="radio"
        :value="false"
        type="radio"
        name="prev"
      >
      <label for="cyol" :class="{selected: zhqnSelected === false}">青年大学习</label>
    </fieldset>
    <fieldset class="section">
      <legend>个人信息</legend>
      <div class="pair">
        <label for="name">姓名</label>
        <input id="name" v-model="name" type="text" placeholder="请输入姓名">
      </div>
      <div class="pair">
        <label for="id">学号</label>
        <input id="id" v-model.number="id" type="text" placeholder="请输入学号">
      </div>
      <button @click.prevent="api.authenticate(name, id)">
        提交信息
      </button>
    </fieldset>
    <fieldset class="section">
      <legend>导出设置</legend>
      <div class="pair">
        <label for="filename1">郑航青年截图文件名</label>
        <input id="filename1" v-model="fileName1" type="text" :placeholder="`${id}${name}(1).jpg`">
      </div>
      <div class="pair">
        <label for="filename2">青年大学习截图文件名</label>
        <input id="filename2" v-model="fileName2" type="text" :placeholder="`${id}${name}(2).jpg`">
      </div>
      <button @click.prevent="download">
        下载文件
      </button>
    </fieldset>
  </fieldset>
  <div id="top-ellipse" />
  <div id="bottom-ellipse" />
</template>

<style>
#app {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-around;
  margin: auto;
  width: 80vw;
}

#top-ellipse {
  z-index: -1;
  width: 50vw;
  height: 50vw;
  position: absolute;
  top: -25vw;
  border-radius: 50%;
  background-image: linear-gradient(to top, #48c6ef 0%, #6f86d6 100%);
}

#app::before {
  content: '';
  z-index: -2;
  width: 100vw;
  height: 100vw;
  position: absolute;
  top: -50vw;
  border-radius: 50%;
  background: rgba(220, 255, 255, 0.3);
}

#border {
  height: 74vh;
  width: 39vh;
  display: flex;
  border-radius: 25px;
  background-color: white;
  box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.14) , 0px 1px 10px 0px rgba(0,0,0,0.12) , 0px 2px 4px -1px rgba(0,0,0,0.2);
}

#frame {
  opacity: 0;
  position: absolute;
  transform: scale(0);
  height: 786px;
  width: 432px;
}

#preview {
  height: 70vh;
  width: 35vh;
  margin: auto;
  border-radius: 12.5px;
  box-shadow: 0px 4px 6px -1px rgba(0,0,0,0.1) , 0px 2px 4px -1px rgba(0,0,0,0.06);
}

#control {
  width: 30vw;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  /* text-align: center; */
  border-style: none;
  border-radius: 25px;
  box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.14) , 0px 1px 10px 0px rgba(0,0,0,0.12) , 0px 2px 4px -1px rgba(0,0,0,0.2);
  background-color: white;
  padding: 1vmax 2vmax 2vmax;
}

#title {
  font: bold 48px sans-serif;
  color: #a1c4fd;
}

.section {
  border-radius: 25px;
  margin: 10px 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-style: solid none none solid;
  border-color: #a1c4fd;
  border-radius: 25px;
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1) , 0px 1px 2px 0px rgba(0,0,0,0.06);
}

#switcher {
  flex-direction: row;
  justify-content: space-around;
}

.radio {
  display: none;
}

#switcher label {
  line-height: 8vh;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  height: 8vh;
  width: 45%;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  border-radius: 15px;
}

#switcher .selected {
  background-image: url('./assets/check-mark.svg'), linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  background-repeat: no-repeat;
  background-position: 110% 110%;
}

/* #switcher legend {
  color: white;
  text-shadow: 0px 2px 0px rgba(0,0,0,0.14) , 0px 3px -2px rgba(0,0,0,0.12) , 0px 1px 0px rgba(0,0,0,0.2);
} */

.section legend {
  position: relative;
  padding: 0 20px;
  font: bold 24px sans-serif;
  color: #a1c4fd;;
}

.pair {
  margin: 10px auto;
  width: calc(100% - 20px);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pair label {
  font-size: 14px;
}

.pair input {
  width: 40%;
  font-size: 14px;
  border-radius: 5px;
  border: #a1c4fd solid 2px;
  padding: 2px 8px;
  text-align: right;
}

button {
  margin: 10px auto 0;
  width: 20%;
  height: 3vh;
  background-color: #a1c4fd;
  border-style: none;
  border-radius: 5px;
  color: white;
}
</style>
