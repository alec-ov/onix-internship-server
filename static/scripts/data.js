export const DM = {
	User: null,
	Rooms: [],
	currentRoom: 0,

	cookies: [],

	updateCookies() {
		this.cookies = [];
		for (let el of document.cookie.split(";")) {
			const [name, value] = el.split("=");
			this.cookies[name.trim()] = value;
		}

		if (this.cookies["user"]) {
			this.User = JSON.parse(decodeURIComponent(this.cookies["user"]));
		}
	},

	error(error) {
		alert(JSON.stringify(error));
	},
	async login(body) {
		const response = await fetch("/json/user/login", {
			method: "post",
			body: JSON.stringify(body),
			credentials: "include",
			headers: {
				"Content-Type": "application/json;charset=utf-8"
			}
		});
		this.updateCookies();
		const result = await response.json();
		if (result.status == 200) {
			this.User = result.data;

			await this.getRooms();

			return this.User;
		}
		else {
			this.error(result.error);
			return null;
		}
	},
	async logout() {
		const response = await fetch("/json/user/logout", {
			method: "get",
			credentials: "include",
		});
		this.updateCookies();
		const result = await response.json();
		if (result.status == 200) {
			this.User = null;
			this.Rooms = [];
			this.currentRoom = -1;
			return true;
		}
		else {
			this.error(result.error);
			return false;
		}
	},

	/**
	 * Loads room list from the server
	 */
	async getRooms() {
		if (!this.User) return null;
		const response = await fetch("/json/room/find?user=" + this.User._id, { method: "get", credentials: "include" });
		this.updateCookies();
		const result = await response.json();

		if (result.status == 200) {
			const currentId = this.Rooms[this.currentRoom]?._id ?? 0;
			this.Rooms = result.data.map((room, index) => {
				room.messages = [];
				room.lastMessage = new Date(0);

				if (room._id == currentId) {
					this.currentRoom = index; // current room might have moved to another index, update index
				}
				return room;
			});
		}
		else {
			this.error(result.error);
		}
	},
	/**
	 * Loads messages for the current room
	 * @param {boolean} onlyNew only load messeges sent after the last known message
	 * @returns {boolean} wether the requets passed successfully
	 */
	async getMessages(onlyNew = true) {
		if (!this.Rooms[this.currentRoom]) return false;
		const response = await fetch(
			"/json/room/" + this.Rooms[this.currentRoom]._id + "/messages" +
			(onlyNew ? ("?date=" + this.Rooms[this.currentRoom].lastMessage.toISOString() || new Date()) : ""),
			{
				method: "get",
				credentials: "include"
			});
		this.updateCookies();
		const result = await response.json();

		if (result.status == 200) {
			if (result.data.length == 0) return false;

			this.Rooms[this.currentRoom].messages.push(...result.data);
			this.Rooms[this.currentRoom].lastMessage =
				onlyNew ? new Date(result.data[result.data.length - 1].edited_at) : new Date(0);

			return true;
		}
		else {
			this.error(result.error);
		}
		return false;
	},
	async sendMessage(msg) {
		if (!this.User) return;
		//msg.room = Rooms[currentRoom]._id;
		msg.author = this.User._id;
		const response = await fetch("/json/room/" + this.Rooms[this.currentRoom]._id + "/messages/send",
			{
				method: "post",
				body: JSON.stringify(msg),
				credentials: "include",
				headers: {
					"Content-Type": "application/json;charset=utf-8"
				}
			});
		this.updateCookies();
		const result = await response.json();

		if (result.status == 201) {
			return true;
		}
		else {
			this.error(result.error);
			return false;
		}
	},
	async editMessage(msg) {
		if (!this.User) return;
		//msg.room = Rooms[currentRoom]._id;
		msg.author = this.User._id;
		const response = await fetch("/json/room/" + this.Rooms[this.currentRoom]._id + "/messages/edit",
			{
				method: "post",
				body: JSON.stringify(msg),
				credentials: "include",
				headers: {
					"Content-Type": "application/json;charset=utf-8"
				}
			});
		this.updateCookies();
		const result = await response.json();

		if (result.status == 200) {
			return true;
		}
		else {
			this.error(result.error);
			return false;
		}
	},
	async deleteMessage(msg) {
		if (!this.User) return;
		//msg.room = Rooms[currentRoom]._id;
		//msg.author = this.User._id;
		const response = await fetch("/json/room/" + this.Rooms[this.currentRoom]._id + "/messages/delete",
			{
				method: "post",
				body: JSON.stringify({id: msg._id, author: this.User._id}),
				credentials: "include",
				headers: {
					"Content-Type": "application/json;charset=utf-8"
				}
			});
		this.updateCookies();
		const result = await response.json();

		if (result.status == 200) {
			return true;
		}
		else {
			this.error(result.error);
			return false;
		}
	},

	async init() {
		this.updateCookies();
		await this.getRooms();
		await this.getMessages(false);
	},

	/**
	 * Generates a cololor for the user icon
	 * Sets the user.color field to returned color.
	 * Sets user.darkColor=true if the color is too dark and needs wjite text
	 * @param {{name: string, color: string?, darkColor: boolean?}} user 
	 * @returns {string} a sctring containing a css hex color.
	 * 
	 */
	userColor(user) {
		if (!user || !user.name) return "#ff4444";
		if (user.color) return user.color;
		const hexNumber = (c) => {
			if (c.length == 1) return c + "0";
			return c;
		};
		let n = user.name.charCodeAt(0);
		let n2 = user.name.charCodeAt(user.name.length - 1);
		let r = (((n + n2) % 16) * 16);
		let g = ((n2 % 16) * 32);
		let b = ((n % 32) * 8);
		user.color = "#" + hexNumber(r.toString(16)) + hexNumber(g.toString(16)) + hexNumber(b.toString(16));
		if ((r + g + b) / 3 < 100) {
			user.darkColor = true;
		}
		else {
			user.darkColor = false;
		}
		return user.color;
	},
	userIconEl(user) {
		if (!user) return "";
		const name = user.name;
		if (!name) return;
		const a = name[0];
		const b = name.length > 1 ? name[name.length - 1] : "";
		return `<div class="user_icon" role="button"
		style="background-color: ${this.userColor(user)};${user.darkColor ? "color: white" : ""}">${a + (b ?? "")}</div>`;
	},
	/**
	 * Generates an HTML element of a message
	 * @param {Message} message 
	 * @param {Number} level "forwrding level" -- how deep is this message in the "reply" of other messages
	 * @returns {string} HTML string with message lement
	 */
	messageEl(message, level = 0) {
		let forward = "";
		if (message.forwardOf) {
			if (level < 1) {
				forward = "<section class='forward'>" + this.messageEl(message.forwardOf, level + 1) + "</section>";
			} else { // do not continue deeper than 1 reply
				forward = `
				<section class='forward message far_forward' id='forward_${level + 1}_of_${message.forwardOf}'>
					reply
				</section>`;
			}
		}
		return `<article class="message" id="${level == 0 ? "msg" : "forward_" + level + "_of"}_${message._id}">
		${level == 0 ? this.userIconEl(message.author) : ""}
		<span class="message_author" style="color: ${this.userColor(message.author)}">${message.author?.name ?? ""}</span><br>
		${forward ? forward + "<br>" : ""}` +
			(message.text ? `<span class="message_text">${message.text}</span>` : "") +
			`<time>${message.edited_at==message.sent_at?"":"edited "}${new Date(message.edited_at).toLocaleTimeString()}</time>
			</article>`;
	},
	roomHeaderEl(room) {
		return `<h2 class="room_name">${room.name}</h2>`;
	},
	roomListEl(room) {
		return `<div id="room_${room._id}" role="button" class="room_list_element"><h2 class="room_name">${room.name}</h2></div>`;
	},

	getRoom() {
		return this.Rooms[this.currentRoom];
	},
	async selectRoom(index) {
		if (!this.User) {
			this.currentRoom = -1;
			return null;
		}
		// if (this.currentRoom >= 0)
		// 	this.Rooms[this.currentRoom].messages = [];
		this.currentRoom = index;
		//const day = new Date();
		//day.setDate(day.getDate() - 5);
		this.Rooms[this.currentRoom].lastMessage = new Date(0);
		//await this.getMessages(true);
		return this.Rooms[this.currentRoom];
	}
};