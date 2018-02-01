const fs = require('fs')

let autostart = `
[Desktop Entry]
Type=Application
Exec=/usr/bin/env node ${__dirname}/index.js
Name=on-network-connexion
`

if (process.platform === 'linux') {
  try {
    fs.writeFileSync(`${process.env['HOME']}/.config/autostart/on-network-connexion.desktop`, autostart, 'utf8')
  } catch (e) {
    console.log('Failed to install')
  }
} else {
  console.log('This software only work on linux. Aborting')
}
