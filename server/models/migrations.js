import Access from './access';
import Account from './account';
import Bank from './bank';
import Config from './config';
import Operation from './operation';
import Category from './category';
import Type from './operationtype';

import { makeLogger } from '../helpers';

let log = makeLogger('models/migrations');

// For a given access, retrieves the custom fields and gives them to the
// changeFn, which must return a new version of the custom fields (deleted
// fields won't be kept in database). After which they're saved (it's not
// changeFn's responsability to call save/updateAttributes).
async function updateCustomFields(access, changeFn) {
    let originalCustomFields = JSON.parse(access.customFields || '[]');

    // "deep copy", lol
    let newCustomFields = JSON.parse(access.customFields || '[]');
    newCustomFields = changeFn(newCustomFields);

    let pairToString = pair => `${pair.name}:${pair.value}`;
    let buildSig = fields => fields.map(pairToString).join('/');

    let needsUpdate = false;
    if (originalCustomFields.length !== newCustomFields.length) {
        // If one has more fields than the other, update.
        needsUpdate = true;
    } else {
        // If the name:value/name2:value2 strings are different, update.
        let originalSignature = buildSig(originalCustomFields);
        let newSignature = buildSig(newCustomFields);
        needsUpdate = originalSignature !== newSignature;
    }

    if (needsUpdate) {
        log.debug(`updating custom fields for ${access.id}`);
        await access.updateAttributes({
            customFields: JSON.stringify(newCustomFields)
        });
    }
}

let migrations = [

    async function m1() {
        log.info('Removing weboob-log and weboob-installed from the db...');
        let weboobLog = await Config.byName('weboob-log');
        if (weboobLog) {
            log.info('\tDestroying Config[weboob-log].');
            await weboobLog.destroy();
        }

        let weboobInstalled = await Config.byName('weboob-installed');
        if (weboobInstalled) {
            log.info('\tDestroying Config[weboob-installed].');
            await weboobInstalled.destroy();
        }
    },

    async function m2() {
        log.info(`Checking that operations with types and categories are
consistent...`);
        let ops = await Operation.all();
        let categories = await Category.all();
        let types = await Type.all();

        let typeSet = new Set;
        for (let t of types) {
            typeSet.add(t.id);
        }

        let categorySet = new Set;
        for (let c of categories) {
            categorySet.add(c.id);
        }

        let typeNum = 0;
        let catNum = 0;
        for (let op of ops) {
            let needsSave = false;

            if (typeof op.operationTypeID !== 'undefined' &&
                !typeSet.has(op.operationTypeID)) {
                needsSave = true;
                delete op.operationTypeID;
                typeNum += 1;
            }

            if (typeof op.categoryId !== 'undefined' &&
                !categorySet.has(op.categoryId)) {
                needsSave = true;
                delete op.categoryId;
                catNum += 1;
            }

            if (needsSave) {
                await op.save();
            }
        }

        if (typeNum)
            log.info(`\t${typeNum} operations had an inconsistent type.`);
        if (catNum)
            log.info(`\t${catNum} operations had an inconsistent category.`);
    },

    async function m3() {
        log.info('Replacing NONE_CATEGORY_ID by undefined...');
        let ops = await Operation.all();

        let num = 0;
        for (let o of ops) {
            if (typeof o.categoryId !== 'undefined' &&
                o.categoryId.toString() === '-1') {
                delete o.categoryId;
                await o.save();
                num += 1;
            }
        }

        if (num)
            log.info(`\t${num} operations had -1 as categoryId.`);
    },

    async function m4() {
        log.info('Migrating websites to the customFields format...');

        let accesses = await Access.all();
        let num = 0;

        let updateFields = website => customFields => {
            if (customFields.filter(field => field.name === 'website').length)
                return customFields;
            customFields.push({
                name: 'website',
                value: website
            });
            return customFields;
        };

        for (let a of accesses) {
            if (typeof a.website === 'undefined' || !a.website.length)
                continue;

            let website = a.website;
            delete a.website;

            await updateCustomFields(a, updateFields(website));

            await a.save();
            num += 1;
        }

        if (num)
            log.info(`\t${num} accesses updated to the customFields format.`);
    },

    async function m5() {
        log.info(`Migrating HelloBank users to BNP and BNP users to the new
website format.`);
        let accesses = await Access.all();

        let updateFieldsBnp = customFields => {
            if (customFields.filter(field => field.name === 'website').length)
                return customFields;
            customFields.push({
                name: 'website',
                value: 'pp'
            });
            log.info('\tBNP access updated to the new website format.');
            return customFields;
        };

        let updateFieldsHelloBank = customFields => {
            customFields.push({
                name: 'website',
                value: 'hbank'
            });
            return customFields;
        };

        for (let a of accesses) {

            if (a.bank === 'bnporc') {
                await updateCustomFields(a, updateFieldsBnp);
                continue;
            }

            if (a.bank === 'hellobank') {
                // Update access
                await updateCustomFields(a, updateFieldsHelloBank);

                // Update accounts
                let accounts = await Account.byBank({ uuid: 'hellobank' });
                for (let acc of accounts) {
                    await acc.updateAttributes({ bank: 'bnporc' });
                }

                await a.updateAttributes({ bank: 'bnporc' });
                log.info(`\tHelloBank access updated to use BNP's backend.`);
                continue;
            }
        }

        let banks = await Bank.all();
        for (let b of banks) {
            if (b.uuid !== 'hellobank')
                continue;
            log.info('\tRemoving HelloBank from the list of banks...');
            await b.destroy();
            log.info('\tdone!');
        }
    }
];

export async function run() {
    for (let m of migrations) {
        await m();
    }
}
