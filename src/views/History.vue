<template>
    <div>
        <div class="page-title">
            <h3>История записей</h3>
        </div>

        <div class="history-chart">
            <canvas ref="canvas"></canvas>
        </div>

        <Loader v-if="loading"/>
        <p class="center" v-else-if="!records.length">Нет записей</p>
        <section v-else>
            <HistoryTable :records="items"/>
            <Paginate :pageCount="pageCount"
                      :clickHandler="pageChangeHandler"
                      :prevText="'Предыдущая'"
                      :nextText="'Следущая'"
                      :containerClass="'pagination'"
                      v-model="page"

            />
        </section>
    </div>
</template>

<script>
import HistoryTable from '@/components/HistoryTable'
import paginationMixin from '@/mixins/pagination.mixin'
import {Pie} from 'vue-chartjs'

export default {
    name: 'history',
    extends: Pie,
    data: () => ({
        loading: true,
        records: [],
    }),
    async mounted() {
        this.records = await this.$store.dispatch('fetchRecords')
        const categories = await this.$store.dispatch('fetchCategories')

        this.setup(categories)
        this.loading = false
    },
    components: {
        HistoryTable
    },
    methods: {
        setup(categories) {
            this.setupPagination(this.records.map(
                rec => {
                    const categoryName = categories.find(c => c.id === rec.category).title
                    const typeClass = rec.type === 'income' ? 'green' : 'red'
                    const typeText = rec.type === 'income' ? 'Доход' : 'Расход'
                    return {...rec, categoryName, typeClass, typeText}
                }
            ))
            const chartdata = {
                labels: categories.map(c => c.title),
                    datasets: [
                    {
                        label: 'Расходы по категориям',
                        backgroundColor: ['#f87979', '#7979f8'],
                        data: categories.map(c => {
                            return this.records.reduce((total, r) => {
                                if (r.category === c.id && r.type == 'outcome') {
                                total += +r.amount
                            }
                            return total
                            }, 0)
                        })
                    }
                ]
            }
            const options  = {
                responsive: true,
                    maintainAspectRatio: false
            }
            this.renderChart(chartdata, options)
        }
    },
    mixins: [paginationMixin]


}
</script>