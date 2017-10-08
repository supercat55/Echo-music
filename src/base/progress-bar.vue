<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" ref="progressBtn"
                @touchstart.prevent="progressTouchstart"
                @touchmove.prevent="progressTouchmove"
                @touchend.prevent="progressTouchend"
                >
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>
import {prefixStyle} from 'common/js/dom'
const transform = prefixStyle('transform')
export default {
    name: 'progress-bar',
    props: {
        percent: {
            type: Number,
            default: 0
        }
    },
    created() {
        this.touch = {}
    },
    methods: {
        progressTouchstart(e){
            this.touch.initiated = true
            this.touch.startX = e.touches[0].pageX
            this.touch.left = this.$refs.progress.clientWidth
        },
        progressTouchmove(e){
            if (!this.touch.initiated) {
                return
            }
            const progressBtnWidth = this.$refs.progressBtn.clientWidth
            const deltaX = e.touches[0].pageX - this.touch.startX
            const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth,Math.max(0,this.touch.left + deltaX ))
            this._offset(offsetWidth)
        },
        progressTouchend(){
            this.touch.initiated = false
            this._triggerPercent()
        },
        _triggerPercent(){
            const progressBtnWidth = this.$refs.progressBtn.clientWidth
            const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth 
            const percent = this.$refs.progress.clientWidth/barWidth
            this.$emit('percentChange',percent)
        },
        _offset(offsetWidth){
            this.$refs.progress.style.width = `${offsetWidth}px`
            this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        },
        progressClick(e) {
            const rect = this.$refs.progressBar.getBoundingClientRect()
            const offsetwidth = e.pageX - rect.left
            this._offset(offsetwidth)
            this._triggerPercent()
        }
    },
    watch: {
        percent(newPercent){
            const progressBtnWidth = this.$refs.progressBtn.clientWidth
            if (newPercent > 0 && !this.touch.initiated) {
                const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
                const offsetWidth = newPercent * barWidth
                this._offset(offsetWidth)
            }
        }
    }
}
</script>

<style scoped>
.progress-bar {
    height: .3rem;
}
.bar-inner {
    position: relative;
    top: 0.12rem;
    background: #8b7e8b;
    height: 2px;
}
.bar-inner .progress {
    position: absolute;
    height: 100%;
    background: #de6bee;
}
.bar-inner .progress-btn-wrapper {
    position: absolute;
    width: .3rem;
    height: .3rem;
    top: -0.12rem;
    left: -0.15rem;
}
.bar-inner .progress-btn-wrapper .progress-btn {
    position: relative;
    top: 0.0rem;
    left: 9px;
    width: 16px;
    height: 16px;
    background: #fff;
    border-radius: 50%;
}
</style>