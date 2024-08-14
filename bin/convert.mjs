import {
  resolve
} from 'path';
import svgtofont from 'svgtofont';
import {
  createDir,
  categorizeFiles,
  fixIcons,
} from '../utils/helpers.mjs';
import { flow, forEach } from 'lodash-es';
import { readdirSync } from 'fs';

const iconsDir = flow(
  (pkg) => import.meta.resolve(pkg),
  (str) => str.replace('file:///', ''),
)('ionicons/dist/svg/');

const tempDir = resolve(import.meta.dirname, '../_temp');
createDir(tempDir);
await fixIcons(iconsDir, resolve(tempDir, 'all'));

await categorizeFiles(resolve(tempDir, 'all'));

const assetsDir = resolve(import.meta.dirname, '../assets');
createDir(assetsDir);

forEach(readdirSync(tempDir), async (topic) => {
  let fontName = 'ionicons';
  if (topic !== 'all') {
    fontName = fontName + '-' + topic;
  }

  const svg2fontOptions = {
    src: resolve(tempDir, topic),
    dist: resolve(assetsDir, topic),
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
})





// import {
//   readdirSync,
//   statSync,
//   readFileSync,
//   writeFileSync,
//   existsSync,
// } from 'fs';
// import {
//   endsWith, filter, forEach, includes, map,
// } from 'lodash';
// import flow from 'lodash/flow';
// import svgtofont from 'svgtofont';
// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';


// dayjs.extend(utc);



// const module = async (ctx) => {
//   const iconPack = 'ionicons';
//   const assetsDir = resolve(__dirname, './assets');
//   const lastUpdateFileKey = '.last_update';
//   const stats = statSync(assetsDir);
//   const lastUpdate = dayjs.format('YYYY-MM-DD|HH:mm:ss|Z');
//   const dst = resolve(ctx.options.buildDir, '../assets/flux/icons');

//   if (existsSync(resolve(dst, lastUpdateFileKey))) {
//     const savedLastUpdate = readFileSync(resolve(dst, lastUpdateFileKey), 'utf-8');
//     if (savedLastUpdate === lastUpdate) {
//       if (existsSync(resolve(dst, './flux.css'))) {
//         ctx.options.css.unshift(resolve(dst, './flux.css'));
//         consola.success('Иконки подключены из кэша');
//         return;
//       }
//     }
//   }

//   const tempFolder = resolve(dst, '../temp/icons');
//   createDir(tempFolder);

//   const items = readdirSync(assetsDir);

//   if (includes(items, iconPack)) {
//     const packDir = resolve(assetsDir, iconPack);
//     if (statSync(packDir).isDirectory()) {
//       const packItems = flow(
//         (str) => readdirSync(str),
//         (arr) => filter(arr, (str) => !includes(items, str)),
//         (arr) => filter(arr, (str) => endsWith(str, '.svg')),
//         (arr) => map(arr, (str) => `${iconPack}/${str}`),
//       )(packDir);

//       forEach(packItems, (str) => {
//         items.push(str);
//       });
//     }
//   }

//   forEach(items, async (item) => {
//     const svgPath = resolve(assetsDir, item);
//     const svgStats = statSync(svgPath);
//     const { size } = svgStats;

//     const name = getName(svgPath);

//     if (svgStats.isDirectory()) {
//       return;
//     }

//     const svgString = readFileSync(svgPath, 'utf-8');

//     if (/<image\s/i.test(svgString)) {
//       consola.error(`Иконка [${name}] содержит фотографию`);
//       return;
//     }
//     if (/<\?xml/i.test(svgString)) {
//       consola.error(`Иконка [${name}] содержит <?xml`);
//       return;
//     }
//     if (/<!--.+-->/i.test(svgString)) {
//       consola.error(`Иконка [${name}] содержит комментарии`);
//       return;
//     }
//     if (size > 6000) {
//       consola.error(`Иконка [${name}] слишком тяжелая (${size}bytes)`);
//       return;
//     }

//     // svgString = await convertSVGToPath(svgString);

//     // svgString = svgString.replace(/<\?xml[^?]+\?>/i, '');
//     // svgString = svgString.replaceAll(/<!--.+-->/ig, '');

//     const tempDst = resolve(tempFolder, basename(item));
//     writeFileSync(tempDst, svgString, { encoding: 'utf8', flag: 'w' });
//   });

//   const svg2fontOptions = {
//     src: tempFolder,
//     dist: dst,
//     emptyDist: true,
//     log: true,
//     fontName: 'flux',
//     css: false,
//     svgicons2svgfont: {
//       fixedWidth: true,
//       centerHorizontally: true,
//       normalize: true,
//       fontHeight: 200,
//     },
//   };

//   const fixedTempFolder = resolve(tempFolder, '../fixed-icons');
//   const fixed = await fixIcons(tempFolder, fixedTempFolder);

//   if (fixed) {
//     svg2fontOptions.src = fixedTempFolder;
//     console.log('eeeee');
//   }

//   await svgtofont(svg2fontOptions);
//   if (existsSync(resolve(dst, './flux.css'))) {
//     writeFileSync(resolve(dst, lastUpdateFileKey), lastUpdate, { encoding: 'utf8', flag: 'w' });
//     ctx.options.css.unshift(resolve(dst, './flux.css'));
//     consola.success('Иконки подключены как шрифт');
//   } else {
//     consola.error(`Иконки подключить не удалось: ${readdirSync(dst)}`);
//   }
// };