<template>
  <transition name="fade">
    <div class="vue-pages">
      <ul class="pagination">
        <li v-if="start > counts">
          <a :href="prev"
            @click.prev="fn(current-1, $event)" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li v-if="pageCounts.length" v-for="p in pageCounts" :class="p == c ? 'active' : ''">
          <a :href="link(p)"
             @click.prev="p == c ? null : fn(p, $event)"> {{p}} </a>
        </li>
        <li v-if="end != total">
          <a :href="next" @click.prev="fn(current+1, $event)" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>
        </li>
      </ul>
    </div>
  </transition>
</template>


<script>

/**
 * url: URL
 * pageParam: paramter's Name
 * counts: the count of page numbers that can show
 * total
 * current: the current page number
 * fn: the click hanlder
**/
export default {
    name: 'vue-pages',
    props: {
      url: {
        type: String,  // for url
        default: '' // '# 'or '?param=pages'
      },
      pageParam: { // for url
        type: String,
        default: 'page'
      },
      counts: {
        type: Number,
        default: 5
      },
      total: {
        type: Number,
        default: 1,
      },
      current: {
        type: Number,
        default: 1
      },
      fn:{
        type: Function
      }
    },
    computed: {
      c(){
        let c = 1;
        c = this.current < 1 ? 1 : this.current
        return c > this.total ? this.total : c
        // Math.min(Math.max( this.current , 1) , this.total)
      },
      start(){
        let start = this.c - this.c % this.counts
        if(this.c % this.counts == 0){
          start = this.c - this.counts
        }
        if(this.c > this.counts){
          start = start + 1
        }
        return Math.max(1, start)
      },
      end(){
        let end = this.start + this.counts - 1
        if(this.c % this.counts == 0){
          end = this.c
        }
        end = end > this.total ? this.total : end
        return Math.min(end, this.total)
      },
      pageCounts(){
        let pages = [];
        for(let i=this.start; i<=this.end; i++){
          pages.push(i)
        }

       // let start = this.c -2 <= 0 ? 1 : this.c - 2;
       // let end = this.c +2 > this.end ? this.end : this.c + 2 ;
       // for(let i=start; i<=end; i++){
       //   pages.push(i)
       // }
        return pages
      },
      prev(){
        return this.link(this.c)
      },
      next(){
        return this.link(this.c)
      }
    },
    methods: {
      link(page){
        // console.log(page);
        // click function
        // if(!this.url){
        //   return ''
        // }else {
        //   let connector = this.url.indexOf('?') > -1 ? '&' : '?'
        //   return this.url + connector + this.pageParam + '=' + page
        // }
      }
    }
}

</script>

<style>
  .pagination {
    /* display: inline-block; */
    padding-left: 0;
    margin: 10px 0;
    border-radius: 2px;
    display: flex;
    white-space: nowrap;
    justify-content: center;
  }
 /*  .pagination > li {
    display: inline;
  } */
  .pagination > li > a,
  .pagination > li > span {
  /*   position: relative;
    float: left;
    padding: 4px 10px;
    line-height: 1.42857143; */
    display: inline-flex;
    color: #61909c;
    text-decoration: none;
    background-color: #fff;
    border: 1px solid #eceaea;
    border-radius: 50%;
    cursor: pointer;
    width: 30px;
    height: 30px;
    justify-content: center;
    align-items: center;
    margin: 2px;
    font-size: .8em;
  }
  /* .pagination > li:first-child > a,
  .pagination > li:first-child > span {
    margin-left: 0;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }
  .pagination > li:last-child > a,
  .pagination > li:last-child > span {
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  } */
  .pagination > li > a:hover,
  .pagination > li > span:hover,
  .pagination > li > a:focus,
  .pagination > li > span:focus {
    z-index: 2;
    color: #4f8896;
    background-color: #eee;
    border-color: #ddd;
  }
  .pagination > .active > a,
  .pagination > .active > span,
  .pagination > .active > a:hover,
  .pagination > .active > span:hover,
  .pagination > .active > a:focus,
  .pagination > .active > span:focus {
    z-index: 3;
    color: #fff;
    cursor: default;
    background-color: #90c4d2;
    border-color: #90c4d2;
  }
  .pagination > .disabled > span,
  .pagination > .disabled > span:hover,
  .pagination > .disabled > span:focus,
  .pagination > .disabled > a,
  .pagination > .disabled > a:hover,
  .pagination > .disabled > a:focus {
    color: #777;
    cursor: not-allowed;
    background-color: #fff;
    border-color: #ddd;
  }

</style>