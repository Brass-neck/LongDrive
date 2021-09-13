export function getSliders() {
  return new Promise((resolve) => {
    const sliders = [{ url: '11.jpeg' }, { url: '22.jpeg' }, { url: '33.jpeg' }]
    setTimeout(() => {
      resolve(sliders)
    }, 300)
  })
}
