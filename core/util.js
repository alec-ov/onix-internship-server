export function Catcher(handler) {
	return async (req, res, next) => {
		try {
			await handler(req, res, next);
		}
		catch (e) {
			next(e);
		}
	};
}

export const TStyle = {
	Reset: "\x1b[0m",
	Bright: "\x1b[1m",
	Dim: "\x1b[2m",
	Underscore: "\x1b[4m",
	Blink: "\x1b[5m",
	Reverse: "\x1b[7m",
	Hidden: "\x1b[8m",

	FG: {
		Black: "\x1b[30m",
		Red: "\x1b[31m",
		Green: "\x1b[32m",
		Yellow: "\x1b[33m",
		Blue: "\x1b[34m",
		Magenta: "\x1b[35m",
		Cyan: "\x1b[36m",
		White: "\x1b[37m",
	},
	BG: {
		Black: "\x1b[40m",
		Red: "\x1b[41m",
		Green: "\x1b[42m",
		Yellow: "\x1b[43m",
		Blue: "\x1b[44m",
		Magenta: "\x1b[45m",
		Cyan: "\x1b[46m",
		White: "\x1b[47m",
	},
	Success: "",
	Error: "",
	Warning: "",

	t(s, ...styles) {
		return `${styles.join("")}${s}${this.Reset}`;
	},
	init() {
		this.Success = [this.FG.Green, this.Bright].join("");
		this.Error = [this.FG.Red, this.Bright].join("");
		this.Warning = [this.FG.Yellow, this.Bright].join("");
	}
};
TStyle.init();
