import {
  rmSync,
  mkdirSync,
  readdirSync,
} from 'fs';
import {
  lowerCase,
  flow,
  forEach,
  filter,
  endsWith,
  flatten,
  values,
  difference,
} from 'lodash-es';
import { basename, resolve } from 'path';
import SVGFixer from 'oslllo-svg-fixer';
import cliProgress from 'cli-progress';
import fse from 'fs-extra';

export const createDir = (path) => {
  mkdirSync(path, { recursive: true });
  rmSync(path, { recursive: true });
  mkdirSync(path, { recursive: true });
}

export const getName = (path) => {
  const name = basename(path);
  return flow(
    (str) => str.replace(/\.\w{2,4}$/gi, ''),
    (str) => str.replace(/(?:[^\w\d]|_)+/gi, '-'),
    (str) => lowerCase(str),
    (str) => str.replace(/\s+(.)/g, (v) => v.toUpperCase()),
    (str) => str.replace(/\s+/g, ''),
  )(name);
};

export const fixIcons = async (dir, destination) => {
  try {
    createDir(destination);
    await SVGFixer(dir, destination, {
      showProgressBar: true,
    }).fix();
    return destination;
  } catch (err) {
    return err;
  }
}

export const categorizeFiles = async (dir) => {
  const b1 = new cliProgress.SingleBar({
    format: 'Categorize progress |' + '[{bar}]' + '| {percentage}% || {value}/{total} Chunks',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    stopOnComplete: true,
    clearOnComplete: true,
    hideCursor: true
  });

  const options = {
    '---': 'base',
    '-outline': 'outline',
    '-sharp': 'sharp',
  };
  const allItems = readdirSync(dir);

  b1.start(allItems.length, 0);

  const results = {};
  forEach(options, (key, postfix) => {
    const items = filter(allItems, (item) => endsWith(item, `${postfix}.svg`));
    results[key] = items;
  });

  results[options['---']] = flow(
    (obj) => values(obj),
    (arr) => flatten(arr),
    (arr) => difference(allItems, arr),
  )(results);

  forEach(results, (collection, folder) => {
    const category = resolve(dir, `../${folder}`);
    createDir(category);

    forEach(collection, (icon) => {
      fse.copySync(resolve(dir, icon), resolve(category, icon));
      b1.increment();
    });
  });

  return values(options);
}