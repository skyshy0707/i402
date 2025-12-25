<template>

    <div class="container">
        <Base>
        </Base>
        <span class="lessons lesson-data-tb">
            <span>Title</span>
            <span>Description</span>
            <span>Cost</span>
        </span>
        <div class="lessons">
            
            <ul class="pagination-list" style="margin-bottom: 40px; margin-top: 1em">
                <li 
                    v-for="lessonItem in lessons" 
                        :key="lessonItem.id" 
                        class="lesson-item"
                >
                    <span>{{ lessonItem.title }}</span>
                    <span>{{ lessonItem.description }}</span>
                    <span>{{ lessonItem.price }}</span>
                    <a :href="lessonItem.url" role="button" class="act-btn">View</a>
                </li> 
            </ul>
            <div @click="paginate($event, total)" class="stats">
                <button class="robot-action-btn">1</button>
                <button class="robot-action-btn"><</button>
                <button class="robot-action-btn">></button>
                <button class="robot-action-btn">⇲</button>
            </div>
        </div>
        <div class="new-lesson">
            <button @click="switchCreateLessonForm" type="button" class="">+</button>
            <form v-on:submit="createLesson" v-if="createLessonVisible" enctype="multipart/form-data" class="form-field">
                <LessonData 
                    :lesson="newLesson" 
                    :isDisabled="!createLessonVisible" 
                    :createLesson="true" 
                    @settingContentType="setContentType"  
                    @setting-file="setFile">
                </LessonData>
                <div class="create-btn-container">
                    <button type="submit" class="create-btn">Create</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from "axios"

axios.defaults.headers.get['Accepts'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://127.0.0.1:9001'
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, X-Payment'

import Base from '../common/Base.vue'
import LessonData from '../common/LessonData.vue'
import styles from '../../assets/index.css'

export default {
    name: 'dashboard',
    components: {
        Base,
        LessonData
    },

    data(){
        return {
            empty: '',
            lessons: [],
            newLesson: {},
            authorEmail: '',
            currentOffset: 0,
            offsetStep: 10,
            total: 0,
            createLessonVisible: false,
            message: ''
        }
    },

    methods: {
        async paginate(event, total){
            event.preventDefault()
            let paginateWay = event.target.innerText

            if (paginateWay == '>' && (this.currentOffset + this.offsetStep) < total ){
                this.currentOffset += this.offsetStep
            }
            else if (paginateWay =='<' && this.currentOffset > 0){
                this.currentOffset -= this.offsetStep
            }
            else if (paginateWay == '⇲'){
                this.currentOffset = total > (this.currentOffset + this.offsetStep) ? 
                    Math.floor(total/this.offsetStep) * this.offsetStep : this.currentOffset
            }
            else if (paginateWay == '1'){
                this.currentOffset = 0
            }
            this.lessons = await this.getLessons(this.currentOffset)
        },
        switchCreateLessonForm(event){
            event.preventDefault()

            this.createLessonVisible = !this.createLessonVisible
            if (this.createLessonVisible){
                event.target.innerText = "-"
            }
            else event.target.innerText = "+"
            
        },

        async getLessons(offset=0){
            let response

            try{
                response = await axios.get(
                    `${this.$store.state.SERVER_BASE_URL}/lessons`,
                    {
                        params: {
                            offset: offset
                        }
                    }
                )
            }
            catch (error){
                let errorData = JSON.stringify(error.response.data)
                console.log(`Details: ${errorData}`)
            }
            this.total = response.data.total
            return response ? response.data.items : {}
        },
        /*For debug to get some user id*/
        getAuthorByEmail(email){
            return { id: 6 }
        },
        async createLesson(event){
            event.preventDefault()
            this.newLesson.author_id = this.getAuthorByEmail(this.authorEmail).id
            axios.post(
                `${this.$store.state.SERVER_BASE_URL}/lesson/create`,
                this.newLesson
            ).then(
                (response) => {
                    this.message = `A new with id=${response.data.id} was created`
                    this.newLesson.title = ''
                    this.newLesson.description = ''
                    this.newLesson.price = ''
                    this.newLesson.content_type = ''
                    this.newLesson.content_body = ''
                }
            ).catch(
                (error) => { 
                    let errorData = JSON.stringify(error.response.data)
                    console.log(`Detail: ${errorData}`)
                }
            )
        },
        setContentType(type){
            this.contentType = type
        },
        setFile(ref){
            this.newLesson.content_data = ref.files[0]
        }
    },
    async mounted(){
        this.lessons = await this.getLessons()
    }
}
</script>