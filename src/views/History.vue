<template>
    <div>
        <div class="page-title">
            <h3>История записей</h3>
        </div>

        <div class="history-chart">
            <canvas></canvas>
        </div>

        <Loader v-if="loading"/>
        <p class="center" v-else-if="!records.length">Нет записей</p>
        <section v-else>
            <HistoryTable :records="records"/>
        </section>
    </div>
</template>

<script>
import HistoryTable from '@/components/HistoryTable'

export default {
    name: 'history',
    data: () => ({
        loading: true,
        records: [],
        categories: []
    }),
    async mounted() {
        const records = await this.$store.dispatch('fetchRecords')
        this.categories = await this.$store.dispatch('fetchCategories')
        this.records = records.map(
            rec => {
                const categoryName = this.categories.find(c => c.id === rec.category).title
                const typeClass = rec.type === 'income' ? 'green' : 'red'
                const typeText = rec.type === 'income' ? 'Доход' : 'Расход'
                return {...rec, categoryName, typeClass, typeText}
            }
        )
        this.loading = false
    },
    components: {
        HistoryTable
    }

}
</script>