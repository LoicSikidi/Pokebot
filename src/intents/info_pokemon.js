const request = require('superagent')
const _ = require('lodash')
const u = require('../utils.js')

const infoPokemonLayout = (pokemon, specie) => {
  const answer = [u.toText(`:mag_right: ${_.capitalize(pokemon.name)} infos`)]
  answer.push(u.toText(`Type(s): ${pokemon.types.map(elem => _.capitalize(elem.type.name)).join(' / ')}`))
  let toAdd = `${_.capitalize(pokemon.name)}, the pokemon ${specie.genera[0].genus}`
  if (specie.evolves_from_species) { toAdd += ` is the evolution of ${specie.evolves_from_species.name}` }
  const goodElem = _.find(specie.flavor_text_entries, (elem) => { return elem.language.name === 'en' && elem.version.name === 'x' })
  toAdd += `.\n\n${goodElem.flavor_text.replace(/\n/gi, ' ')}`
  answer.push(u.toText(toAdd))
  if (pokemon.sprites.front_default) { answer.push({ type: 'image', content: pokemon.sprites.front_default }) }
  const prompt = [
    u.toButton('resists', `show me ${pokemon.name} resists`),
    u.toButton('stats', `show me ${pokemon.name} stats`),
    u.toButton('moves', `show me ${pokemon.name} moves`),
  ]
  answer.push(u.toButtons(`See more about ${pokemon.name}`, prompt))
  return answer
}

const getInfoPokemon = (entity, user) => {
  const pokemon = entity ? entity.raw : user.pokemon
  if (!pokemon) { return Promise.reject([u.toText('Info about which pokemon?')]) }
  if (entity && entity.name === 'wrong') { return Promise.reject([u.toText(`The pokemon ${entity.raw} does not exist... You might have mispelled it.`)]) }
  user.pokemon = pokemon
  return new Promise((resolve, reject) => {
    request.get(`http://pokeapi.co/api/v2/pokemon/${pokemon}`)
    .end((err, res) => {
      if (err) { return reject([u.toText('Sorry, the Pokemon headquarters are down. Try again later!')]) }
      request.get(res.body.species.url)
      .end((err2, res2) => {
        if (err2) { return reject([u.toText('Sorry, the Pokemon headquarters are down. Try again later!')]) }
        resolve(infoPokemonLayout(res.body, res2.body))
      })
    })
  })
}

module.exports = getInfoPokemon
