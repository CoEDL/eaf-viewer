<template>
    <div class="flex flex-col">
        <div class="flex flex-col" v-if="release">
            <div class="md:text-3xl text-center">
                Download the latest EAF Viewer release for your platform.
                <div class="text-sm">
                    The EAF Viewer is an application designed for your desktop
                    so it won't work on your phone or tablet.
                </div>
            </div>
            <div class="mt-10 flex flex-row justify-around">
                <div class="hover:text-orange-600">
                    <a :href="releaseUrl('windows')">
                        <i class="fab fa-windows fa-6x"></i>
                    </a>
                </div>
                <div class="hover:text-orange-600">
                    <a :href="releaseUrl('mac')">
                        <i class="fab fa-apple fa-6x"></i>
                    </a>
                </div>
                <div class="hover:text-orange-600">
                    <a :href="releaseUrl('linux')">
                        <i class="fab fa-linux fa-6x"></i>
                    </a>
                </div>
            </div>
        </div>
        <div class="mt-8 text-base text-center">
            <div>
                Check out available releases @
                <a
                    href="https://github.com/coedl/eaf-viewer/releases"
                    target="_blank"
                    class="text-orange-600"
                    >https://github.com/coedl/eaf-viewer/releases</a
                >
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            release: {},
            latestReleaseURL:
                "https://api.github.com/repos/coedl/eaf-viewer/releases/latest",
        };
    },
    async mounted() {
        try {
            let response = await fetch(this.latestReleaseURL);
            if (response.status !== 200) {
                return;
            }
            this.release = await response.json();
        } catch (error) {
            this.release = undefined;
        }
    },
    methods: {
        releaseUrl: function(platform) {
            switch (platform) {
                case "windows":
                    return `https://github.com/coedl/eaf-viewer/releases/download/${this.release.tag_name}/EAF-Viewer-Setup-${this.release.name}.exe`;
                    break;
                case "mac":
                    return `https://github.com/coedl/eaf-viewer/releases/download/${this.release.tag_name}/EAF-Viewer-${this.release.name}.dmg`;
                    break;
                case "linux":
                    return `https://github.com/coedl/eaf-viewer/releases/download/${this.release.tag_name}/pdsc-eaf-viewer-${this.release.name}.tar.bz2`;
                    break;
            }
        },
    },
};
</script>
