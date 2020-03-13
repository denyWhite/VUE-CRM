<template>
    <div>
        <Loader v-if="loading"/>
        <div v-else-if="record">
            <div class="breadcrumb-wrap">
                <a @click.prevent class="breadcrumb">История</a>
                <a class="breadcrumb">
                    {{record.typeText}}
                </a>
            </div>
            <div class="row">
                <div class="col s12 m6">
                    <div class="card">
                        <div class="card-content white-text" :class="[record.typeClass]">
                            <p>Описание: {{record.description}}</p>
                            <p>Сумма: {{record.amount | currency('RUB')}}</p>
                            <p>Категория: {{record.categoryName}}</p>
                            <small>{{record.date | date('date')}}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <p class="center" v-else>Запись не обнаружена</p>
    </div>
</template>

<script>

    export default {
        name: 'detail',
        data: () => ({
            record: null,
            loading: true,
        }),
        async mounted() {
            const id = this.$route.params.id
            const record = await this.$store.dispatch('fetchRecordById', id)
            if (record.amount) {
                const category = await this.$store.dispatch('fetchCategoryById', record.category)
                this.record = {
                    ...record,
                    categoryName: category.title,
                    typeClass: record.type == 'income' ? 'green' : 'red',
                    typeText: record.type == 'income' ? 'Доход' : 'Расход'
                }
            }
            this.loading = false
        }

    }
</script>
