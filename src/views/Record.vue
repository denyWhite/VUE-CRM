<template>
    <div>

        <div class="page-title">
            <h3>Новая запись</h3>
        </div>
        <Loader v-if="loading"/>
        <p v-else-if="!categories.length">Нужно сначала
            <router-link to="/categories">создать категорию</router-link>
        </p>
        <form class="form" v-else @submit.prevent="submitHandler">
            <div class="input-field">
                <select ref="select" v-model="category">
                    <option
                            v-for="c of categories"
                            :key="c.id"
                            :value="c.id"
                    >{{c.title}}
                    </option>
                </select>
                <label>Выберите категорию</label>
            </div>

            <p>
                <label>
                    <input
                            class="with-gap"
                            name="type"
                            type="radio"
                            value="income"
                            v-model="type"
                    />
                    <span>Доход</span>
                </label>
            </p>

            <p>
                <label>
                    <input
                            class="with-gap"
                            name="type"
                            type="radio"
                            value="outcome"
                            v-model="type"
                    />
                    <span>Расход</span>
                </label>
            </p>

            <div class="input-field">
                <input
                        id="amount"
                        type="number"
                        v-model.number="amount"
                        :class="{invalid: $v.amount.$dirty && !$v.amount.minValue}"
                >
                <label for="amount">Сумма</label>
                <span class="helper-text invalid" v-if="$v.amount.$dirty && !$v.amount.minValue">Значение должно быть больше  {{$v.amount.$params.minValue.min}}</span>
            </div>

            <div class="input-field">
                <input
                        id="description"
                        type="text"
                        v-model="description"
                        :class="{invalid: $v.description.$dirty && !$v.description.required}"
                >
                <label for="description">Описание</label>
                <span
                        class="helper-text invalid" v-if="$v.description.$dirty && !$v.description.required">Необходимо ввести описание</span>
            </div>

            <button class="btn waves-effect waves-light" type="submit">
                Создать
                <i class="material-icons right">send</i>
            </button>
        </form>
    </div>
</template>

<script>
    import {required, minValue} from 'vuelidate/lib/validators'
    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            categories: [],
            loading: true,
            select: null,
            category: null,
            type: 'income',
            amount: 1,
            description: ''
        }),
        async mounted() {
            this.categories = await this.$store.dispatch("fetchCategories")
            this.category = this.categories[0].id || null
            this.loading = false
            await this.$nextTick()
            this.select = window.M.FormSelect.init(this.$refs.select)
            window.M.updateTextFields()

        },
        computed: {
            // @todo Оператор спред
            ...mapGetters(['info']),
            canCreateRecord() {
                if (this.type == 'income') {
                    return true;
                }
                console.log(this.info.bill)
                return this.amount <= this.info.bill
            }
        },
        destroyed() {
            if (this.select && this.select.destroy)
                this.select.destroy()
        },
        validations: {
            amount: {minValue: minValue(1)},
            description: {required}
        },
        methods: {
            async submitHandler() {
                if (
                    this.$v.$invalid) {
                    this.$v.$touch()
                    return
                }
                if (this.canCreateRecord) {
                    const submitData = {
                        category: this.category,
                        type: this.type,
                        amount: this.amount,
                        description: this.description,
                        date: new Date().toJSON()
                    }
                    try {
                        await this.$store.dispatch('createRecord', submitData)
                        const bill = this.type === 'income'
                            ? this.info.bill + this.amount
                            : this.info.bill - this.amount
                        await this.$store.dispatch('updateInfo', {bill})
                        this.$message('Запись добавлена')
                        this.$v.reset
                        this.amount = 1
                        this.description = ''
                    } catch (e) {
                        console.log(e)
                    }
                }
                else {
                    this.$message(`Недостаточно средств на счете (${this.amount - this.info.bill})`)
                }

            }
        }
    }
</script>
