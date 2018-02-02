#!/usr/bin/env node

const exec = require('child_process').exec
const fs = require('fs')
const _ = require ('lodash')
const wifiState = require('wifi-state')

let lastNetwork = null

let conf = function () {
  return JSON.parse(fs.readFileSync(__dirname + '/blacklist.json', 'utf-8'))
}

//------------------------------------ process

wifiState.start()

wifiState.on('disconnected', function(networkInfo){
  getCommands(conf(), networkInfo, deco)
  lastNetwork = null
  return
})

wifiState.on('connected', function(networkInfo){
  lastNetwork = networkInfo
  getCommands(conf(), networkInfo, co)
})

//------------------------------------ functions
function getCommands (configFile, nInfo, cb) {
  let configs = {}

  if (!configFile[nInfo.essid]) return
  if (configFile[nInfo.essid].any) _.mergeWith(configs, configFile[nInfo.essid].any, customizer)
  if (configFile[nInfo.essid][nInfo.bssid]) _.mergeWith(configs, configFile[nInfo.essid][nInfo.bssid], customizer)
  cb(configs)
}

function co (config) {
  if (config.once) {
    execCommands(config.once)
    delete config.once
  }
  if (config.onConnexion) {
    execCommands(config.onConnexion)
  }
  if (config.whileConnected){
    whileConnected(config.whileConnected)
  }
}

function deco (config) {
  if (config.onDeconnexion) {
    execCommands(config.onDeconnexion)
  }
}

function whileConnected (config) { // recursive and brake if change
  execCommands(config)
  if (lastNetwork == null) return
  if (lastNetwork.essid !== currentEssid()) return
  whileConnected(config)
}

function execCommands (commands) {
  commands.forEach(command => exec(`nohup ${command}`))
}

function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}
