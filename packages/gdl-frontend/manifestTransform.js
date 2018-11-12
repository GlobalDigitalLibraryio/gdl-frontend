const { join } = require('path');
const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

/**
 * Workbox option for manifest transforms doesn't apply to assets generated by webpack.
 * This is something we want to do because we need to alter the URLs, and we also want to filter
 * the precache files.
 *
 * This is a small webpack plugin workaround that grabs the generated preache manifest so we can transform
 * and overwrite it.
 *
 * This will probably be fixed in version 4 (https://github.com/GoogleChrome/workbox/issues/1591) of workbox,
 * at which point we can probably move the transform into the workbox config and get rid of this workaround.
 */
class ManifestTransform {
  constructor(config) {
    this.opts = {
      ...config
    };
  }

  apply(compiler) {
    compiler.plugin('after-emit', (compilation, callback) => {
      // Get the file name of the precache manifest, which could be something like precache-manifest.1ac8b3f45e2b32ffd94ab14e23039ca5.js
      const [manifestFilename] = Object.keys(compilation.assets).filter(k =>
        k.startsWith('precache-manifest.')
      );

      this.opts.outputPath = compiler.options.output.path;
      this.opts.manifestFilename = manifestFilename;

      callback();
    });

    compiler.plugin(
      'done',
      async compilation => {
        // Read the content of the file
        const manifestFile = await readFile(
          join(this.opts.outputPath, this.opts.manifestFilename),
          'utf8'
        );

        // Some icky eval trickery to get the array into a variable
        let manifest;
        eval(manifestFile.replace('self.__precacheManifest', 'manifest')); // eslint-disable-line no-eval

        // Fix the URLs. Next's URLs doesn't align with the assets locations on the file system
        manifest.forEach(entry => {
          if (entry.url.startsWith('bundles/pages/')) {
            entry.url = entry.url.replace(
              'bundles/pages/',
              `/_next/${this.opts.buildId}/page/`
            );
          } else if (entry.url.startsWith('chunks/')) {
            entry.url = entry.url.replace('chunks/', `/_next/webpack/chunks/`);
          } else if (entry.url.startsWith('static/')) {
            entry.url = entry.url.replace('static/', `/_next/static/`);
          }
        });

        // We don't want to precache everything. Filter stuff here
        // Don't vare for the next build manifest, so remove that
        manifest = manifest
          .filter(entry => entry.url !== 'build-manifest.json')
          // Don't include auth pages. Just a fraction of our users actually log in
          .filter(
            entry =>
              !entry.url.includes('auth0_js') &&
              !entry.url.includes('/page/auth/')
          )
          // Same with translation as for auth pages
          .filter(
            entry =>
              !entry.url.endsWith('_translate.js') &&
              !entry.url.includes('translations.js')
          );

        // Add the offline html to the precache so we can use it if navigation events times out
        manifest.push({ url: '/offline', revision: this.opts.buildId });

        // Replace the old manifest with our transformed one and write it to the file
        const newManifest = `self.__precacheManifest = ${JSON.stringify(
          manifest,
          null,
          2
        )};\n\n`;

        return await writeFile(
          join(this.opts.outputPath, this.opts.manifestFilename),
          newManifest,
          'utf8'
        );
      },
      err => {
        throw new Error(`Precached failed: ${err.toString()}`);
      }
    );
  }
}

module.exports = ManifestTransform;
