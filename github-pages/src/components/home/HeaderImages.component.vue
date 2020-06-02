<template>
    <div class="flex flex-col items-center">
        <div class="flex flex-row items-center">
            <div class="hover:text-orange-700" @click="previousItem()">
                <i class="fas fa-chevron-left fa-2x"></i>
            </div>
            <div class="flex-col">
                <div><img :src="currentImage.file" /></div>
                <div class="text-center">{{ currentImage.text }}</div>
            </div>
            <div class="hover:text-orange-700" @click="nextItem()">
                <i class="fas fa-chevron-right fa-2x"></i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentImageIndex: 0,
            images: [
                {
                    file: "images/01-load-folder.webp",
                    text: "Select a folder of EAF files to view.",
                },
                {
                    file: "images/02-view-statistics.webp",
                    text: "View content statistics.",
                },
                {
                    file: "images/03-visualise-tiers.webp",
                    text: "Visualise the hierarchy starting from the tiers.",
                },
                {
                    file: "images/04-visualise-timeslots.webp",
                    text:
                        "Visualise the hierarchy starting from the timeslots.",
                },
                {
                    file: "images/05-drilldown.webp",
                    text: "Drilldown into the data.",
                },
                {
                    file: "images/06-drilldown.webp",
                    text: "Drilldown into the data.",
                },
            ],
        };
    },
    computed: {
        currentImage: function() {
            return this.images[this.currentImageIndex];
        },
    },
    methods: {
        previousItem() {
            this.currentImageIndex =
                this.currentImageIndex === 0
                    ? this.images.length - 1
                    : this.currentImageIndex - 1;
        },
        nextItem() {
            this.currentImageIndex =
                this.currentImageIndex < this.images.length - 1
                    ? this.currentImageIndex + 1
                    : 0;
        },
    },
};
</script>

<style lang="scss" scoped>
.style-image {
    width: 500px;
}
</style>
