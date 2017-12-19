<template>
  <transition name="modal">
      <div class="modal-mask"  >
        <div class="modal-wrapper" @click.self="$emit('close')"  >
          <div class="modal-container" :style="{'width': size +'%'}">
            <button type="button" class="close" @click.prevnt="$emit('close')">×</button>
            <div class="clearfix"></div>
            <div class="modal-header">
              <slot name="header">
              </slot>
            </div>
            <div class="modal-body">
              <slot name="body">
                default body
              </slot>
            </div>

            <div class="modal-footer">
              <slot name="footer">
                <button class="Btn"
                 @click.prevnt="$emit('enter')">
                  确定
                </button>
                <button class="Btn Btn-border"
                  @click.prevnt="$emit('close')">
                  取消
                </button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
</template>


<script>
/*
 * url: URL
 * pageParam: paramter's Name
 * counts: the count of page numbers that can show
 * total
 * current: the current page number
 * fn: the click hanlder
*/
export default {
  name: 'modal',
  props: {
    size: {
      type: Number,
      default: 80,
    },
  },
};

</script>

<style  lang="sass" scoped>
  .modal-mask
    position: fixed
    z-index: 9998
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0, 0, 0, .5)
    display: table
    transition: opacity .3s ease
    padding: 10px 0

  .modal-wrapper
    display: table-cell
    vertical-align: middle

  .modal-container
    // width: 80%
    margin: 0px auto
    padding: 15px 30px
    background-color: #fff
    border-radius: 2px
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33)
    transition: all .3s ease
    font-family: Helvetica, Arial, sans-serif
    overflow: auto
    max-height: 90vh
    .close
      outline: none
      border: none
      color: #ccc
      background: transparent
      float: right
      font-size: 1.3em
      cursor: pointer
      &:hover
        color: #222
  .modal-header
    padding: 5px 0px
    // border-bottom: 1px solid #efefef
    h3
      margin-top: 0
      color: #2a898e
  .modal-body
    margin: 10px 0
    overflow: auto

  .modal-default-button
    float: right

  .modal-footer
    text-align: center
  .clearfix
    clear: both
    float: none

  /*
   * The following styles are auto-applied to elements with
   * transition="modal" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the modal transition by editing
   * these styles.
   */

  .modal-enter
    opacity: 0
  .modal-leave-active
    opacity: 0

  .modal-enter .modal-container,
  .modal-leave-active .modal-container
    transform: scale(1.1)

</style>