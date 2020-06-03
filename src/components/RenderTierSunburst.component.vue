<template>
    <div class="flex flex-col">
        <alert-large-graph-component v-if="alertLargeGraph" />

        <div class="flex flex-row bg-gray-200 py-4 rounded">
            <div class="w-3/5">
                <svg ref="tierSunburstChart" class="mx-auto" />
            </div>
            <div class="w-2/5 p-4 text-lg">
                <span v-if="trail.length">
                    <div>Tier: {{ trail[0].name }}</div>
                    <div># Annotations: {{ trail[0].children.length }}</div>
                </span>
                <div class="flex flex-col">
                    <div
                        v-for="(element, idx) of trail.slice(1)"
                        :key="idx"
                        class="my-2"
                    >
                        <div>
                            ID: {{ element.name }} VALUE:
                            {{ element.value }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { select, selectAll, event } from "d3-selection";
import { partition as d3partition, hierarchy } from "d3-hierarchy";
import { scaleOrdinal } from "d3-scale";
import { arc as d3arc } from "d3-shape";
import { zoom as d3zoom, zoomIdentity } from "d3-zoom";
import { interpolate } from "d3-interpolate";
import { quantize } from "d3-interpolate";
import { interpolateRainbow } from "d3-scale-chromatic";
import { format as d3format } from "d3-format";
import { transition, delay } from "d3-transition";
import { groupBy, debounce } from "lodash";
import DOM from "@observablehq/stdlib/src/dom";
import AlertLargeGraphComponent from "./AlertLargeGraph.component.vue";

export default {
    components: {
        AlertLargeGraphComponent,
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            debouncedRender: debounce(this.renderVisualisation, 1000),
            width: (window.innerWidth - 200) * 0.6,
            height: (window.innerWidth - 200) * 0.6,
            trail: [],
            maxResources: 1000,
            alertLargeGraph: false,
        };
    },
    watch: {
        data: function() {
            this.debouncedRender();
        },
    },
    mounted() {
        setTimeout(() => {
            this.setupVisualisation();
            this.renderVisualisation();
        }, 300);
    },
    methods: {
        setupVisualisation() {
            this.tierSunburstVisualisation = select(
                this.$refs["tierSunburstChart"]
            )
                .style("width", `${this.width}px`)
                .style("height", `${this.height}px`)
                .attr("font-size", 14)
                .attr("font-family", "sans-serif")
                .attr("text-anchor", "middle")
                .append("g")
                .on("mouseout", this.mouseout)
                .attr("viewBox", [0, 0, this.width, this.height])
                .attr(
                    "transform",
                    `translate(${this.width / 2}, ${this.height / 2})`
                );
        },
        renderVisualisation() {
            if (this.data.statistics.referenceAnnotations > this.maxResources) {
                this.alertLargeGraph = true;
            }
            var tierSunburstVisualisation = this.$refs["tierSunburstChart"];
            var duration =
                this.data.statistics.referenceAnnotations > this.maxResources
                    ? 0
                    : 750;
            this.tierSunburstVisualisation.selectAll("path").remove();

            // const radius = Math.min(this.width, this.height) / 2;
            const radius = Math.min(this.width, this.height) / 2;
            const format = d3format(",d");
            const color = scaleOrdinal(quantize(interpolateRainbow, 10));

            const arc = d3arc()
                .startAngle((d) => d.x0)
                .endAngle((d) => d.x1)
                .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
                .padRadius(radius / 2)
                .innerRadius((d) => d.y0)
                .outerRadius((d) => d.y1 - 1);

            const partition = (data) =>
                d3partition().size([2 * Math.PI, radius])(
                    hierarchy(data).count()
                );

            const root = partition(this.data.tiers);
            root.each((d) => (d.current = d));

            this.tierSunburstVisualisation
                .append("g")
                .selectAll("path")
                .data(root.descendants())
                .join("path")
                .attr("fill", (d) => {
                    const originalData = { ...d.data };
                    while (d.depth > 1) d = d.parent;
                    return originalData.value !== undefined
                        ? color(d.data.name)
                        : "#000";
                })
                .attr("d", (d) => arc(d.current));

            this.tierSunburstVisualisation
                .selectAll("path")
                .filter((d) => d.depth < 3)
                .style("cursor", "pointer")
                .on("click", clicked);

            this.tierSunburstVisualisation
                .selectAll("path")
                .style("cursor", "pointer")
                .on("mouseover", this.mouseover);

            const parent = this.tierSunburstVisualisation
                .append("circle")
                .datum(root)
                .attr("fill", "none")
                .attr("pointer-events", "all")
                .on("click", clicked);

            function clicked(p) {
                parent.datum(p.parent || root);

                root.each(
                    (d) =>
                        (d.target = {
                            x0:
                                Math.max(
                                    0,
                                    Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))
                                ) *
                                2 *
                                Math.PI,
                            x1:
                                Math.max(
                                    0,
                                    Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))
                                ) *
                                2 *
                                Math.PI,
                            y0: Math.max(0, d.y0 - p.depth),
                            y1: Math.max(0, d.y1 - p.depth),
                        })
                );

                const t = select(tierSunburstVisualisation)
                    .select("g")
                    .transition()
                    .duration(duration);

                // Transition the data on all arcs, even the ones that aren’t visible,
                // so that if this transition is interrupted, entering arcs will start
                // the next transition from the desired position.
                select(tierSunburstVisualisation)
                    .selectAll("path")
                    .transition(t)
                    .tween("data", (d) => {
                        const i = interpolate(d.current, d.target);
                        return (t) => (d.current = i(t));
                    })
                    .attrTween("d", (d) => () => arc(d.current));
            }
        },

        mouseover(node) {
            // if (!node.data.children.length) return;
            let nodes = node.ancestors().reverse();
            nodes.shift();
            this.trail = nodes.map((n) => n.data);

            if (this.data.statistics.referenceAnnotations > this.maxResources)
                return;

            // THIS IS VERY EXPENSIVE so we only come this far for small hierarchies
            // Fade all the segments.
            this.tierSunburstVisualisation
                .selectAll("path")
                .style("opacity", 0.3);

            // Then highlight only those that are an ancestor of the current segment.
            this.tierSunburstVisualisation
                .selectAll("path")
                .filter(function(n) {
                    return node.ancestors().indexOf(n) >= 0;
                })
                .style("opacity", 1);
        },

        mouseout() {
            if (this.data.statistics.referenceAnnotations < this.maxResources) {
                selectAll("path").style("opacity", 1);
            }
            this.trail = [];
        },
    },
};
</script>

<style lang="scss" scoped></style>
