var config = require('../config.json')

exports.getIpv4 = function() {
    var os = require('os');
    var ipv4 = null;

    if(os.networkInterfaces().eth0){
        for(var i=0;i<os.networkInterfaces().eth0.length;i++){  
            if(os.networkInterfaces().eth0[i].family=='IPv4'){  
                ipv4 = os.networkInterfaces().eth0[i].address;  
            }  
        }
    }

    if(os.networkInterfaces().wlp8s0b1){
        for(var i=0;i<os.networkInterfaces().wlp8s0b1.length;i++){  
            if(os.networkInterfaces().wlp8s0b1[i].family=='IPv4'){  
                ipv4 = os.networkInterfaces().wlp8s0b1[i].address;  
            }
        }
    }

    if(null == ipv4 && os.networkInterfaces().wlan0){
        for(var i=0;i<os.networkInterfaces().wlan0.length;i++){  
            if(os.networkInterfaces().wlan0[i].family=='IPv4'){  
                ipv4 = os.networkInterfaces().wlan0[i].address;  
            }  
        }
    }

    return ipv4
}

exports.getPort = function() {
    return config.http.port;
}
