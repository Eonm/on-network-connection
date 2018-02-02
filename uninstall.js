const fs = require('fs')
autoStartPath = `${process.env['HOME']}/.config/autostart/on-network-connection.desktop`

if (fs.existsSync(autoStartPath)) {
  try {
    fs.unlinkSync(autoStartPath);
  } catch (e) {
    console.log('Failed to uninstall on-network-connection')
  }
} else {
  console.log('There is no file to delete')
}
