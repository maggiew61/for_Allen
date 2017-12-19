<template>
  <transition name="fade">
    <div class="blackLoading" v-show="loading" :style="{ background: bgColor , position: position}">
        <div class="loader" :style="{ width: size + 'px' }">
          <svg class="circular" viewBox="25 25 50 50">
            <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
          </svg>
        </div>
     </div>
  </transition>
</template>
<script>

export default{
  name: 'showLoading',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 65,
    },
    bgColor: {
      type: String,
      default: 'rgba(0,0,0,0.6)',
    },
    position: {
      type: String,
      default: 'fixed',
    },
  },
};
</script>
<style>
.blackLoading{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
/*   background: rgba(0,0,0,0.6);
 */  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loader {
  position: relative;
  margin: 0px auto;
  /* width: 65px; */
}
.loader:before {
  content: '';
  display: block;
  padding-top: 100%;
}

.circular {
  -webkit-animation: rotate 2s linear infinite;
          animation: rotate 2s linear infinite;
  height: 100%;
  -webkit-transform-origin: center center;
          transform-origin: center center;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.path {
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  -webkit-animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
          animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
  stroke-linecap: round;
}

@-webkit-keyframes rotate {
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}

@keyframes rotate {
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}
@-webkit-keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
}
@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
}
@-webkit-keyframes color {
  100%,
  0% {
    stroke: #ff7a84;
  }
  40% {
    stroke: #ffcb50;
  }
  66% {
    stroke: #3ca4ad;
  }
  80%,
  90% {
    stroke: #ff7000;
  }
}
@keyframes color {
  100%,
  0% {
    stroke: #ff7a84;
  }
  40% {
    stroke: #ffcb50;
  }
  66% {
    stroke: #3ca4ad;
  }
  80%,
  90% {
    stroke: #ff7000;
  }
}

</style>