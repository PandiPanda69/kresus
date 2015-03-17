moment = require 'moment'
banks = require '../banks-all.json'
helpers = require './helpers'
output = {}

# Initial set of operations
operations = require '../operations.json'

randomLabels = [
    ['Café Moxka', 'Petit expresso rapido Café Moxka'],
    ['MerBnB', 'Paiement en ligne MerBNB'],
    ['Tabac Debourg', 'Bureau de tabac SARL Clopi Cloppa'],
    ['Rapide PSC', 'Paiement sans contact Rapide'],
    ['MacDollars PSC', 'Paiement sans contact Macdollars'],
    ['FNAK', 'FNAK CB blabla'],
    ['CB Sefaurat', 'Achat de parfum chez Sefaurat'],
    ['Polyprix CB', 'Courses chez Polyprix'],
    ['Croisement CB', 'Courses chez Croisement'],
    ['PRLV UJC', 'PRLV UJC'],
    ['CB Spotifaille', 'CB Spotifaille London'],
    ['Antiquaire', 'Antiquaire'],
    ['Le Perroquet Bourré', 'Le Perroquet Bourré SARL'],
    ['Le Vol de Nuit', 'Bar Le Vol De Nuit SARL'],
    ['Impots fonciers', 'Prelevement impots fonciers numero reference 47839743892 client 43278437289'],
    ['ESPA Carte Hassan Cehef', 'Paiement carte Hassan Cehef'],
    ['Indirect Energie', 'ESPA Indirect Energie SARL'],
    ['', 'VIR Mr Jean Claude Dusse'],
]

randomLabelsPositive = [
    ['VIR Nuage Douillet', 'VIR Nuage Douillet REFERENCE Salaire'],
    ['Impots', 'Remboursement impots en votre faveur'],
    ['', 'VIR Pots de vin et magouilles pas claires'],
    ['Case départ', 'Passage par la case depart'],
]

rand = (low, high) ->
    return low + (Math.random() * (high - low) | 0)

randomLabel = () ->
    return randomLabels[rand 0, randomLabels.length]

randomLabelPositive = () ->
    return randomLabelsPositive[rand 0, randomLabelsPositive.length]

generateDate = (low, high) ->
    moment().date(rand(low, high)).format('YYYY-MM-DDT00:00:00.000[Z]')

generateOne = (account) ->
    n = rand 0, 100

    if n < 2
        # on 4th of Month
        return {
            "label": "Loyer"
            "raw": "Loyer habitation"
            "amount": "-300"
            "rdate": generateDate 4, 4
            "account": account
        }

    if n < 15
        [label, raw] = randomLabelPositive()
        amount = rand(100, 800) + rand(0, 100) / 100
        rdate = generateDate 0, moment().date()
        return {
            label: label
            raw: raw
            amount: amount.toString()
            rdate: rdate
            account: account
        }

    [label, raw] = randomLabel()
    amount = -rand(0, 60) + rand(0, 100) / 100
    rdate = generateDate 0, moment().date()
    return {
        label: label
        raw: raw
        amount: amount.toString()
        rdate: rdate
        account: account
    }

selectRandomAccount = (uuid) ->
    n = rand 0, 100
    accounts = helpers uuid
    if n < 90
        return accounts.main
    if n < 95
        return accounts.second
    return accounts.third

generate = (uuid) ->
    operations = []
    count = 3
    i = count
    account = selectRandomAccount uuid
    while i--
        operations.push generateOne account
        count++
    while rand(0, 100) > 80 and count < 8
        operations.push generateOne account
        count++
    console.log 'generated', count, 'operations'
    operations

module.exports = () ->
    output = {}
    for b in banks
        output[b.uuid] = generate b.uuid
    output
