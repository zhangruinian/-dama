<template>
    <div class="cell"
         :class="{right:result=='right',wrong:result=='wrong',notfit:result=='notfit'}"
         :style="{width:width+'px',height:height+'px'}">
        <div class="cellBody">
            <div class="imgWrapper">
                <div class="img"
                     :style="{backgroundImage:'url('+src+')'}">
                    {{index+1}}
                </div>
            </div>
            <div class="optionsWrapper">
                <label>
                    <input type="radio"
                           value="right"
                           v-model="result"
                           :name="index"
                           @keydown.prevent
                           @click="changeResult($event.target.value,index)"
                    >
                    对
                </label>
                <label>
                    <input type="radio"
                           value="wrong"
                           v-model="result"
                           :name="index"
                           @keydown.prevent
                           @click="changeResult($event.target.value,index)"
                    >
                    错
                </label>
                <!--<label v-if="!isAdmin">
                    <input type="radio"
                           value="notfit"
                           v-model="result"
                           :name="index"
                           @keydown.prevent
                           @click="changeResult($event.target.value,index)"
                    >
                    不合适
                </label>-->
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        props: {
            imgDetail: {type: Object, required: true},
            index: Number,
            width: Number,
            height: Number,
            user:{type: [Number,String], required: true},
        },
        /*data(){
         },*/
        computed: {
            src(){
                return this.imgDetail.pic_path
            },
            result(){
                return this.imgDetail.result
            },
            isAdmin(){
                return parseInt(this.user)===3
            }
        },
        methods: {
            changeResult(value,index) {
                this.$emit('changeResult', value,index)
            }
        }
    };
</script>

<style lang=less rel="stylesheet/less">
    .cell {
        /*display: flex;
        justify-content: space-around;
        align-items: center;*/
        display: block;
        position: relative;
        width: 320px;
        height: 240px;

        border: 1px solid #aaa;
        margin-bottom: -1px;
        user-select: none;
        .cellBody {
            display: flex;
            position: absolute;
            top: 10px;
            bottom: 10px;
            left: 10px;
            right: 10px;
            //background-color: lightblue;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            .imgWrapper {
                /*flex:auto;*/
                height: 110px;
                width: 100%;
                .img {
                    width: 100%;
                    height: 100%;
                    background-position: center;
                    background-size: contain;
                    background-repeat: no-repeat;
                }
            }
            .optionsWrapper {
                padding-left: 20px;
                display: flex;
                justify-content: center;
                flex: auto;
                width: 100%;
                label {
                    flex: auto
                }
            }
        }

        &.right {
            background-color: #5ebf70;
        }
        &.wrong {
            background-color: #de715b;
        }
        &.notfit {
            background-color: #cccccc;
        }
    }
</style>
