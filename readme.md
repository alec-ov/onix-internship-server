This is a small chat server made for educational purposes.

*.env* Should contain:
- `PORT` server hosting port.
- `DB_PASSWORD` MongoDB atlas password.
- `JWT_SECRET` a string that will be used when signing and verifying tokens.
## Models
### User
- `name` string.
- `birthday` date, optional.
- `email` string, should be unique, as it will be used to identify users.
- `password` string, stores a hash.
- `role` string, one of `["user", "admin"]`. Will be used later for protected routes.

### Room
- `name` string.
- `description` string, optional.
- `users` ObjectId[] contains members of this room.
- `owner` ObjectId of a `User` that created this room.
### Message
- `room` ObjectId of the `Room` this message is in.
- `author` ObjectId of a `User` that sent this message
- `text` string
- `forwardOf` ObjectId of another message, optional.
If defined and `text` is empty this message is a "repost".
If defined and `text` is present this message is a "reply".
## Routes
### User
- `/json/user`
	- `get` returns list of all users
	- `post` creates a user. Add `?autoLogin=true` to login afterwards
- `/json/user/<id>`
	- `get` returns one user mathcing `id`
	- `delete` delets one user. Requires login
	- `post` updates one user. Requires login. 
	`password` cannot be updated
- `get` `/json/user/name/<name>` Finds all users with `user.name` **exactly matching** name
- `post` `/json/user/login` Checks password and sets a JWT cookie if successful.
 `body` = `{<id:"" || email:"">, password: ""}`
- `get` `/json/user/logout` Removes all auth cookies

### Room
- `/json/room`
	- `get` returns list of all rooms
	- `post` create a room. Login required
- `get` `/json/room/find/?user=<user.id>` Finds all rooms that `user` is a member of
- `/json/room/<id>`
	- `get` returns one room mathcing `id`
	- `delete` delets one room. Requires login
	- `post` updates one room. Requires login. 
- `post` `json/room/<id>/send` adds `body` as a `Message` to db and links it to room matching `id`. Login required. `message.author` needs to be a userId in this room's `users` array

- `get` `json/room/<id>/messages` returns all messages of this room
all rooms are public to read(_for now?_)
- `get` `json/room/<id>/messages/search?<query>` selects **all** messages of the room that match `query`, that may contain:
	- `text` a string that `message.text` should **contain**
	- `author` string (userId),
	- `fromDate` string with ISO Date,
	- `toDate` string with ISO Date
- `post` `/json/room/<id>/join` adds user with `user.id == body.id` to room `id`. _For now_ anyone can "invite" anyone to any room
- `post` `/json/room/<id>/leave` removes user with `user.id = body.id` from room `id`. _For now_ anyone can "kick" anyone from any room _=)_

- `get` `/json/room/name/<name>` Finds all rooms with `room.name` **exactly matching** `name`

### Message
Does not have routes of its own. All actions are done through `Room`
