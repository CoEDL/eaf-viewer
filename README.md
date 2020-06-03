> ## Users should get a pre-built bundle from [https://coedl.github.io/eaf-viewer/](https://coedl.github.io/eaf-viewer/)


- [EAF Viewer](#eaf-viewer)
  - [Developing the application](#developing-the-application)
  - [Vue application](#vue-application)
- [Building a release](#building-a-release)
  - [Requirements](#requirements)
  - [Building and publishing a complete release](#building-and-publishing-a-complete-release)
  - [Building a release for local testing of the bundle](#building-a-release-for-local-testing-of-the-bundle)
  - [Building a Linux release](#building-a-linux-release)
  - [Building MacOS releases](#building-macos-releases)
    - [Requirements](#requirements-1)
    - [DO THIS FIRST](#do-this-first)
  - [Building Windows releases](#building-windows-releases)
  - [Code signing](#code-signing)
  - [Electron webpack](#electron-webpack)
- [Updating github pages](#updating-github-pages)

# EAF Viewer

An application to process a folder of EAF files and visualise file statistics to reveal incomplete files and missing data.

This is an electron application.

## Developing the application

```
> npm run install
> npm run develop
```

## Vue application

The application itself is built using VueJS, Vue Router and Vuex. See the respective sites for more
information.

# Building a release

## Requirements

In order to build a release for Windows, Mac and Linux you will need:

-   to run the build on a Mac - you can't build for MacOS anywhere else;
-   docker installed as that's how the Windows build is done;
-   a `Github Personal Access Token` in order to push the release to the release page of the repo;
-   completed the extra steps in the sections [Building MacOS releases - Requirements](#requirements) and [Building MacOS releases - DO THIS FIRST](#do-this-first).

## Building and publishing a complete release

To build a release for all platforms run from the root of the repo `./bin/publish.sh`. This will:

-   ask you for your apple developer id, app specific password for eaf-viewer and github personal access token.
-   ask if you want to bump the major, minor, patch numbers
-   build the 3 distributables and publish each release to the `releases` page of the repository

Once the release is published you then need to verify the draft and release it from the releases page of the describo github repository.

## Building a release for local testing of the bundle

You can build a release for testing by simply running one of the following commands (obviously choose the one for your platform)

-   Build for linux: `npm run build:linux`
-   Build for mac: `npm run build:mac`
-   Build for windows: `npm run build:win`

The built executable will be in the `dist` folder at the top level.

## Building a Linux release

There are no special requirements to building a linux bundle.

## Building MacOS releases

### Requirements

You will need an Apple developer certificate to sign the release as well as an app specific password. To set up the
app specfic password follow the instructions at [https://support.apple.com/en-au/HT204397](https://support.apple.com/en-au/HT204397)

Ensure you have xcode installed as the notarization stage uses a tool called `altool` that comes
with xcode full not xcode command line tools.

-   export APPLEID= < your apple developer id - you must have an apple developer cert >
-   export APPLEIDPASS= < app specific password >

### DO THIS FIRST

There is a bug in electron-builder where a zip file is required for autoupdate to work but the code to generate
it results in a bundle that doesn't work on Catalina! So, you need to apply the following patch to
`node_modules/app-builder-lib/out/targets/ArchiveTarget.js`.

```
diff --git a/ArchiveTarget.js.orig b/ArchiveTarget.js
index 72a59df..f872592 100644
--- a/ArchiveTarget.js.orig
+++ b/ArchiveTarget.js
@@ -119,9 +119,9 @@ class ArchiveTarget extends _core().Target {
       };
       await (0, _archive().archive)(format, artifactPath, dirToArchive, archiveOptions);

-      if (this.isWriteUpdateInfo && format === "zip") {
-        updateInfo = await (0, _differentialUpdateInfoBuilder().appendBlockmap)(artifactPath);
-      }
+        //if (this.isWriteUpdateInfo && format === "zip") {
+        //updateInfo = await (0, _differentialUpdateInfoBuilder().appendBlockmap)(artifactPath);
+        //}
     }

     await packager.info.callArtifactBuildCompleted({

```

MacOS releases can only be built on MacOS.

## Building Windows releases

Like the MacOS release a developer certificate is required to sign the app but (I think) Windows doesn't stop anyone running an unsigned application.

Also, you'll need docker installed as the Windows build happens inside a docker container.

## Code signing

See https://www.electron.build/code-signing for information about code signing.

## Electron webpack

This application is built using [electron builder](https://www.electron.build/) and
[electron-webpack](https://webpack.electron.build/). See the respective links if you need to
alter the configuration.

# Updating github pages

The [github pages site](https://coedl.github.io/eaf-viewer/) is contained within the folder `github-pages`
at the root of the repo. This is another VueJS site and it's contained within this folder. So, you make changes
in this folder, build a release and then commit the updated content in docs and push to update the site.

If you want to update the site do the following

```
// Start up the dev server
> cd github-pages
> npm run serve

// open up http://localhost:8080 in your browser

// update the site content

```

When you're done and want to build a new version do:

```
> cd github-pages
> npm run build
```

This will create a built version of the site in the docs folder which you can then commit
and push in order to update the github pages online version.
