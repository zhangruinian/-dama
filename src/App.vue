<template>
    <div id="appNav">
        <a :href="slider">滑动样式</a>
        <a href="">图片分类</a>
        <a :href="click">点击样式</a>
        <a :href="testCenter">测试中心</a>
        <a :href ="check">点击样式检查</a>
        <a :href = 'slideCheck'>滑动样式检查</a>
        <a :href ="rank">排名</a>

    </div>
</template>
<script>
    export default {
        name: 'appNav',
        data(){
            return {
            token:'',
            slider:'',
            click:'',
            testCenter:'',
            check:'',
            rank:'',
            slideCheck:''
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
            }
    },
    created (){
        this.token = this.getQueryValue("token")
        var host = window.location.origin;
        this.slider = host +'/dist/slide.html?token='+ this.token;
        this.click = host + '/dist/click.html?token='+ this.token;
        this.testCenter ='http://webapp.apiapp.cc/?token='+this.token;
        this.check = host +'/dist/check.html?token='+ this.token;
        this.rank = host +'/dist/rank.html?token='+ this.token;
        this.slideCheck = host + '/dist/slideCheck.html?token='+ this.token
    },
 }

</script>
<style scoped lang=less rel="stylesheet/less">
    #appNav {
        display: flex;
        align-items: center;
        justify-content: center;
        a {
            display: flex;
            margin: 20px 30px;
        }
    }
</style>
