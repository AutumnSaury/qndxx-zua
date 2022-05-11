export default {
  getLatestLessonID: async function () {
    return (await (await fetch('/lessonlist')).json())?.obj.news.list[0].link.match(/(?<=daxuexi\/)[\w\d]+/)[0]
  },
  authenticate: async function (name, id) {
    return await fetch('/zqauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        xh: id,
        xm: name
      })
    })
  },
  getTitle: async function (id) {
    const index = await (await fetch(`/lessonroot/${id}/index.html`)).text()
    return index.match(/(?<=<title>).+(?=<\/title>)/)[0]
  }
}
