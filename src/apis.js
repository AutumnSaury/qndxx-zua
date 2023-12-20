/**
 * @typedef Channel
 * @property {string} id
 * @property {string} name
 * @property {string} link
 */

import { getLessonHash, loadImage } from './utils'

/**
 * @template {*} T
 *
 * @typedef CyolResponse
 * @property {number} result
 * @property {string} msg
 * @property {T} obj
 */

/**
 * @typedef Lesson
 *
 * @property {string} id
 * @property {string} title
 * @property {string} focusImg
 * @property {number} users
 * @property {string} pubDate
 * @property {string} link
 * @property {null} content
 * @property {string} channelName
 * @property {{code: string, desc: string}} newsType
 * @property {boolean} study
 */

/**
 * @template {*} T
 *
 * @typedef CyolPaginatedData
 *
 * @prop {number} currPage
 * @prop {T[]} list
 * @prop {number} pageSize
 * @prop {number} totalPage
 */

/**
 * @typedef LessonResponse
 *
 * @property {Channel[]} channel
 * @property {CyolPaginatedData<Lesson>} news
 * @property {number} result
 */

/**
 * 获取课程列表
 * @param {number} pageSize
 * @returns {Promise<CyolPaginatedData<Lesson>>}
 */
export async function getLessonList (pageSize) {
  const response = await fetch(`/lessonlist?pageSize=${pageSize}`)

  /**
   * @type {CyolResponse<LessonResponse>}
   */
  const list = await response.json()

  return list.obj.news.list
}

/**
 * 登录
 * @param {string} name 姓名
 * @param {string} id 学号
 * @returns {Promise<boolean>}
 */
export async function authenticate (name, id) {
  try {
    const response = await fetch('/zqauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        xh: id,
        xm: name,
        xy: ''
      })
    })

    /**
     * @type {null | {status: number, info: string, errcode: number}}
     */
    const result = await response.json()

    if (result == null || result.status !== 1) {
      return false
    } else {
      return true
    }
  } catch {
    return false
  }
}

/**
 * 获取课程页面资产
 * @param {Lesson} lesson
 * @returns {Promise<{title: string, image: HTMLImageElement}>}
 */
export async function getLessonAssets (lesson) {
  const hash = getLessonHash(lesson)
  const index = await (await fetch(`/lessonroot/${hash}/index.html`)).text()
  const title = index.match(/(?<=<title>).+(?=<\/title>)/)[0]
  const image = await loadImage(`/lessonroot/${hash}/images/end.jpg`)

  return { title, image }
}
