import io from 'socket.io-client';
import {API_BASE} from "@/config.js";

const socket = io(API_BASE);

export default socket;