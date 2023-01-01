//Peer JS

var lastPeerId = null;
var peer = null;
var peerId = null;
var conn = null;
var status = null;

export function initialize(OnCreated, OnConnected, ReturnStatus) {
    peer = new Peer();
    peer.on('open', function (id) {
        // Workaround for peer.reconnect deleting previous id
        if (peer.id === null) {
             console.log('Received null id from peer open');
            peer.id = lastPeerId;
        } else {
            lastPeerId = peer.id;
        }
        console.log('ID: ' + peer.id);
        status = "Awaiting connection...";


        if(OnCreated != null) {
            OnCreated(peer)
        }
        if(ReturnStatus != null) {
            ReturnStatus(status)
        }
    });

    peer.on('connection', function (c) {
        // Allow only a single connection
        if (conn && conn.open) {
            c.on('open', function() {
                c.send("Already connected to another client");
                setTimeout(function() { c.close(); }, 500);
            });
            return;
        }

        conn = c;
        console.log("Connected to: " + conn.peer);
        status = "Connected";
        if(OnConnected != null) {
            OnConnected(conn)
        }
        if(ReturnStatus != null) {
            ReturnStatus(status)
        }
    });

    peer.on('disconnected', function () {
        console.log('Connection lost. Please reconnect');
        status = "Connection lost. Please reconnect";
        if(ReturnStatus != null) {
            ReturnStatus(status)
        }
    });

    peer.on('close', function() {
        conn = null;
        console.log('Connection destroyed');
        status = "Connection destroyed. Please refresh";
        if(ReturnStatus != null) {
            ReturnStatus(status)
        }
    });

    peer.on('error', function (err) {
        console.log(err);
        alert('' + err);
    });
}


export function ready(OnData, ReturnStatus) {
    conn.on('data', function (data) {
        console.log("Data recieved");
        switch (data) {
            default:
                OnData(data)
                break;
        };
    });
    conn.on('close', function () {
        conn = null;
        status = "Connection reset<br>Awaiting connection...";
        if(ReturnStatus != null) {
            ReturnStatus(status)
        }
    });
}

export function join(JoinId, OnRecive, ReturnStatus) {
    // Close old connection
    if (conn) {
        conn.close();
    }

    // Create connection to destination peer specified in the input field
    conn = peer.connect(JoinId, {
        reliable: true
    });

    conn.on('open', function () {
        console.log("Connected to: " + conn.peer);
        status = "Connected to: " + conn.peer;
        if(ReturnStatus != null) {
            ReturnStatus(status)
        }
    });

    // Handle incoming data (messages only since this is the signal sender)
    conn.on('data', function (data) {
        if(OnRecive != null) {
            OnRecive(data)
        }
    });
    conn.on('close', function () {
        status = "Connection closed";
        if(ReturnStatus != null) {
            ReturnStatus(status)
        }
    });
};

export function send(msg) {
    if (conn && conn.open) {
        conn.send(msg);
        console.log("Sent: ", msg);
    } else {
        console.log('Connection is closed');
    }
}