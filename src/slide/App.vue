<template>
    <div id="app">
        <gtHeader></gtHeader>
        <div class="progress-box">
            进度：{{widthInner}}/{{widthOutter}}
            <div class="progress"><span class="progress-inner" :style="{width:progress}"></span></div>
        </div>
        <h2>请把图片中的红色小方块拖动到缺角出，尽量保证准确性</h2>
        <h5>提示：可使用键盘的上下左右方向键进行微调，Enter键可进行提交</h5>
        <div class="img-wrap">
            <span @mousedown.prevent="down" @mousemove.prevent="move" @mouseup="up()" id="captcha"></span>
            <img :src="imgUrl">
        </div>
        <table>
            <tr>
                <td>X坐标</td>
                <td>Y坐标</td>
            </tr>
            <tr>
                <td>{{position.x_pos}}</td>
                <td>{{position.y_pos}}</td>
            </tr>
        </table>
        <button @click="submit">提交</button>
        <gtFooter></gtFooter>
    </div>
</template>
<script>
    import axios from "axios"
    import gtHeader from '../components/header.vue'
     import gtFooter from "../components/footer.vue"
    export default {
        name: 'appSlide',
        data(){
            return{
                isDown:false,
                ObjLeft:0,
                ObjTop:0,
                posX:0,
                posY:0,
                position:{
                },
                id:"",
                imgUrl:"",
                apiUrl:"http://api.apiapp.cc/",
                userName:'',
                widthOutter :0,
                widthInner:0,
                progress:'0%',
           }
        },
        computed:{
        },
        methods:{
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
            mousePosition(event){
                return{
                    x:event.pageX,
                    y:event.pageY
                }
            },
            down(event){
                this.isDown = true;
                this.ObjLeft = event.target.offsetLeft;
                this.ObjTop = event.target.offsetTop;
                this.posX = parseInt(this.mousePosition(event).x);
                this.posY = parseInt(this.mousePosition(event).y);
            },
            up(){
                this.isDown = false;
            },
            move(event){
                if (this.isDown) {
                    var x = parseInt(parseInt(this.mousePosition(event).x) - this.posX + this.ObjLeft);
                    var y = parseInt(parseInt(this.mousePosition(event).y) - this.posY + this.ObjTop);
                    var w = 320 - event.target.clientWidth;
                    var h = 100 - event.target.clientHeight;
                    if (x < 0) {
                        x = 0
                    } else if (x > w) {
                        x = w
                    };
                    if (y < 0) {
                        y = 0
                    }else if (y > h) {
                        y= h
                    };
                    event.target.style.left = x + 'px';
                    event.target.style.top = y + 'px';
                    this.position ={
                        x_pos:x || 0,
                        y_pos:y || 0,
                        id:this.id,
                        token:this.getQueryValue("token")
                    }
                }
            },
            submit(){
                axios.post(this.apiUrl+ 'slide/update-slide-ans/', {
					...this.position
			    }).then(
				    (res)=>{
				    	if(res.data.code==200){
				    		this.getImageData();
							this.initProgress()
				    	}else {
				    			alert(res.data.msg)
				    		}

				    }
			    )
			},
			getImageData(){
				axios.get(this.apiUrl+ "slide/read-slide-pic/",{
                params:{
                    token:this.getQueryValue("token"),
                    user:1,
                    }
	            }).then((res)=>{
	               this.id = res.data.data.id;
	              this.imgUrl = 'http://geetest.f3322.net:28079/capt-163-slide/__'+res.data.data.bg_name + '__' +res.data.data.rand_tag+'.jpg'
	            }).catch((error)=>{
	                console.log(error)
	            })
			},
        	initProgress () {
        		axios.get(this.apiUrl+ "oreg/capt-task-counts/",{
					params:{
						token:this.getQueryValue("token"),
						}
					}).then((res)=>{
					    if(res.data.code==200){
					        this.widthOutter = parseInt(res.data.data.slide_all_cnt);
					        this.widthInner = parseInt(res.data.data.slide_finished_cnt);
					        this.progress =(this.widthInner/this.widthOutter)* 100 + "%"
					    }


					}).catch((error)=>{
						console.log(error)
					})
        	}

		},
        components: {gtHeader,gtFooter},
        created(){
			this.getImageData();
			this.initProgress()
        },
        mounted(){
            let Ecaptcha = document.getElementById("captcha");
            document.onkeydown=(event) => {
               var e = event || window.event;
               if(e && e.keyCode==13){//enter 提交
					this.submit()
				}
				if(e && e.keyCode==37){//左箭头
					Ecaptcha.style.left = Ecaptcha.offsetLeft - 1 + "px";
					if(Ecaptcha.offsetLeft <= 0){
						Ecaptcha.style.left  = "0px"
					}
				}
				if(e && e.keyCode==38){//上
					Ecaptcha.style.top = Ecaptcha.offsetTop - 1 + "px";
					if(Ecaptcha.offsetTop <= 0){
						Ecaptcha.style.top  = "0px"
					}
				}
				if(e && e.keyCode==39){//右
					Ecaptcha.style.left = Ecaptcha.offsetLeft + 1 + "px";
					if(Ecaptcha.offsetLeft >= 272){
						Ecaptcha.style.left  = "272px"
					}
				}
				if(e && e.keyCode==40){//下
					Ecaptcha.style.top = Ecaptcha.offsetTop + 1 + "px";
					if(Ecaptcha.offsetTop >= 62){
						Ecaptcha.style.top  = "62px"
					}
				}
				this.position.x_pos = Ecaptcha.offsetLeft;
				this.position.y_pos = Ecaptcha.offsetTop;
			};

        },


    }

</script>
<style scoped lang=less rel="stylesheet/less">
    #app {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        color: #2c3e50;
        margin-top: 60px;
        .img-wrap {
            width: 320px;
            display: flex;
            flex-wrap: wrap;
            position: relative;
            img {
                width: 320px;
                height: 100px;
            }
            span {
                position: absolute;
                display: inline-block;
                width: 48px;
                height: 38px;
                background-color: rgba(224, 42, 30, 0.2);
                border: 1px solid green;
                &:hover {
                    cursor: move;
                }
            }
        }
        button {
            width: 100px;
            height: 30px;
            margin-top: 20px;
            &:hover {
                cursor: pointer;
            }
        }
        table {
            tr {
                text-align: center;
                td {

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
    }
</style>
