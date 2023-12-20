import HWM10PBar from './assets/status-bars/hwm10p.png'

/**
 * @type {import('./drawer').PhonePreset[]}
 */
export const presets = [
  {
    name: 'Huawei Mate 10 Pro',
    height: 2160,
    width: 1080,
    timeFormatter: (time) => {
      let prefix
      if (time.getHours() === 0 || time.getHours() === 23) {
        prefix = '半夜'
      } else if (time.getHours() >= 1 && time.getHours() <= 6) {
        prefix = '凌晨'
      } else if (time.getHours() >= 7 && time.getHours() <= 11) {
        prefix = '上午'
      } else if (time.getHours() === 12) {
        prefix = '中午'
      } else if (time.getHours() >= 13 && time.getHours() <= 16) {
        prefix = '下午'
      } else if (time.getHours() === 17 || time.getHours() === 18) {
        prefix = '傍晚'
      } else if (time.getHours() >= 19 || time.getHours() <= 22) {
        prefix = '晚上'
      }
      const hour = (time.getHours() % 12) ? time.getHours() % 12 : 12
      return prefix + hour.toString() + ':' + time.getMinutes().toString().padStart(2, '0')
    },
    statusBar: {
      imageUrl: HWM10PBar,
      height: 195,
      titlePosition: { x: 538, y: 135 },
      titleFont: 'sans-serif',
      titleSize: '48px',
      titleColor: '#000000',
      timePosition: { x: 970, y: 40 },
      timeFont: 'sans-serif',
      timeSize: '32px',
      timeColor: '#5f5f5f'
    }
  }
]
