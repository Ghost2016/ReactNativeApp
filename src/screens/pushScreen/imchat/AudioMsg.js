
export class AudioMsg {
    constructor(msgId, url, duration) {
        this.msgId = msgId;
        this.url = url;
        this.duration = duration;
        this.currtime = 0;
        this.next = null;
    }
} 