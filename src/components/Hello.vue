<template>
  <div>
    <el-button @click="handleClick">点我一下</el-button>
    <div id="hello"></div>
  </div>
</template>
<script>
  import * as d3 from 'd3';
  export default {
    name: 'non-vue-line-chart',
    data(){
      return {
        relations: [99, 71, 78, 25, 36, 92],
        users:[
          {id:1,name:'ctt'},
          {id:2,name:'yh'},
          {id:3,name:'xiaoba'},
          {id:5,name:'hang'}
        ],
        userlink:[
          {source:1,target:3},
          {source:1,target:2},
          {source:1,target:5},
          {source:3,target:5},
        ],
        svg: {}
      };
    },
    methods: {
      handleClick(){
        this.relations.push(100);
        console.log(this.relations)
      },
      init(){
        this.svg = d3.select('#hello')
          .append('svg')
          .attr('width', 500)
          .attr('height', 200);
        this.createForce();
      },
      createForce(){
        let link = d3.forceLink(this.userlink).distance(()=>200).id((d)=>d.id);
        let simulation = d3.forceSimulation(this.users).force('link',link);

      },
      appendRect(){
        this.svg.selectAll('rect').data(this.relations).enter().append('rect').attr('x', 20).attr('y', (d, i) => i * 25).attr('width', (d) => d).attr('height', 23).attr('fill', 'red')
      }
    },
    watch: {
      relations(){
        this.appendRect();
      }
    },
    mounted() {
      this.init();
    },
  };

</script>
