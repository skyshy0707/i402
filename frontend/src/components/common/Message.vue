<script lang="ts">
    import { defineComponent } from 'vue'
    import messages from '../structures/messages'


    export default defineComponent({
        props: {
            message: String
        },
        data() {
            return {
                messages: messages,
                styleMessage: ''
            }
        },
        methods: {
            setStyleMessage(){
                var messageType
                const message = this.message

                for (let messageType of Object.keys(this.messages)){
                    var messagePattern = this.messages[messageType]
                    
                    if (message.match(messagePattern)){
                        this.styleMessage = messageType
                        return 
                    }
                }
                this.styleMessage = 'error'
            }
        },

        updated() {
            this.setStyleMessage()
        }
    })
        
</script>

<template>
    <div>
        <p :class="styleMessage">{{ message }}</p>
    </div>
</template>