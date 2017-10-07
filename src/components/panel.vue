<template>
    <div class="panel">
        <table>
            <tbody>
            <tr>
                <td colspan="2" id="head">热键表</td>
            </tr>
            <tr>
                <td>对</td>
                <td>{{convert(rightKeyCode)}}</td>
            </tr>
            <tr>
                <td>错</td>
                <td>{{convert(wrongKeyCode)}}</td>
            </tr>
            <tr>
                <td>提交</td>
                <td>{{convert(submitKeyCode)}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default{
        props: {
            rightKeyCode:{
                type:Number,
                default:81
            },
            wrongKeyCode:{
                type:Number,
                default:87
            },
            notfitKeyCode: {
                type:Number,
                default:69
            },
            submitKeyCode:{
                type:Number,
                default:13
            }
        },
        /*data(){
         },*/
        computed: {
        },
        methods: {
            changeResult(value, index) {
                this.$emit('changeResult', value, index)
            },
            convert(value){
                switch (value){
                    case 13:return 'ENTER';
                    break;
                    default:return String.fromCharCode(value)
                }

            }
        }
    };
</script>

<style lang=less rel="stylesheet/less">
.panel{
    font-family: "Microsoft YaHei UI";

    position: absolute;
    left: 50px;
    top: 50px;
    table{
        border-collapse: collapse;
        #head{
            text-align: center;
            color: black;
        }
    }
    td{
        border: 5px solid black;
        background-color: lightblue;
        &:last-child{
            color: red;
        }
    }
}
</style>
