type Event = {
  type: string,
  id: string
};
class NavEvent {
  constructor() {
    this.eventListener = {};
  }
  setOnNavigatorEvent(listener, id) {
    if (listener && listener instanceof Function) {
      // if (this.eventListener.findIndex(c => c.toString() == listener.toString()) >= 0) {
      //   return;
      // }
      // this.eventListener.push(listener);
      this.eventListener[id] = listener;
    }
  }
  dispatchEvent(event: Event) {
    // for (let i = 0; i < this.eventListener.length; i++) {
    //   if (this.eventListener[i] && this.eventListener[i] instanceof Function) {
    //     let isContinue = this.eventListener[i](event);
    //     if (isContinue) {
    //       continue;
    //     } else {
    //       break;
    //     }
    //   } else {
    //       // 自主回收
    //       this.eventListener.splice(i, 1);
    //       i--;
    //   }
    // }
    if (this.eventListener[event.id]) {
      this.eventListener[event.id](event);
    }
  }
}
export default new NavEvent();