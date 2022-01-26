# ts-connect-backend
The backend for the ts-connect-app

# Server Architecture

# Installation

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
Also the **username** is not only your created username, instead you have to add your configured ejabberd hostname: `admin-user@hostname`, e.q. `jabber-admin@rpi.home`.
