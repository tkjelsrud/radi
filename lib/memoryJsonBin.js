const MEMPREFIX = "radi.";
const URLPARAMS = new URLSearchParams(window.location.search);

class Memory {
    constructor() {
        this.items = {};
        this.load();
    }

    load() {
        Object.keys(localStorage).forEach(key =>  {
            if(key.startsWith(MEMPREFIX))
                this.items[key.substring(MEMPREFIX.length)] = localStorage.getItem(key);
        });
    }

    get(key) {
        return this.items[key];
    }
}

var mem = new Memory();

class JSONBin {
    constructor() {
        this.sid = URLPARAMS.get("s");
        this.ready = false;
        this.json = null;
    }

    checkin() {
        
    }

    fetch() {
        // TEST 1
         fetch(`https://api.jsonbin.io/v3/b/${this.sid}/latest`,{
           method: 'GET',
             headers: {
              'Content-Type': 'application/json',
              'X-Access-Key': mem.get("apikey")
            }
         }).then((response) => {
          //console.log(response);
          if(response.status == 200) {
            this.ready = true;
            //const reader = 
            response.json().then(body => {this.json = body.record});/* response.json(); body.getReader();
            reader.read().then((done, value) => {this.result = done});*/
          }
          else {
           this.ready = true;
           //this.result = "faile";
            }
        });
    }

    appendData(text) {
        this.json[new Date()] = text;

        fetch(`https://api.jsonbin.io/v3/b/${this.sid}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Bin-Name': 'tkpub',
                'X-Access-Key': mem.get("apikey")
            },
            body: JSON.stringify({'record': this.json})
        }).then(response => {
            console.log(response);
            //return response.json();
            /*if(response.status == 200)
            document.getElementById("test-put").classList.add("ok");
            else
            document.getElementById("test-put").classList.add("fail")
            //return (response.status == 200);*/
        }).then(data => { 
            // this is the data we get after putting our data,
            console.log(data);
        });
    }

    isReady() { return this.ready }
    
    getResult() {
        if(this.ready) {
            this.ready = false;
            return this.json;
        }
        return null;
    }
}

var jsbin = new JSONBin();