//Authorization Tabs
const tabs = Array.from(document.querySelectorAll('button.nav-link'))

const switchTab = btnActive => {
   tabs.forEach(btn => {
      const line = btn.querySelector('hr.tab-delim')
      if (btn === btnActive) {
         btn.classList.add('block-bg')
         btn.classList.remove('block-bg-disabled')
         line.classList.remove('invisible')
      }
      if (btn != btnActive) {
         btn.classList.remove('block-bg')
         btn.classList.add('block-bg-disabled')
         line.classList.add('invisible')
      }
   })
}

tabs.forEach(btn => {
   btn.onclick = e => {
      if (Array.from(btn.classList).some(className => className === 'active')) switchTab(btn)
   }
})
