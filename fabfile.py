import sys
from fabric.api import *
from contextlib import contextmanager as _contextmanager
from fabric.contrib.files import exists
from fabric.contrib.project import upload_project
import urllib2, base64


env.always_use_pty = False
def prompt_yes_no(question):
  sys.stdout.write(question)

  yes = set(['yes','y', 'ye'])
  no = set(['no','n', ''])

  while True:
    choice = raw_input().lower()
    if choice in yes:
      return True
    elif choice in no:
      return False
    else:
      sys.stdout.write("Please respond with 'yes' or 'no'")
def deploy(environ='staging', branch='staging'):
  if environ == 'production':
    if not prompt_yes_no('Deploy to production? [y/N] '):
      exit()
  elif environ == 'staging':
    pass
  env.env_dir = '/var/fuzzymorals/web-%s' % environ
  env.deploy_dir = '%s/www' % env.env_dir
  env.tmp_dir = '/tmp/scorponok'
  env.forward_agent = True
  sudo('uptime')
  local('git branch')
  version = local('git rev-parse HEAD', capture=True)
  if not prompt_yes_no('Do you want to build with the %s branch? [y/N] ' % environ):
    exit()
  local('grunt release --env=%s --git-version=%s' % (environ, version))
  upload_project(local_dir='./dist/', remote_dir=env.env_dir, use_sudo=True)
  sudo('rm -rf /var/cache/lighttpd/compress/*')

class bcolors:
  HEADER = '\033[95m'
  OKBLUE = '\033[94m'
  OKGREEN = '\033[92m'
  WARNING = '\033[93m'
  FAIL = '\033[91m'
  ENDC = '\033[0m'
