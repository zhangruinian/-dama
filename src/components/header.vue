<template>
    <div class="progress-box">
        用户名：{{userName}}
    </div>
</template>
<script>
import axios from "axios"
export default{
      data(){
        return {
            apiUrl:'http://api.apiapp.cc/',
            userName:'',

        }
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
        initUser(){
        	axios.get(this.apiUrl+ "account/get-auth-user-info/",{
				params:{
						token:this.getQueryValue("token"),
						}
					}).then((res)=>{
					   this.userName = res.data.data.first_name
					}).catch((error)=>{
						console.log(error)
					})
        	},


    },
    created() {
        this.initUser();
    }
}
</script>
<style scoped lang=less rel="stylesheet/less">

</style>