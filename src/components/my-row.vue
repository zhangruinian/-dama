<template>
    <tr>
        <td>
            <div class="crown" v-if="index==0"></div>
            <div class="sliver" v-if="index==1"></div>
            <div class="confused" v-if="index==length-1"></div>
            {{index+1}}
        </td>
        <td>{{name}}</td>
        <td>{{animatedNum}}</td>
    </tr>
</template>

<script>
    import TWEEN from '../libs/tween'
    export default{
        data() {
            return {
                animatedNum: 0
            }
        },
        props: {'name':{}, 'num':{default:0}, 'index':{},length:{}},
        computed: {
            serverUrl(){
                return process.env.NODE_ENV === 'production' ? 'http://192.168.1.200:8011' : 'http://192.168.1.71:8009'
            },

        },
        methods: {},
        watch: {
            num: function (newValue, oldValue) {
                var vm = this;

                function animate(time) {
                    requestAnimationFrame(animate)
                    TWEEN.update(time)
                }

                new TWEEN.Tween({tweeningNumber: oldValue})
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .to({tweeningNumber: newValue}, 4000-vm.index*100)
                    .onUpdate(function () {
                        vm.animatedNum = this.tweeningNumber.toFixed(0)
                    })
                    .start()
                animate()
            }
        },
        mounted(){
            var vm = this;

            function animate(time) {
                requestAnimationFrame(animate)
                TWEEN.update(time)
            }
            if(vm.index==0){
                var time=4000
            }
            else {
                var time=3000-vm.index*100
            }
            new TWEEN.Tween({tweeningNumber: vm.animatedNum})
                .easing(TWEEN.Easing.Quadratic.Out)
                .to({tweeningNumber: vm.num}, time)
                .onUpdate(function () {
                    vm.animatedNum = this.tweeningNumber.toFixed(0)
                })
                .start()
            animate()
        }

    };
</script>

<style lang=less rel="stylesheet/less">
    .crown {
        width: 30px;
        height: 30px;
        position: absolute;
        background-image: url(../assets/crown.jpg);
        background-repeat: no-repeat;
        left: 0;
        background-size: 100% 100%;
        transform: translateX(-100%);
    }
    .sliver{
        width: 30px;
        height: 30px;
        position: absolute;
        background-image: url(../assets/sliver.png);
        background-repeat: no-repeat;
        left: 0;
        background-size: 100% 100%;
        transform: translateX(-100%);
    }
    .confused{
        width: 35px;
        height: 35px;
        position: absolute;
        background-image: url(../assets/confuse.gif);
        background-repeat: no-repeat;
        left: 0;
        background-size: 100% 100%;
        transform: translateX(-100%);
    }
</style>
