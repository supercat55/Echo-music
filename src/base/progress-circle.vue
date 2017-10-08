<template>
    <div class="progress-circle">
        <svg :width="radius" :height="radius" viewBox='0 0 100 100' version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle class="progress-background" r="50" cx="50" cy="50" fill="transparnt"/>
            <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparnt" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"/>
        </svg>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'progress-circle',
    props: {
      radius: {
        type: Number,
        default: 100
      },
      percent: {
          type: Number,
          default: 0
      }
    },
    data() {
        return {
            dashArray: Math.PI * 100
        }
    },
    computed: {
      dashOffset() {
        return (1 - this.percent) * this.dashArray
      }
    }
}
</script>

<style scoped>
    .progress-circle {
        position: relative;
        width: .6rem;
        height: .6rem;
    }
    .progress-circle svg {
        position: absolute;
        left: 0;
        top: 0;
    }
    .progress-circle circle {
        stroke-width: 6px;
        transform-origin: center;
    }
    .progress-background {
        transform: scale(.9);
        stroke: rgba(255, 255, 255, .4);
    }
    .progress-bar {
        transform: scale(.9) rotate(-90deg);
        stroke: #fff;
    }
</style>