class WebSocketClient {
    constructor() {
        this.ws = null;
        this.listeners = new Map();
    }

    connect(token = '0e417407f01e9ec5a2ed700d506cd249ca36be1c') {
        if (this.ws) {
            this.ws.close();
        }

        this.ws = new WebSocket(`ws://127.0.0.1:3001/${token}`);

        this.ws.onopen = () => {
            console.log('WebSocket Connected');
            this.emit('connected', true);
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.emit('message', data);
            } catch (error) {
                console.error('WebSocket message parse error:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket Disconnected');
            this.emit('connected', false);
            // Try to reconnect after 5 seconds
            setTimeout(() => this.connect(token), 5000);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            this.emit('error', error);
        };
    }

    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(typeof message === 'string' ? message : JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected');
        }
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

// Create a singleton instance
const websocket = new WebSocketClient();
export default websocket; 