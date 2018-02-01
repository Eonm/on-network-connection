#!/usr/bin/env node

const spawn = require('child_process').spawn
const execSync = require('child_process').execSync
const exec = require('child_process').exec
const fs = require('fs')
const _ = require ('lodash')

const macAdressMatcher = /(([A-Z0-9]{2}:)){5}[A-Z0-9]{2}/
let lastNetwork = null
let iwevent = spawn('iwevent');

let conf = function () {
  return JSON.parse(fs.readFileSync(__dirname + '/blacklist.json', 'utf-8'))
}

let currentEssid = function () {
  try {
    return execSync('iwgetid -r').toString().trim()
  } catch (err) {}
}

//------------------------------------ process

if (currentEssid()) {
  bssid = execSync('iwgetid -a').toString().match(macAdressMatcher)[0]

  networkInfo = {'bssid': bssid ,'essid': currentEssid()}

  lastNetwork = networkInfo
  getCommands(conf(), networkInfo, co)
}

iwevent.stdout.on('data', function(wifiLogs) {
  wifiLogs.toString()
  .split('\n')
  .forEach( wl => {
    if (wl.match('Not-Associated')) {
      getCommands(conf(), networkInfo, deco)
      lastNetwork = null
      return
    }

    if (wl.match("New Access Point/Cell address:")) {
      console.log(wl.toString())

      setTimeout(function () {
        console.log(currentEssid())

        bssid = wl.match(macAdressMatcher)[0]
        networkInfo = {'bssid': bssid ,'essid': currentEssid()}
        lastNetwork = networkInfo

        getCommands(conf(), networkInfo, co)
      }, 600);
    }
  })
})

//------------------------------------ functions
function getCommands (configFile, nInfo, cb) {
  let configs = {}

  if (!configFile[nInfo.essid]) return
  if (configFile[nInfo.essid].all) _.mergeWith(configs, configFile[nInfo.essid].all, customizer)
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
