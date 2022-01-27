# ts-connect-backend
The backend for the ts-connect-app

# Server Architecture

# Installation

The backend server has some requirements, e.q.:
  - nodejs
  - mongodb
  - ejabberd
  - (redis server)

## Install ejabberd

`ejabberd` is the XMPP Server for the messaging in the app.
You can install it in nearly on every linux server, especially on Debian / Ubuntu with the following command:\
`sudo apt install ejabberd`\
\
After that you can configure the admin account of ejabberd:\
`sudo dpkg-reconfigure ejabberd`\
\
After that you get a output like this:\
`Admin user "jabber-admin@rpi.home"`

## Admin Console of eJabberd

The admin console is hosted automatically on your server:\
`https://10.0.1.20:5280/admin/`\
\
**Important**! The server uses a self-signed certificate by default!\
Also the **username** is not only your created username, instead you have to add your configured ejabberd hostname: `admin-user@hostname`, e.q. `jabber-admin@rpi.home`.\
\
You can also generate your own self-signed certificate (recommended), see also: https://meinnoteblog.wordpress.com/2013/11/30/ejabberd-xmpp-server-auf-raspberry-pi-installieren/

## Install MongoDB

You can install your mongodb with `apt-get install mongodb-org`.\
Alternatively you can also create a MongoDB instance in Cloud, with MongoDB Atlas. There is also a free tier with max. 512MB storage, which you can use for testing.

## Install NodeJS

NodeJS version >= 16.x.x is required.\
To install it, do the following steps (Debian / Ubuntu):\
```shell
# Enable the NodeSource repository
curl -sL https://deb.nodesource.com/setup_17.x | sudo bash -

# Install NodeJS
sudo apt-get install nodejs -y

# Check, that your NodeJS version is >= 16.x.x
node --version

# Install build tools
sudo apt-get install build-essential -y

# Optional: For Hot-Reload install also:
npm install -g ts-node
```

See also: https://linuxize.com/post/how-to-install-node-js-on-raspberry-pi/

## Install NodeJS dependencies

Next, install the required NodeJS dependencies. Therefor go to the cloned source code directory (ts-connect-backend) and execute the following command:\
`npm install`

# Start the server

Run this command in shell:\
`npm run start`
