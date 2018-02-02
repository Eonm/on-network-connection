# On network connection

On network connection allows users to trigger scripts and commands according to the wifi state of their computers.

## Features

Trigger custom scripts and commands on :
* network connection
* network disconnection
* first connection to a network
* while connected to a network

On network connection is able to trigger scripts for specific essid and bssid for a maximum precision.

## Install

```sh
git clone https://github.com/Eonm/on-network-connection.git
cd on-network-connection/
npm install
```

### Run

In order to run the script use : ```node index.js```

### Run at session startup

```npm run install``` will install an autostart script. on-network-connection will be launched on session startup.

```npm run uninstall``` will remove the autostart script.

## Create a config file

1. Create a config file called blacklist.json
2. Edit the configuration file with the following pattern :

```
 +-> essid
 |	 		|
 |			+-> any 	 (trigger scripts for any bssid)
 |			¦			|
 |			¦			+> onconnection: [array of commands]
 |			¦			|
 |			¦			+> onDeconnection : [array of commands]
 |			¦			|
 |			¦			+> once: [array of commands]
 |			¦			|
 |			¦			+> whileConnected: [array of commands]
 |			¦
 |			+-> bssid		(trigger scripts for a specific bssid)
 |						|
 |						+> onconnection: [array of commands]
 |						|
 |						+> onDeconnection : [array of commands]
 |						|
 |						+> once: [array of comands]
 |						|
 |						+> whileConnected: [array of commands]
 |			
 |
 +-> other essid
 .
 .
 .

```
#### Example

```json
{
	"my-office-wifi": {
		"any": {
			"once": ["firefox www.example.org", "dbus org.kde.ActivityManager /ActivityManager/Activities org.kde.ActivityManager.Activities.SetCurrentActivity 554629c7-6ced-490c-80bc-12cb006ee0c9"],
			"onconnection": ["atom", "konsole"],
			"onDeconnection": ["killall konsole"]
		},
		"FF:FF:FF:FF:FF:FF": {
			"whileConnected" : ["amixer -c 0 set Speaker mute"]
		}
	},
	"public-wifi" : {
		"all" : {
			"once": ["./startVPN.sh"]
		}
	}
}

```

* To get the current wifi acces point bssid type in a terminal ```iwgetid -a```.
* To get the current wifi acces point name type in a terminale ```iwgetid -r```.

### Use cases
* Start all programs you need for working (text editor, messaging app, web browser...) when you're in your workplace.
* Force your computer's speakers to remain muted while you are in your office space.
* Backup your data to your NAS when back home.
* Switch your kde activity according to your location (home/work...).
* Start vpn connection for specific networks.

### Notes
* This script only work on linux and needs iwevent to be installed (already installed on most linux distributions).
* This script only have been tested with one wireless card.
