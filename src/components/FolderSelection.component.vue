<template>
    <div>
        <el-card class="box-card">
            <div slot="header">
                Select a folder of EAF files to get started.
            </div>
            <div class="w-full">
                <el-button @click="selectFolder">
                    <i class="fas fa-folder-open"></i>
                    select folder
                </el-button>
                <span v-show="selectedFolder.name">{{
                    selectedFolder.name
                }}</span>
            </div>
            <div class="w-full mt-4" v-if="progress">
                <el-progress :percentage="progress"></el-progress>
            </div>
        </el-card>
    </div>
</template>

<script>
import { uniq, round } from "lodash";
import { remote } from "electron";
const dialog = remote.dialog;

export default {
    data() {
        return {};
    },
    computed: {
        folders: function() {
            return this.$store.state.dataFolders;
        },
        selectedFolder: function() {
            return this.$store.state.selectedFolder;
        },
        progress: function() {
            let percentage = round(
                (this.$store.state.processing.current /
                    this.$store.state.processing.total) *
                    100
            );
            return percentage;
        },
    },
    mounted() {},
    methods: {
        async selectFolder() {
            let folder = await dialog.showOpenDialog({
                properties: ["openDirectory"],
            });
            folder = folder.filePaths.map((f) => {
                return { name: f };
            });
            if (folder.length) {
                this.$store.commit("setSelectedFolder", folder[0]);
                this.$store.dispatch("processFolder");
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.style-selected-folder-icon {
    color: green;
}
</style>
