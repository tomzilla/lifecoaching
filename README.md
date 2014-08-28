scorponok
==============
External client. Home page, landing page, etc.

#Getting Started

## Requirements
  You need to install Node.js and then the development tools. Node.js comes with a package manager called [npm](http://npmjs.org) for installing NodeJS applications and libraries.
* [Install node.js](http://nodejs.org/download/) (requires node.js version >= 0.8.4)
* Install Grunt-CLI and Karma as global npm modules (you may need to sudo):

  ```
  npm install -g grunt-cli karma
  ```
* Install bower, the front end js package manager

  ```
  npm install -g bower
  ```
* Python, PIP, Fabric: https://pip.pypa.io/en/latest/installing.html

  ```
  sudo pip install fabric
  ```

You also need emissary-api if you want to make local backend calls: `https://github.com/emissary/emissary-api`

## Get the code
  Clone this repository or fork it.
  
  ```
  git clone https://github.com/emissary/scorponok.git
  cd scorponok
  ```
  
## Install dependencies

  ```
  npm install
  bower install
  ```
  
## Grunt

  The default grunt task will build the app into distributable files and run unit tests.
  
  ```
  grunt
  ```
  
  To rebuild the app when source code changes:
  
  ```
  grunt watch
  ```

## Developing

There are 2 options:

###Setup apache on mac os (Recommended):

  http://osxdaily.com/2012/09/02/start-apache-web-server-mac-os-x/


One change we'll make: in your <USERNAME>.conf file, add the option that tells Apache to follow symlinks. The result should look like this:

```
<Directory [...]>
  Options FollowSymLinks Indexes Multiviews
  [...]
</Directory>
```

In ~/Sites, create a symlink to scorponok/dist

```
mkdir ~/Sites
ln -s ~/path/to/scorponok/dist ~/Sites/scorp
```

Point your browser to `http://localhost/~<username>/scorp`

###Or you can just double click on `index.html` in `dist`

## Deploying

To deploy, we'll need to build it in release mode (minify), scp it to the server, and delete the lighttpd cache folder. Fabric does all of this.

Turn off the background grunt task while you do this! Unlike the ```emissary-api``` repo, this will push the current version of your local repo and branch. 

Example:
  ```
  fab -H dev.emissarymed.com deploy:environ=staging,branch=staging
  ```
  
  check scorp.emissarymed.com
  
##Content
Content is loaded on demand from json files stored in src/data/*.json

##Localization
TODO

<img src="http://upload.wikimedia.org/wikipedia/en/1/1c/Scorponok-art.jpg"/>
