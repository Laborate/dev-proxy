/* Modules */
var fs = require("fs");
var $ = require("jquery");
var config = require("./config");
var node_reverse_proxy = require('node-reverse-proxy');
var http = require('http');

if(process.env.NODE_ENV != "production") {
    /* Redirect dev.laborate.io -> laborate.io */
    http.createServer(function(req, res) {
        res.writeHead(302, {
          'Location': 'http://laborate.io'
        });
        res.end();
    }).listen(8080);
}

/* Core Functions */
function getServers() {
    var servers = {}

    $.each(config.general.domains, function(key, domain) {
        if(process.env.NODE_ENV == "production") {
            $.each(config.general.accepted_repos, function(repo_key, repo_value) {
                root_listing = fs.readdirSync("/root");
                if(root_listing.indexOf(repo_key) > -1) {
                    repo_config = require("/root/" + repo_key +  "/config.json");
                    $.each(repo_config.general.subdomains, function(domain_key, domain_value) {
                        if(domain_value) {
                            domain_value = domain_value + ".";
                        } else {
                            domain_value = "";
                        }
                        servers[domain_value + domain] = 'http://127.0.0.1:' + repo_config.general.port;
                    });
                }
            });
        } else {
            servers["dev." + domain] = 'http://127.0.0.1:8080';

            /* Find All Users and Acceptable Repos */
            var home_directory = fs.readdirSync("/home/");
            home_directory.splice($.inArray("archived_users", home_directory), 1);

            $.each(home_directory, function(user_key, user_value) {
                user_listing = fs.readdirSync("/home/" + user_value);
                $.each(config.general.accepted_repos, function(repo_key, repo_value) {
                    if(user_listing.indexOf(repo_value) > -1) {
                        repo_config = require("/home/" + user_value + "/" + repo_value +  "/config.json");
                        if(repo_config.general.port && repo_config.general.subdomains && repo_config.profile.name) {
                            $.each(repo_config.general.subdomains, function(domain_key, domain_value) {
                                if(domain_value) {
                                    domain_value = domain_value + ".";
                                } else {
                                    domain_value = "";
                                }
                                servers[domain_value + repo_config.profile.name + ".dev." + domain] = 'http://127.0.0.1:' + repo_config.general.port;
                            });
                        }
                    }
                });
            });
        }
    });

    console.log(servers);
    return servers
}

//Start Proxy Server
GLOBAL.reverse_proxy = new node_reverse_proxy(getServers());
GLOBAL.reverse_proxy.start(config.general.port);
console.log("Proxy Server Restarted");
