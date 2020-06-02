<template>
    <div class="flex flex-row space-x-4 md:space-x-8 border-b-2 pb-2">
        <div>
            <a href="https://www.dynamicsoflanguage.edu.au" target="_blank">
                <img src="images/coedl-logo.png" class="h-10 md:h-12 lg:h-16" />
            </a>
        </div>
        <div class="flex-grow"></div>
        <div>
            <a
                href="https://github.com/coedl/eaf-viewer"
                target="_blank"
                class="hover:text-orange-600"
                ><i class="fab fa-github"></i> github</a
            >
        </div>
        <div class="hidden md:block">
            <a
                href="https://github.com/coedl/eaf-viewer/issues"
                target="_blank"
                class="hover:text-orange-600"
                >issues</a
            >
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    computed: {
        activeRoute: function() {
            return this.$route.name;
        },
    },
};
</script>
