<template>

    <div class="container">
        <Base>
        </Base>
        
    
        <div class="lesson">
            <button @click="getLesson" class="nav-btn">Unlock</button>

            <LessonData 
                :lesson="lesson" 
                :isDisabled="lockedPaymentContent" 
                :createLesson="false"
                class="form-field"
            >
            </LessonData>

            <form v-on:submit="getLesson" class="form-field">
                <input :hidden="lockedPayment" type="text" name="paySignature" v-model="paySignature" placeholder="Input your pay signature:" required/>
                <div class="pay-btn-container">
                    <button type="submit" :hidden="lockedPayment" class="create-btn">Pay</button>
                </div>
            </form>

            
            <Message
                :message="message"
            >
            </Message>
        </div>
    </div>
    
    
</template>

<script>

import axios from "axios"

axios.defaults.headers.get['Accepts'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, X-Payment';

import Base from '../common/Base.vue'
import LessonData from '../common/LessonData.vue'
import Message from '../common/Message.vue'

export default{
    name: 'lesson',
    components: {
        Base,
        LessonData,
        Message
    },
    data(){
        return { 
            lesson: {},
            lockedPaymentContent: true,
            lockedPayment: true,
            paymentDetails: {},
            paySignature: '',
            message: '',
            contentType: '',
        }
    },
    methods: {
        async getLesson(event=null){
            event ? event.preventDefault(): console.log('Try to load lesson open data')
            let id = this.$route.params.id
            this.paymentDetails.signature = this.paySignature
            let encryptedPaymentDetails = {}

            for (let key of Object.keys(this.paymentDetails)){
                encryptedPaymentDetails[key] = btoa(this.paymentDetails[key])
            }

            axios.defaults.headers.common['X-Payment'] = JSON.stringify(encryptedPaymentDetails)
            axios.get(
                `${this.$store.state.SERVER_BASE_URL}/lesson/${id}`,
            ).then((response) => {
                this.lesson = response.data.result
                this.lockedPaymentContent = false
                this.message = response.data.message
            }).catch((error) => {
                var paymentDetails = error.response.data.payment
                if (error.response.status == 402){
                    this.paymentDetails = paymentDetails.info
                    this.paymentDetails.price = paymentDetails.free.price
                    this.lesson = paymentDetails.free
                    this.lockedPayment = false
                    this.message = error.response.data.message
                }
                else this.message = error.message
            })
        },
    },
}
</script>