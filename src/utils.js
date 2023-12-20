/**
 * 获取课程Hash
 * @param {import('./apis').Lesson} lesson
 * @returns {string}
 */
export function getLessonHash (lesson) {
  return lesson.link.match(/(?<=daxuexi\/)[\w\d]+/)[0]
}

/**
 * 下载文件，保存为指定文件名
 * @param {string} url
 * @param {string} fileName
 */
export function saveAs (url, fileName) {
  const dllink = document.createElement('a')
  dllink.href = url
  dllink.download = fileName
  dllink.click()
  dllink.remove()
}

/**
 * 加载图片
 * @param {string} url 图片URL
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage (url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = url
    image.onload = () => resolve(image)
    image.onerror = reject
  })
}
