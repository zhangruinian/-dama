<template>
    <div id="appCheck">
        <div class="warp">
            <div class="card" v-for="page in pageData">
                <div class="img" :style="{backgroundImage:'url('+ picURl + '__' + page.bg_name +'__'+ decodeURI(page.q_text)+ '__'+ page.rand_tag+ '.jpeg'+')'}">
                    <div class="number" v-for="(item,index) in page.text_list"
                         :style="{left:item.x_pos -10+ 'px',top:item.y_pos -10+ 'px'}">{{index + 1}}
                    </div>
                </div>
                <div>
                    <table>
                        <tr>
                            <td>编号</td>
                            <td v-for="(item,index) in page.text_list">{{index+1}}</td>
                        </tr>
                        <tr>
                            <td>汉字</td>
                            <td v-for="item in page.text_list">{{item.text}}</td>
                        </tr>
                        <tr>
                            <td>X坐标</td>
                            <td v-for="item in page.text_list">{{item.x_pos}}</td>
                        </tr>
                        <tr>
                            <td>Y坐标</td>
                            <td v-for="item in page.text_list">{{item.y_pos}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>



        <div class="pagination">
            <ul>
                <li><a @click="prvePage(current)">上一页</a></li>
                <li v-for="page in pages" :class="{ active: current == page }">
                    <a @click="btnClick(page)">{{ page < 1 ? "..." : page }}</a>
                </li>
                <li><a @click="nextPage(current)">下一页</a></li>
                <!--<li>跳转到<input type="text" @input='getPage($event.target.value)'> <a @click="btnClick(goTopage)">确定</a>-->
                <!--</li>-->
            </ul>
        </div>
    </div>

</template>
<script>
 import axios from 'axios'
    export default {
        name: 'appCheck',
        data(){
            return {
                totalPage:30,
                current: 1,
                goTopage:0,
                apiUrl:'http://api.apiapp.cc/',
                pageData:{},
                picURl:'',
            }
        },
    computed: {
      pages: function () {
        var left = 1
        var right = this.totalPage
        var ar = []
        if (this.totalPage >= 11) {
          if (this.current > 5 && this.current < this.totalPage - 4) {
            left = this.current - 5
            right = this.current + 4
          } else {
            if (this.current <= 5) {
              left = 1
              right = 10
            } else {
              right = this.totalPage
              left = this.totalPage - 9
            }
          }
        }
        while (left <= right) {
          ar.push(left)
          left++
        }
        if (ar[0] > 1) {
          ar[0] = 1;
          ar[1] = -1;
        }
        if (ar[ar.length - 1] < this.totalPage) {
          ar[ar.length - 1] = this.totalPage;
          ar[ar.length - 2] = 0;
        }
        return ar
      }
    },
    methods: {
    getQueryValue(name, url){
                if (!url) {
                    url = window.location.href;
                }
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            },
      // 页码点击事件
      btnClick: function (data) {
        if (data < 1) return;
        if (data != this.current) {
          this.current = data
        }
        if(data> this.totalPage){
            this.current = this.totalPage
            return
        }
        this.getInit(this.current)
      },
      // 下一页
      nextPage: function (data) {
         console.log(this.current)
        if (this.current >= this.totalPage) return;
        this.btnClick(this.current + 1);
      },
      // 上一页
      prvePage: function (data) {
        if (this.current <= 1) return;
        this.btnClick(this.current - 1);
      },
      // 设置按钮禁用样式
      setButtonClass: function (isNextButton) {
        if (isNextButton) {
          return this.current >= this.totalPage ? "page-button-disabled" : ""
        }
        else {
          return this.currentrent <= 1 ? "page-button-disabled" : ""
        }
      },
      getPage(value){
        var page = value.trim()
        if(isNaN(page)){
            alert('请输入数字')
        }else{
            this.goTopage = page
        }

      },
      getInit(page){
            var token = this.getQueryValue('token');
            axios({
                method: 'post',
                url: this.apiUrl + 'oreg/get-capt-page/?token='+ token,
                data: {
                     'page_idx': page,
                     "page_size":9,
                     'capt_type':'c_text_code_capt'
                }}).then(
                    (res)=>{
                        console.log(res)
                        this.pageData = res.data.data.page_data;
                        console.log(this.pageData[0].q_text)
                        this.totalPage = res.data.data.page_total_cnts;
                    }
                ).catch((error)=>{
						console.log(error)
				})
      },
      getInitPro(){
        if(window.location.port == 8078){
                this.picURl = 'http://192.168.1.200:8079/capt-163-touch/'
            }
            else{
                this.picURl = 'http://geetest.f3322.net:28079/capt-163-touch/'
            }
      }

    },

    created(){
        this.getInitPro()
        this.getInit(1)

    },
 }



</script>
<style scoped lang=less rel="stylesheet/less">
    #appCheck {
        .warp{
            display: flex;
            flex-wrap: wrap;
        }
        .card{
            display: flex;
            flex-direction: column;
            width: 30%;
            align-items: center;
        }
        .pagination {
            ul {
                list-style: none;
                display: flex;
                justify-content: center;
                li {
                    background-color: #eee;
                }
                a {
                    padding: 0 10px;
                    cursor: pointer;
                }
                input {
                    display: inline-block;
                    width: 40px;
                }
                li :hover{
                    background-color: #b5b0b0;
                    color: white;
                }
                .active {
                    background-color: #b5b0b0;
                    color: white;
                }
            }
        }
        .img {
            position: relative;
            margin-top: 30px;
            margin-bottom: 10px;
            width: 320px;
            height: 100px;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            .number {
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                cursor: pointer;
                background-color: rgba(0, 0, 0, 0.3);
                width: 20px;
                height: 20px;
                border-radius: 50%;
                color: white;
                user-select: none;
            }

        }
        table {
            border-collapse: collapse;
        }
        td {
            border: 1px solid black;
            text-align: center;
            width: 50px;
        }
    }
</style>
