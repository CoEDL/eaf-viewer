<template>
    <div class="mx-auto font-mono p-4">
        <folder-selection-component />
        <el-card class="px-6 mt-4" v-if="Object.keys(index).length">
            <div slot="header">
                File Statistics
                <p class="text-gray-600">
                    Click on a row to see the list of issues discovered in that
                    file and view a visualisation of the structure.
                </p>
            </div>
            <render-data-table-component v-on:row-selected="loadFile" />
        </el-card>
        <span id="top"></span>
        <div
            class="mt-4 p-4 border-gray-200 bg-white border-2 rounded"
            v-if="!loading && selection.file && index.length"
        >
            <div>{{ selection.file }}</div>
            <el-tabs v-model="activeTab">
                <el-tab-pane label="" name="tiers">
                    <span slot="label" class="text-gray-800 font-light">
                        Visualise Tiers
                    </span>
                    <div class="flex flex-col" v-if="activeTab === 'tiers'">
                        <div class="p-4 text-gray-800">
                            This visualisation depicts the tiers and annotations
                            found in the file. The first ring (from the centre)
                            has a block for each tier. Selecting one of the
                            tiers will zoom the visualisation to show only that
                            tier and its associated annotations. To zoom back
                            out, select the central node.
                        </div>
                        <render-tier-sunburst-component
                            :data="selection.tiers"
                        />
                    </div>
                </el-tab-pane>
                <el-tab-pane label="Visualise Timeslots" name="timeslots">
                    <span slot="label" class="text-gray-800 font-light">
                        Visualise Timeslots
                    </span>
                    <div class="flex flex-col" v-if="activeTab === 'timeslots'">
                        <div class="p-4 text-gray-800">
                            This visualisation depicts the timeslots and
                            annotations found in the file. The first ring (from
                            the centre) has a block for each timeslot. Selecting
                            one of the timeslots will zoom the visualisation to
                            show only that timeslot and its associated
                            annotations. To zoom back out, select the central
                            node.
                        </div>
                        <render-timeslot-sunburst-component
                            :data="selection.timeslots"
                        />
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { loadFileData } from "../renderer/data-loader.service.js";
import RenderDataTableComponent from "./RenderDataTable.component.vue";
import RenderIssuesComponent from "./RenderIssues.component.vue";
import RenderTimeslotSunburstComponent from "./RenderTimeslotSunburst.component.vue";
import RenderTierSunburstComponent from "./RenderTierSunburst.component.vue";
import FolderSelectionComponent from "./FolderSelection.component.vue";
import VueScrollTo from "vue-scrollto";

export default {
    components: {
        FolderSelectionComponent,
        RenderDataTableComponent,
        RenderIssuesComponent,
        RenderTimeslotSunburstComponent,
        RenderTierSunburstComponent,
    },
    data() {
        return {
            selection: {},
            showErrors: false,
            loading: false,
            activeTab: "tiers",
        };
    },
    computed: {
        index: function() {
            return this.$store.state.index;
        },
    },
    mounted() {},
    methods: {
        async loadFile(item) {
            this.loading = true;
            this.selection = {};
            setTimeout(async () => {
                this.selection = item;
                this.loading = false;
                VueScrollTo.scrollTo("#top", 1000);
            }, 1000);
        },
    },
};
</script>

<style scoped lang="scss"></style>
