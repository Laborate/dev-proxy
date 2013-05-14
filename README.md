# Admin Only

Install After [base-init](https://github.com/Laborate/base-init)
-----------------------------------------------------------------
If in **developement** it looks at the home folders scope and sees which users are avilable. Then it looks
at each users folder and sees which repos are available. If repo is in accepted list then it will 
find the config file and add it to the list of domains and ports that need to be reversed proxied.

```
  http://<repo>.<user_name>.dev.laborate.io
```

If in **production** it looks at the root folder and sees which repos are available. 
If repo is in accepted list then it will find the config file and add it to the list of domains and ports
that need to be reversed proxied.

```
  http://<repo>.laborate.io
```

Start Server If Down
------------------------------
```bash
npm start
```
