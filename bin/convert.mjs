import {
  resolve
} from 'path';
import svgtofont from 'svgtofont';
import {
  createDir,
  categorizeFiles,
  fixIcons,
} from '../utils/helpers.mjs';
import { flow, forEach, map } from 'lodash-es';
import { readdirSync } from 'fs';

const iconsDir = flow(
  (pkg) => import.meta.resolve(pkg),
  (str) => str.replace('file:///', ''),
)('ionicons/dist/svg/');

const tempDir = resolve(import.meta.dirname, '../_temp');
createDir(tempDir);
await fixIcons(iconsDir, resolve(tempDir, 'all'));

await categorizeFiles(resolve(tempDir, 'all'));

const distDir = resolve(import.meta.dirname, '../dist');
createDir(distDir);

for await (const topic of readdirSync(tempDir)) {
  console.log(topic);
  
  let fontName = 'ionicons';
  if (topic !== 'all') {
    fontName = fontName + '-' + topic;
  }

  const svg2fontOptions = {
    src: resolve(tempDir, topic),
    dist: resolve(distDir, topic),
    emptyDist: true,
    log: false,
    classNamePrefix: 'ion',
    fontName: fontName,
    css: true,
    generateInfoData: true,
    svgicons2svgfont: {
      fixedWidth: true,
      centerHorizontally: true,
      normalize: true,
      fontHeight: 200,
    },
  };

  await svgtofont(svg2fontOptions);
};
