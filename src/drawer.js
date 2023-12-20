/**
 * @typedef {Object} Coordinate
 *
 * @prop {number} x
 * @prop {number} y
 */

import { loadImage } from './utils'

/**
 * @typedef {Object} StatusBarPreset
 *
 * @prop {string} imageUrl
 * @prop {number} height
 * @prop {Coordinate} titlePosition
 * @prop {string} titleFont
 * @prop {string} titleSize
 * @prop {Coordinate} titleColor
 * @prop {Coordinate} timePosition
 * @prop {string} timeFont
 * @prop {string} timeSize
 * @prop {Coordinate} timeColor
 */

/**
 * @typedef {Object} PhonePreset
 *
 * @property {string} name
 * @property {number} height
 * @property {number} width
 * @prop {(time: Date) => string} timeFormatter
 * @property {StatusBarPreset} statusBar
 */

/**
 * 预览渲染器
 */
export class PreviewDrawer {
  /**
   * @param {PhonePreset} preset 预设
   */
  loadPreset (preset) {
    this.preset = preset
  }

  /**
   * @param {HTMLCanvasElement} canvas 要渲染到的Canvas元素
   */
  bindCanvas (canvas) {
    this.canvas = canvas
  }

  /**
   * 渲染状态栏
   * @param {CanvasRenderingContext2D} ctx
   * @param {string} title
   * @param {Date} time
   */
  async #drawStatusBar (ctx, title, time) {
    const { preset } = this

    const background = await loadImage(preset.statusBar.imageUrl)
    const timeText = preset.timeFormatter(time)

    ctx.drawImage(background, 0, 0)

    // Draw title
    ctx.font = `${preset.statusBar.titleSize} ${preset.statusBar.titleFont}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = preset.statusBar.titleColor
    ctx.fillText(
      title,
      preset.statusBar.titlePosition.x,
      preset.statusBar.titlePosition.y
    )

    // Draw time
    ctx.font = `${preset.statusBar.timeSize} ${preset.statusBar.timeFont}`
    ctx.fillStyle = preset.statusBar.timeColor
    ctx.fillText(
      timeText,
      preset.statusBar.timePosition.x,
      preset.statusBar.timePosition.y
    )

    // ctx.reset()
  }

  /**
   * 渲染主体内容
   * @param {CanvasRenderingContext2D} ctx
   * @param {CanvasImageSource} content
   */
  #drawContent (ctx, content) {
    const { preset } = this

    ctx.drawImage(
      content,
      0,
      preset.statusBar.height,
      preset.width,
      preset.height - preset.statusBar.height
    )
  }

  /**
   * 渲染预览
   * @param {string} title 标题
   * @param {Date} time 时间
   * @param {CanvasImageSource} content
   */
  async draw (title, time, content) {
    const { canvas } = this

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw status bar
    await this.#drawStatusBar(ctx, title, time)

    // Draw content
    this.#drawContent(ctx, content)
  }

  /**
   * 清空画布
   */
  clear () {
    const { canvas } = this

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  /**
   * 获取DataURL
   * @param {string} type
   * @return {string}
   */
  async getDataUrl (type) {
    return this.canvas.toDataURL(type)
  }
}
