<template>
    <div class="App">
        <gtHeader></gtHeader>
        <div class="progress-box">
            进度：{{Finished}}/{{all}}
            <div class="progress"> <span class="progress-inner" :style="{width:progress}"></span></div>
        </div>
        <h2>用鼠标依次点选相应的汉字,按回车键提交</h2>
        <div class="wrapper" id='captcha'>
            <div class="img" @mousedown="push"
                 @mousemove="drag"
                 :style="{backgroundImage:'url('+picUrl+')'}">
                <div class="number" v-for="(item,index) in items" v-if="item.visible"
                     :style="{left:item.x_pos -10+ 'px',top:item.y_pos -10+ 'px'}"
                     @mousedown="startDrag(index)"
                     @mouseup="endDrag(index)">{{index + 1}}
                </div>
            </div>
            <table class="answer">
                <tbody>
                <tr class="answer-num">
                    <td>
                        编号
                    </td>
                    <td v-for="(des,index) in desc.split('')">
                        {{index + 1}}
                    </td>
                    <td v-if="surplus>0" v-for="n in surplus>0?surplus:1">
                        {{desc.length + n}}


                    </td>
                </tr>
                <tr class="answer-text">
                    <td>
                        文字


                    </td>
                    <td v-for="(des,index) in desc.split('')">
                        {{des}}


                    </td>
                    <td v-if="surplus>0" v-for="n in surplus>0?surplus:1">
                        <input type="text"
                               v-bind:value="items[totalNum-surplus+n-1].text"
                               v-on:input="updateValue($event.target.value,n)">
                    </td>
                </tr>
                <tr>
                    <td>
                        坐标X
                    </td>
                    <td v-for="(des,index) in desc.split('')">
                        <span>{{Math.round(items[index].x_pos)}}</span>
                    </td>
                    <td v-if="surplus>0" v-for="n in surplus>0?surplus:1">
                        <span>{{Math.round(items[totalNum - surplus + n - 1].x_pos)}}</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        坐标Y
                    </td>
                    <td v-for="(des,index) in desc.split('')">
                        <span>{{Math.round(items[index].y_pos)}}</span>
                    </td>
                    <td v-if="surplus>0" v-for="n in surplus>0?surplus:1">
                        <span>{{Math.round(items[totalNum - surplus + n - 1].y_pos)}}</span>
                    </td>
                </tr>
                <tr>
                </tr>
                </tbody>
            </table>
            <div class="btns">
                <button class="undo" @click="undo">撤销</button>
                <button class="submit" @click="submit" >提交</button>
            </div>

        </div>
        <gtFooter></gtFooter>
    </div>
</template>

<script>
    import axios from 'axios'
    import panel from '../components/panel.vue'
    import cell from '../components/cell.vue'
    import gtHeader from '../components/header.vue'
    import gtFooter from "../components/footer.vue"
    export default{
        data() {
            return {
                picUrl: '',
                desc: '',
                items: [],
                activeIndex: false,
                totalNum: 0,
                serverUrl: 'http://api.apiapp.cc',
                bg_name: '',
                Finished:0,
                all: 0,
                picURl:'http://geetest.f3322.net:28079'
            }
        },
        computed: {
            /*initNum(){
             return this.desc.length
             },*/
            surplus(){
                return this.totalNum - this.desc.length
            },
            rect(){
                return document.getElementsByClassName('img')[0].getBoundingClientRect();
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
            getCates() {
                var vm = this;
                vm.token = this.getQueryValue('token');
                axios.get(vm.serverUrl + '/pic/read-pic-list/', {
                    params: {
                        user: vm.user,
                        token: vm.token
                    }
                })
                    .then(function (res) {
                        console.log(res.data.page_data);
                        vm.catesDetails = res.data.page_data
                        console.log(vm.catesDetails);
                    })
            },
            updateValue: function (value,n) {
                var vm=this
                var formattedValue = value.trim().slice(0,1);
                console.log(formattedValue);
                this.items[vm.totalNum-vm.surplus+n-1].text=formattedValue;
               // console.log(this.items[vm.totalNum-vm.surplus+n-1].text);
            },
            getImgData(){
                var vm = this;
                vm.token = this.getQueryValue('token');
                axios.get(vm.serverUrl + '/oreg/get-touch-image-info/?token='+vm.token)
                    .then(function (res) {
                        console.log(res.data);
                        vm.picUrl =vm.picURl +'__'+res.data.data.bg_name +'__'+ decodeURI(res.data.data.q_text) +'__'+ res.data.data.rand_tag+'.jpeg'
                        vm.desc = res.data.data.q_text;
                        vm.bg_name = res.data.data.bg_name;
                        vm.items =[];
                        vm.totalNum = 0;
                        vm.desc.split('').forEach(function (value) {
                            vm.items.push({
                                text: value,
                                x_pos: 0,
                                y_pos: 0,
                                visible: false
                            })
                        })
                    })
                    .catch(function (error) {
                        vm.error = error
                    })
            },
            startDrag(index){
                this.activeIndex = index;
            },
            drag(event){
                var vm = this
                var active = this.activeIndex
                //console.log(vm.rect);
                //console.log(event.pageX);
                if (typeof active === 'number') {
                    vm.items[active].x_pos = event.pageX - vm.rect.left;
                    vm.items[active].y_pos = event.pageY - vm.rect.top;
                }
            },
            endDrag(index){
                this.activeIndex = false
            },
            submit(){
                var vm = this;
                vm.token = this.getQueryValue('token');
                axios({
                    method: 'post',
                    url: vm.serverUrl + '/oreg/upload-touch-image-ans/?token='+vm.token,
                    data: {
                        bg: vm.bg_name,
                        ans: vm.items
                    }
                }).then(
                    (res)=>{
                        console.log(res)
                        if(res.data.code==200){
                            this.getImgData();
                            this.initProgress()
                        }
                        else {
                            alert(res.data.msg)
                        }
                    }
                )
            },
            push(event){
                var vm = this;
                var numberItems = document.getElementsByClassName('number');
                for (var i = 0; i < numberItems.length; i++) {
                    if (document.getElementsByClassName('number')[i] == event.target) {
                        return
                    }
                }
                if (vm.totalNum >= vm.desc.length) {
                    this.items.push({
                        text: '',
                        x_pos: event.offsetX,
                        y_pos: event.offsetY,
                        visible: true
                    })
                }
                else {
                    this.items[vm.totalNum].x_pos = event.offsetX;
                    this.items[vm.totalNum].y_pos = event.offsetY;
                    this.items[vm.totalNum].visible = true
                }
                vm.totalNum++;

                console.log(event.target.offsetParent)
            },
            undo(){
                var vm = this
                if (vm.totalNum > vm.desc.length) {
                    vm.items.pop()
                    vm.totalNum--
                }
            },
            postImgData(){
                var vm = this
                vm.token = this.getQueryValue('token');
                var data = this.imgDetails.map(function (value) {
                    var valCopy = Object.assign({}, value);
                    switch (valCopy.result) {
                        case 'right':
                            valCopy.pass_num = parseInt(valCopy.pass_num) + 1
                            break;
                        case 'wrong':
                            valCopy.nopass_num = parseInt(valCopy.nopass_num) + 1;
                            break;
                        case 'notfit':
                            valCopy.dim_num = parseInt(valCopy.dim_num) + 1;
                            break;
                        case '':
                            return 'unfinished'
                    }
                    switch (vm.user) {
                        case '1':
                            valCopy.user1 = true;
                            break;
                        case '2':
                            valCopy.user2 = true;
                            break;
                        case '3':
                            valCopy.admin = true;
                    }
                    // valCopy.show_num=parseInt(valCopy.show_num)+1;
                    return valCopy
                });
                if (data.indexOf('unfinished') > -1) {
                    alert('请全部选完再提交！')
                    return
                }
                this.finished = true;
                this.imgDetails = null;
                this.currentIndex = 0;
                console.log(data);
                return axios({
                    method: 'post',
                    url: vm.serverUrl + '/pic/update-pic-message/',
                    data: {
                        "page_data": data,
                        "user": vm.user,
                        token: vm.token
                    }
                })
            },
            initProgress () {
        		axios.get(this.serverUrl+ "/oreg/capt-task-counts/",{
					params:{
						token:this.getQueryValue("token"),
						}
					}).then((res)=>{
					    if(res.data.code==200){
					        this.all = parseInt(res.data.data.text_all_cnt);
					        this.Finished = parseInt(res.data.data.text_finished_cnt);
					        this.progress =(this.Finished/this.all)* 100 + "%"
					    }

					}).catch((error)=>{
						console.log(error)
					})
        	}
        },
        created(){
            if(window.location.port == 8078){
                this.picURl = 'http://192.168.1.200:8079/capt-163-touch/'
            }
            else{
                this.picURl = 'http://geetest.f3322.net:28079/capt-163-touch/'
            }
            this.getImgData()
            this.initProgress()
        },
        mounted(){
            let Ecaptcha = document.getElementById("captcha");
            document.onkeydown=(event) => {
               var e = event || window.event;
               if(e && e.keyCode==13){
					this.submit()
				}}

        },
        components: {gtHeader,gtFooter}
    };
</script>

<style lang=less rel="stylesheet/less">
    body {
        margin: 0;
    }
    .App {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 100px;
    }
    h2{
        font-size: 16px;
        font-weight: 400;
    }
    .wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-right: auto;
        margin-left: auto;
        .img {
            position: relative;
            margin-top: 30px;
            margin-bottom: 30px;
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
        .answer {
            font-size: 16px;
            border-collapse: collapse;
            .answer-text {


            }
            tr{
                &:nth-child(2){
                    font-size: 30px;
                    height: 60px;
                }
                input {
                    font-size: 30px;
                }
                td {
                    width: 60px;
                    border: 1px solid black;
                    text-align: center;
                    &:first-child{
                        background-color: #eaeaea;
                        color: #2a2a2a;
                        font-size: 16px;
                        cursor: pointer;
                        font-weight: bold;
                    }
                }
            }
            input {
                width: 50px;
                text-align: center;
            }
        }
        .undo {
            margin-top: 30px;
            font-size: 20px;
            width: 80px;
            //background-color: lightcoral;
            margin-right: 20px;
            font-size: 14px;
            font-family: PingFangSC-Light, "Microsoft YaHei", Tahoma, "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;
            /*display: flex;
            justify-content: center;
            align-items: center;*/
            text-align: center;
            border-radius: 2px;
            border-color: transparent;
            transition: all 0.5s;
            color: #ffffff;
            background-color: #696969;
            &:hover {
                color: #ffffff;
                background-color: #555555;
                cursor: pointer;
            }

        }
        .submit {
            margin-top: 30px;
            width: 80px;
            // background-color: lightgreen;
            font-size: 14px;
            font-family: PingFangSC-Light, "Microsoft YaHei", Tahoma, "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;
            /*display: flex;
            justify-content: center;
            align-items: center;*/
            text-align: center;
            border-radius: 2px;
            border-color: transparent;
            transition: all 0.5s;
            color: #ffffff;
            background-color: #4488ff;
            &:hover {
                color: #ffffff;
                background-color: #3077f3;
                cursor: pointer;
            }

        }
    }
    .progress-box {
        width: 200px;
    }
    .progress {
        display: flex;
        background-color: #eee;
        height: 8px;
        width: 100%;
        border-radius: 4px;
    }
    .progress-inner {
        display: flex;
        background-color: green;
        height: 8px;
        border-radius: 4px;
    }

</style>
