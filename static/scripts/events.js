import { UI } from "./ui.js";
import { DM } from "./data.js";

UI.loginButton.addEventListener("click", () => {
	UI.loginForm.classList.toggle("hidden");
});

UI.loginForm.addEventListener("submit", async (e) => {
	e.preventDefault();
	const formData = new FormData(UI.loginForm);
	UI.login({ email: formData.get("email"), password: formData.get("password") });
});

UI.sendForm.addEventListener("submit", async (e) => {
	e.preventDefault();
	const formData = new FormData(UI.sendForm);
	const body = {};
	if (formData.get("text").length != 0) body.text = formData.get("text");

	if (formData.get("editOf").length != 0) {
		body.id = formData.get("editOf");
		return await UI.editMessage(body);
	}
	else if (formData.get("forwardOf").length != 0) {
		body.forwardOf = formData.get("forwardOf");
	}
	return await UI.sendMessage(body);
});

UI.openRoomListButton.addEventListener("click", () => {
	UI.openRoomList();
});

document.getElementById("scroll_to_new_button").addEventListener("click", () => {
	UI.scrollToNew();
});

document.getElementById("current_user_icon").addEventListener("click", async () => {
	UI.logout();
});

document.getElementById("new_message_forward").addEventListener("click", () => {
	UI.clearReply();
});

document.getElementById("room_message_list").addEventListener("scroll", () => {
	UI.scrollCheck();
	UI.closeMessageOptions();
});

UI.messageOptions.addEventListener("focusout", () => {
	UI.closeMessageOptions();
});


setTimeout(async () => {
	await DM.init();
	UI.selectRoom(0);
	setTimeout(async () => { await UI.updateUser(); UI.scrollToNew(false); }, 200);

	UI.startTimers();
}, 100);