"use strict";

import { readdir, readFile } from "fs-extra";
import path from "path";
import { Parser } from "@coedl/transcription-parsers";

export async function processFolder({ folder, commit }) {
    let files = await readdir(folder.name);

    let index = [];
    let data;
    for (let [idx, file] of files.entries()) {
        commit("setProcessingStatus", {
            current: idx,
            total: files.length,
            file: file,
        });
        try {
            data = await readFile(path.join(folder.name, file), "utf-8");
            // console.log(data);
            let parser = new Parser({
                name: file,
                data,
            });
            data = await parser.parse();
        } catch (error) {
            data = {
                tiers: [],
                timeslots: [],
                statistics: {},
                errors: [{ msg: "Invalid XML file" }],
            };
        }
        index.push({ file, ...data });
        await new Promise((resolve) => {
            setTimeout(resolve, 150);
        });
    }

    commit("setProcessingStatus", {
        current: undefined,
        total: undefined,
        file: undefined,
    });
    commit("storeIndex", index);
}

export async function loadIndex({ store }) {
    const index = (await get(mapRepositoryRoot("/repository/index.json")))
        .statistics;
    store.commit(`saveIndex`, { index });

    async function get(path) {
        try {
            let response = await fetch(path);
            if (response.status !== 200) {
                throw new Error(response);
            }
            return await response.json();
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

export async function loadFileData({ dataFile }) {
    let response = await fetch(mapRepositoryRoot(dataFile));
    if (response.status !== 200) {
        throw new Error(response);
    }
    let data = await response.json();
    return data;
}

export function mapRepositoryRoot(path) {
    const root =
        process.env.NODE_ENV === "development"
            ? "/repository"
            : "/eaf-viewer/repository";
    return path.replace("/repository", root);
}
