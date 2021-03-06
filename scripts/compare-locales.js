let path = require('path-extra');
let fs = require('fs');

let log = require('printit')({
    prefix: "compare-locales"
});

let localesDir = path.join(path.dirname(fs.realpathSync(__filename)),
                           '..',
                           'shared',
                           'locales');

let localesMap = new Map;

fs.readdirSync(localesDir).forEach(function(child) {
    let file = path.join(localesDir, child);
    if (fs.statSync(file).isDirectory())
        return;
    if (file.indexOf(".js") === -1)
        return;
    let format = child.replace('.js', '');
    localesMap.set(format, require(file));
    log.info(`Found ${format} locale...`);
});

let cache = new Map;
function buildKeys(obj) {
    function _(obj, prefix) {
        let keys = [];
        for (let k in obj) {
            if (!obj.hasOwnProperty(k))
                continue;

            let val = obj[k];
            if (typeof val === 'object') {
                let subkeys = _(val, prefix + '.' + k);
                keys = keys.concat(subkeys);
            } else {
                keys.push(prefix + '.' + k);
            }
        }
        return keys;
    }
    if (!cache.has(obj))
        cache.set(obj, _(obj, ''));
    return cache.get(obj);
}

let allKeys = new Set;
for (let [format, locale] of localesMap) {
    let keys = buildKeys(locale);
    for (let k of keys) {
        allKeys.add(k);
    }
}

for (let [format, locale] of localesMap) {
    if (format === 'en')
        continue;

    let keys = new Set(buildKeys(locale));
    for (let k of allKeys) {
        if (!keys.has(k)) {
            log.warn(`Missing key in the ${format} locale: ${k}`);
        }
    }
}

let englishLocale = localesMap.get('en');
if (!englishLocale) {
    log.error("No english locale!?");
    process.exit(1);
}

let englishKeys = new Set(buildKeys(englishLocale));

let hasError = false;
for (let k of allKeys) {
    if (!englishKeys.has(k)) {
        log.error(`Missing key in the english locale: ${k}`);
        hasError = true;
    }
}

if (hasError)
    process.exit(1);

log.info('CompareLocale: OK.')
process.exit(0);
