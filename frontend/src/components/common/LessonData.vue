<script lang="ts">

    import { defineComponent, PropType } from 'vue'
    import type LessonData from '../structures/annotations';

    export default defineComponent({
        props: {
            lesson: Object as PropType<LessonData>,
            isDisabled: Boolean,
            createLesson: Boolean
        },
        data(){
            return {
                contentType: {},
                selectedType: ''
            }
        },
        methods: {
            setContentType(event: any): void {
                let key = event.target.value 
                this.contentType = {}
                this.contentType[key] = true
                this.lesson.content_type = key as string
            },

            setFileContent(event: any): void {
               this.lesson.content_data = event.target.value as string | Text
               this.$emit('setting-file', this.$refs.file)
            }
        },

        mounted(){
            
            let contentType = this.lesson.content_type as string
            if (contentType){
                this.contentType[contentType as string] = true
            }
        }
    })
</script>

<template>
    <div class="">
        <input v-if="lesson.id" type="text" name="id" :value="lesson.id" hidden/>
        <input type="text" name="title" v-model="lesson.title" :disabled="isDisabled" placeholder="title:" required/>
        <textarea type="textarea" name="description" v-model="lesson.description" :disabled="isDisabled" placeholder="description:" required></textarea>
        <input type="number" name="price" v-model="lesson.price" :disabled="isDisabled" placeholder="price in USDC:" required/>
   

        <div v-if="createLesson" style="margin-top: 0.2em">
  
            <div class="radio-select">
                <label for="pdf">Pdf&nbsp;&nbsp;</label>
                <input type="radio" @change="setContentType($event)" name="content_type" value="pdf" id="pdf" style="vertical-align: middle"/>
            </div>
            <div class="radio-select">
                <label for="video">Video</label>
                <input type="radio" @change="setContentType($event)" name="content_type" value="video" id="video" style="vertical-align: middle"/>
            </div>
            <div class="radio-select">
                <label for="text">Text&nbsp;</label>
                <input type="radio" @change="setContentType($event)" name="content_type" value="text" id="text"/>
                
            </div>
            <div class="radio-select">
                <label for="url">Url&nbsp;&nbsp;</label>
                <input type="radio" @change="setContentType($event)" name="content_type" value="url" id="url"/>
            </div>
        </div>
        

        
        <iframe v-if="!createLesson" :src="lesson.content_data" :disabled="isDisabled" width="100%" allowfullscreen="true" style="aspect-ratio: 16/9"></iframe>
        

        <div class="panel">
            <input v-if="contentType.pdf" type="file" accept="application/pdf" name="content_data" ref="file" required @change="setFileContent"/>
            <input v-if="contentType.video"  type="file" accept="video/mpeg, video/mp2t, video/mp4, video/ogg, video/webm" name="content_data" ref="file" required @change="setFileContent"/>
            <textarea v-if="contentType.text" type="textarea" name="content_data" v-model="lesson.content_data" required></textarea>
            <input v-if="contentType.url" type="url" name="content_data" v-model="lesson.content_data" required/>
        </div>
        

    </div>

    
</template>