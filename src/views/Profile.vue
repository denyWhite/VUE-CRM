<template>
    <div>
        <div class="page-title">
            <h3>{{'ProfileTitle' | localize }}</h3>
        </div>

        <form class="form" @submit.prevent="submitHandler">
            <div class="input-field">
                <input
                        id="description"
                        type="text"
                        v-model="name"
                        :class="{invalid: $v.name.$dirty && !$v.name.required}"
                >
                <label for="description">{{ 'Name' | localize}}</label>
                <small
                        class="helper-text invalid"
                        v-if="($v.name.$dirty && !$v.name.required)"
                >{{'EnterName' | localize}}
                </small>
            </div>

            <div class="switch">
                <label>
                    English
                    <input type="checkbox" v-model="isRuLocale">
                    <span class="lever"></span>
                    Русский
                </label>
            </div>


            <button class="btn waves-effect waves-light" type="submit">
                {{ 'Update' | localize }}
                <i class="material-icons right">send</i>
            </button>
        </form>
    </div>
</template>
<style scoped>
    .switch {margin-bottom: 2em;}
</style>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import { required } from 'vuelidate/lib/validators'


    export default {
        metaInfo() {
            return {
            title: this.$title('ProfileTitle')
        }
        },
        data: () => ({
            name: '',
            isRuLocale: true
        }),
        computed: {
            ...mapGetters(['info'])
        },
        validations: {
            name: { required }
        },
        mounted() {
            this.name = this.info.name
            this.isRuLocale = this.info.locale === 'ru-RU'
            setTimeout(() => {
                window.M.updateTextFields()
            })

        },
        methods: {
            ...mapActions(['updateInfo']),
            async submitHandler() {
                const submitData = {
                    name: this.name,
                    locale: this.isRuLocale ? 'ru-RU' : 'en-US'

                }
                if (this.$v.$invalid) {
                    this.$v.$touch()
                    return
                }
                try
                {
                   await this.updateInfo(submitData)
                } catch (e) {
                    console.log(e)
                }

            }
        }

    }

</script>
