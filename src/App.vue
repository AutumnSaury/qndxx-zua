<template>
  <button id="scroll-btn" ref="scrollBtn" @click.prevent="handleScroll">
    ↑
  </button>
  <div id="preview-container" ref="previewContainer">
    <canvas id="preview" ref="preview" width="1080" height="2160"></canvas>
  </div>
  <fieldset id="control" ref="control">
    <div id="title">
      设置
    </div>
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
      <button @click.prevent="submitInfo(name, id)">
        提交信息
      </button>
    </fieldset>
    <fieldset class="section">
      <legend>导出设置</legend>
      <div class="pair">
        <label for="filename">青年大学习截图文件名</label>
        <input id="filename" v-model="fileName" type="text" :placeholder="`${id}${name}.jpg`">
      </div>
      <div class="pair">
        <label>用于生成的青年大学习视频</label>
        <select v-model="selectedLesson">
          <option
            v-for="(value, index) in lessonList"
            :value="value"
            :key="index"
          >
            {{ value.title }}
          </option>
        </select>
      </div>
      <div class="pair">
        <label for="episode">机型预设</label>
        <select v-model="selectedPreset">
          <option
            v-for="(value, index) in presets"
            :value="value"
            :key="index"
          >
            {{ value.name }}
          </option>
        </select>
      </div>
      <div id="export-action">
        <button @click.prevent="handleDownload">
          下载文件
        </button>
        <button @click.prevent="handleRender">
          生成预览
        </button>
      </div>
    </fieldset>
  </fieldset>
  <div id="top-ellipse"></div>
  <div id="bottom-ellipse"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { authenticate, getLessonList, getLessonAssets } from './apis'
import './assets/check-mark.svg'
import './assets/empty.svg'
import { PreviewDrawer } from './drawer'
import { presets } from './presets'
import { saveAs } from './utils'

/**
 * 预览canvas
 * @type {import('vue').Ref<HTMLCanvasElement>}
 */
const preview = ref(null)
// 姓名
const name = ref('')
// 学号
const id = ref('')
// 青年大学习结束截图文件名
const fileName = ref('')
/**
 * 青年大学习列表
 * @type {import('vue').Ref<import('./apis').Lesson[]>}
 */
const lessonList = ref([])
/**
 * 当前选择的青年大学习课程
 * @type {import('vue').Ref<import('./apis').Lesson | null>}
 */
const selectedLesson = ref(null)
/**
 * 当前选择的机型预设
 * @type {import('vue').Ref<import('./drawer').PhonePreset | null>}
 */
const selectedPreset = ref(null)
// 渲染器
const drawer = new PreviewDrawer()

async function handleRender () {
  const { image, title } = await getLessonAssets(selectedLesson.value)
  // 8-12 minutes after now
  const randTime = new Date(Date.now() + 480000 + Math.floor(Math.random() * 240001))
  await drawer.draw(title, randTime, image)
}

async function handleDownload () {
  await submitInfo(name.value, id.value)
  await handleRender()
  saveAs(drawer.getDataUrl('image/jpeg'), fileName.value || `${id.value}${name.value}.jpg`)
}

async function submitInfo (name, id) {
  const result = await authenticate(name, id)
  if (!result) {
    alert('提交失败，请检查已填写的个人信息')
  } else {
    alert('提交成功')
  }
}

const previewContainer = ref(null)
const control = ref(null)
const scrollBtn = ref(null)
let notInViewport

function onLeave (el, callback) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback()
      }
    })
  })
  observer.observe(el)
}

function handleScroll () {
  notInViewport.scrollIntoView({ behavior: 'smooth' })
}

function handleScrollBtnTurnOver (deg) {
  scrollBtn.value.style.rotate = deg
}

watch(selectedPreset, (preset) => {
  drawer.loadPreset(preset)
})

onMounted(async () => {
  notInViewport = control.value
  onLeave(previewContainer.value, () => {
    handleScrollBtnTurnOver('180deg')
    notInViewport = control.value
  })
  onLeave(control.value, () => {
    handleScrollBtnTurnOver('0deg')
    notInViewport = previewContainer.value
  })

  lessonList.value = await getLessonList(30)
  selectedLesson.value = lessonList.value[0]
  selectedPreset.value = presets[0]
  drawer.bindCanvas(preview.value)
})
</script>

<style lang="less">

* {
  transition: 0.5s;
}

// 高宽高比，PC
@media (min-aspect-ratio: 4/3) {
  #app {
    justify-content: space-around;
    width: 80vw;
  }

  #preview-container {
    height: 90vh;
    width: calc(90vh * (39 / 74));
    margin: 5vh auto;

    #preview {
      height: 90%;
      width: 90%;
    }
  }

  #control {
    height: 70vh;
    width: 30vw;
    min-width: 400px;
    margin: auto;
  }

  #scroll-btn {
    display: none;
  }
}

// 低宽高比，手机
@media (max-aspect-ratio: 4/3) {
  #app {
    flex-direction: column;
    justify-content: center;
    width: 100vw;
  }

  #preview-container {
    height: 90vh;
    width: calc(90vh * (39 / 74));
    margin: 5vh auto;

    #preview {
      height: 90%;
      width: 90%;
    }
  }

  #control {
    width: 90vw;
    margin: 5vh auto;
  }

  #scroll-btn {
    position: fixed;
    bottom: 10vh;
    right: 4vw;
    width: 3em;
    height: 3em;
    border-radius: 50%;
    border: none;
    background-color: #a1c4fd;
    color: #fff;
    font-weight: bolder;
    font-size: 24px;
  }
}

#app {
  overflow: auto;
  display: flex;
  flex-wrap: nowrap;
  margin: auto;
  align-items: center;

  &::before {
    content: "";
    z-index: -2;
    width: 100vw;
    height: 100vw;
    position: absolute;
    top: -50vw;
    border-radius: 50%;
    background: rgba(220, 255, 255, 0.3);
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
}

#preview-container {
  // height: 74vmin;
  // width: 39vmin;
  display: flex;
  border-radius: 25px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.14),
    0px 1px 10px 0px rgba(0, 0, 0, 0.12), 0px 2px 4px -1px rgba(0, 0, 0, 0.2);
  background: white url("./assets/empty.svg") center center no-repeat;
  background-size: 20%;

  #preview {
    margin: auto;
    border-radius: 5px;
  }
}

#frame {
  opacity: 0;
  position: absolute;
  transform: scale(0);
  // TODO: 适配不同设备的长宽比
  // 这个是Mate10Pro在微信自带浏览器上的视口大小
  height: 786px;
  width: 432px;
}

#control {
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border-style: none;
  border-radius: 25px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.14),
    0px 1px 10px 0px rgba(0, 0, 0, 0.12), 0px 2px 4px -1px rgba(0, 0, 0, 0.2);
  background-color: white;
  // padding: 1vmax 2vmax 2vmax;

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
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1),
      0px 1px 2px 0px rgba(0, 0, 0, 0.06);

    legend {
      position: relative;
      padding: 0 20px;
      font: bold 24px sans-serif;
      color: #a1c4fd;
    }

    .pair {
      margin: 10px auto;
      width: calc(100% - 20px);
      display: flex;
      justify-content: space-between;
      align-items: center;

      label {
        font-size: 14px;
      }

      input {
        width: 40%;
        font-size: 12px;
        border-radius: 5px;
        border: #a1c4fd solid 2px;
        padding: 4px 8px;
        text-align: right;
        transition: box-shadow 0.5s;
        &:focus {
          outline: none;
          box-shadow: 0px 8px 17px 2px rgba(92, 164, 255, 0.14), 0px 3px 14px 2px rgba(121, 227, 255, 0.12), 0px 5px 5px -3px rgba(61, 196, 255, 0.2);
        }
      }

      select {
        width: 40%;
        font-size: 12px;
        border-radius: 5px;
        border: #a1c4fd solid 2px;
        padding: 4px 8px;
        text-align: right;
        transition: box-shadow 0.5s;
        &:focus {
          outline: none;
          box-shadow: 0px 8px 17px 2px rgba(92, 164, 255, 0.14), 0px 3px 14px 2px rgba(121, 227, 255, 0.12), 0px 5px 5px -3px rgba(61, 196, 255, 0.2);
        }
      }
    }

    button {
      margin: 10px auto 0;
      padding: 5px 10px;
      width: auto;
      min-width: 20%;
      height: 2.5em;
      background-color: #a1c4fd;
      border-style: none;
      border-radius: 5px;
      color: white;
    }
  }

  #switch {
    flex-direction: row;
    justify-content: space-around;

    input[type="radio"] {
      display: none;
    }

    label {
      line-height: 3em;
      text-align: center;
      font-size: 2em;
      font-weight: bold;
      color: white;
      height: 3em;
      width: 45%;
      background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
      border-radius: 15px;
    }

    .selected {
      background-image: url("./assets/check-mark.svg"),
      linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
      background-repeat: no-repeat;
      background-position: 110% 110%;
    }
  }
}

#export-action {
  width: 100%;
  margin: auto;
  display: flex;
  justify-content: space-around;
}

button {
  cursor: pointer;
}
</style>
