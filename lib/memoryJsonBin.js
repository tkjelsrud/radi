const MEMPREFIX = "radi.";
const URLPARAMS = new URLSearchParams(window.location.search);

class Memory {
    constructor() {
        this.items = {};
        this.load();

        this.set('apikey', "$2b$10$7JrtwZS4.ENCVXramO.ANO7AtKjtvmmazkfq9QtZ43ABECNSD3/7e"); // Hard code for now - otherwise, new clients can't connect
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

    set(key, value) {
        this.items[key] = value;
        localStorage.setItem(MEMPREFIX + key, value);
        return value;
    }

    getOrSetUid() {
        if(this.get('uid'))
            return this.get('uid');
        
        return this.set('uid', this.uuidv4());
    }

    uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    
}

var mem = new Memory();

class JSONBin {
    constructor() {
        this.sid = URLPARAMS.get("s");
        this.ready = false;
        this.json = {};
        this.uid = mem.getOrSetUid();    // User ident
    }

    checkin() {
        //this.uid = mem.getOrSetUid();
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
            response.json().then(body => {this.json = body});/* response.json(); body.getReader();
            reader.read().then((done, value) => {this.result = done});*/
          }
          else {
           this.ready = true;
           //this.result = "faile";
            }
        });
    }

    appendData(input) {
        this.json[this.uid] = {'uid': this.uid, 'utime': Date.now(), 'input': input};
        //console.log(this.json[this.uid]);

        fetch(`https://api.jsonbin.io/v3/b/${this.sid}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Bin-Name': 'tkpub',
                'X-Access-Key': mem.get("apikey")
            },
            body: JSON.stringify(this.json)
        }).then(response => {
            console.log(response);
            

            response.json().then(body => this.json = body);

            /*let reader = response.body.getReader();
            reader.readAsText().then(({ done, value }) => {
                console.log(value);
            });*/

            //return response.json();
            /*if(response.status == 200)
            document.getElementById("test-put").classList.add("ok");
            else
            document.getElementById("test-put").classList.add("fail")
            //return (response.status == 200);*/
        }).then(data => { 
            // this is the data we get after putting our data,
           // console.log(data);
            //this.json = data.record;
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