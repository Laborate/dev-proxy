/* Modules */
var fs = require("fs");
var $ = require("jquery");
var config = require("./config");
var node_reverse_proxy = require('node-reverse-proxy');
var http = require('http');

/* Redirect dev.laborate.io -> laborate.io */
http.createServer(function(req, res) {
    res.writeHead(302, {
      'Location': 'http://laborate.io'
    });
    res.end();
}).listen(8080);

/* Core Functions */
function getServers() {
    var servers = {}

    $.each(config.general.domains, function(key, domain) {
        /* Find All Users and Acceptable Repos */
        var home_directory = fs.readdirSync("/home/");
        home_directory.splice($.inArray("archived_users", home_directory), 1);

        $.each(home_directory, function(user_key, user_value) {
            user_listing = fs.readdirSync("/home/" + user_value);
            $.each(config.general.accepted_repos, function(repo_key, repo_value) {
                if(user_listing.indexOf(repo_value) > -1) {
                    repo_config = require("/home/" + user_value + "/" + repo_value +  "/config.json");
                    if(repo_config.general.ports && repo_config.general.subdomains && repo_config.profile.name) {
                        $.each(repo_config.general.subdomains, function(domain_key, domain_value) {
                            if(domain_value) {
                                domain_value = domain_value + ".";
                            } else {
                                domain_value = "";
                            }

                            if(repo_config.general.ssl) {
                                var port = repo_config.general.ports.https;
                            } else {
                                var port = repo_config.general.ports.http;
                            }

                            servers[domain_value + repo_config.profile.name + ".dev." + domain] = 'http://127.0.0.1:' + port;
                        });
                    }
                }
            });
        });

        servers["status.dev." + domain] = 'http://127.0.0.1:5555';
    });

    servers[""] = 'http://127.0.0.1:8080';
    return servers
}

//Start Proxy Server
var servers = getServers();
new node_reverse_proxy(servers)
    .start(config.general.port);

console.log(servers);
console.log("Proxy Server Started");
