Component({
  data: {},
  properties: {
    tabs: {
      type: Array,
      value: []
    }
  },
  methods: {
    handleIndex(e){
      const index = e.currentTarget.dataset.index;
      this.triggerEvent('tabsIndexChange',index)
    }
  }
})