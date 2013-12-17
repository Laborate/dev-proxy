# Admin Only

Install After [base-init](https://github.com/Laborate/base-init)
-----------------------------------------------------------------
```bash
cd ~; git clone git@github.com:Laborate/dev-proxy.git; cd dev-proxy; npm install;
```

Information
------------------------------
Use only in **developement**. The server looks at the home folders and sees which users have repos that are acceptable. If repo is in accepted list then it will 
find the config file and add it to the list of domains and ports that need to be reverse proxied.

```
  http://<repo>.<user_name>.dev.laborate.io
```

Start Server If Down
------------------------------
```bash
cd ~/dev-proxy; forever start start.js;
```
