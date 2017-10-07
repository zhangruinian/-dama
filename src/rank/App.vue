<template>
    <div id="appRank">
       <h1>打码排名</h1>
        <table>
            <tr class="theader">
                <td>姓名</td>
                <td @click="Rank('slide_num')">滑动样式</td>
                <td @click="Rank('text_num')">点击样式</td>
            </tr>
            <tr v-for="item in rankData">
                <td>{{item.user_name}}</td>
                <td>{{item.slide_num}}</td>
                <td>{{item.text_num}}</td>
            </tr>
        </table>
    </div>
</template>
        <script>
        import axios from "axios"
            export default {
                name: 'appRank',
                data(){
                    return {
                    token:'',
                    slider:'',
                    click:'',
                    testCenter:'',
                    check:'',
                    rank:'',
                    apiUrl:'',
                    rank:'text_num',
                    rankData:[],
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
                getInitRank (rank) {
                    this.token = this.getQueryValue('token');
                    axios.get("http://api.apiapp.cc/oreg/rank-list/?rank="+ rank +'&token='+this.token).then(
                        (res)=>{
                            if(res.data.code == 200){
                                this.rankData = res.data.data.page_data
                            }
                        }
                    )
                },
                Rank(type){
                      this.getInitRank(type)
                    }
            },
            computed: {

                },
            created (){
                this.token = this.getQueryValue("token")
                this.getInitRank('text_num')
            },
         }

</script>
<style scoped lang=less rel="stylesheet/less">
    #appRank {
        display: flex;
        flex-direction: column;
        align-items: center;
        a {
            display: flex;
            margin: 20px 30px;
        }
        table {
            border-collapse: collapse;
            color: #2a2a2a;
        }
        .theader{
            td {
                background-color: #eaeaea;
                cursor: pointer;
            }
        }
        td {
            border: 1px solid black;
            text-align: center;
            padding: 5px;
        }
    }
</style>
