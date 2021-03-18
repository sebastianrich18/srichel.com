exports.diceHandler = (io) => {
	let readyPlayers = [];
	let state = "wait";
	let SOCKET_LIST = [];
	let playerTurn = 1;
	let p1Id;
	let p2Id;
	let p1Roll;
	let p2Roll;
	let gameIntervaID;
	let gameRunning;

	console.log("dice handler started");
	


	io.sockets.on('connection', function (socket) {
		socket.id = Math.floor(1000 * Math.random());
		SOCKET_LIST.push(socket);
		console.log("socket connected with id " + socket.id);

		socket.on('requestRoll', function () {
			console.log("Socket with id " + socket.id + " requested roll")
			pack = [
				Math.floor(6 * Math.random()) + 1,
				Math.floor(6 * Math.random()) + 1,
				Math.floor(6 * Math.random()) + 1
			];
			let uncheckedRoll = checkRoll(pack);
			if (uncheckedRoll != -1) {
				if (playerTurn == 1) {
					p1Roll = uncheckedRoll;
				} else if (playerTurn == 2) {
					p2Roll = uncheckedRoll;
				}
			}
			for (let i in SOCKET_LIST) {
				let socket = SOCKET_LIST[i];
				socket.emit("roll", pack);
			}
		});

		socket.on('getState', function () {
			if (!gameRunning && state == "game") {
				startGame();
			}
			socket.emit('state', state);
		});

		socket.on('requestNumReady', function () {
			socket.emit('numReady', readyPlayers.length);
		});

		socket.on('ready', function () {
			if (readyPlayers.length == 0) {
				p1Id = socket.id;
				socket.emit('playerNumber', 1);
			} else if (readyPlayers.length == 1) {
				p2Id = socket.id;
				socket.emit('playerNumber', 2);
			}
			if (readyPlayers.every(p => { return p != socket.id; })) {
				readyPlayers.push(socket.id)
				console.log('socket with id ' + socket.id + " is ready");
			}

			socket.emit('numReady', readyPlayers.length);
		});

		socket.on('disconnect', function () {
			SOCKET_LIST.splice(SOCKET_LIST.indexOf(socket), 1);
			readyPlayers.splice(readyPlayers.indexOf(socket.id), 1);
			console.log('socket disconnected with id ' + socket.id);
		});
	});

	function checkRoll(arr) {
		arr.sort();

		if (arr[0] == 1 && arr[1] == 2 && arr[2] == 3) {
			return '123';

		} else if (arr[0] == 4 && arr[1] == 5 && arr[2] == 6) {
			return '456';

		} else if (arr[0] == arr[1] && arr[1] == arr[2]) {

			switch (arr[0]) {
				case 1:
					return '111';
				case 2:
					return '222';
				case 3:
					return '333';
				case 4:
					return '444';
				case 5:
					return '555';
				case 6:
					return '666';
			}
		}
		let matchingNum = 0;
		let match = false;
		for (let i = 0; i < 3; i++) {
			let num = arr[i];
			for (let j = 0; j < 3; j++) {
				if (i != j && num == arr[j]) {
					match = true;
					matchingNum = num;
				}
			}
		}
		let otherNum = -1;
		for (let i = 0; i < 3; i++) {
			if (arr[i] != matchingNum) {
				otherNum = arr[i];
			}
		}
		if (match) {
			switch (otherNum) {
				case 1:
					return '1';
				case 2:
					return '2';
				case 3:
					return '3';
				case 4:
					return '4';
				case 5:
					return '5';
				case 6:
					return '6';
			}
		}
		return -1;
	}

	function checkWinner() {
		let rollOrder = ['123', '1', '2', '3', '4', '5', '6', '111', '222', '333', '444', '555', '666', '456'];
		let p1RollRank = rollOrder.indexOf(p1Roll);
		let p2RollRank = rollOrder.indexOf(p2Roll);
		console.log('p1RollRank ' + p1RollRank + '\t p2RollRank ' + p2RollRank)
		if (p1RollRank == p2RollRank) {
			return -1;
		} else if (p1RollRank > p2RollRank) {
			return 1;
		} else {
			return 2;
		}
	}

	function stopGame() {
		clearInterval(gameIntervaID);
		console.log('game stopped');
		gameRunning = false;
		readyPlayers = [];
		p1Id = undefined;
		p2Id = undefined;
		p1Roll = undefined;
		p2Roll = undefined;
		p1RollRank = undefined;
		p2RollRank = undefined;
		playerTurn = 1;
	}

	function startGame() {
		console.log('game started');
		gameRunning = true;
		let winner;
		gameIntervaID = setInterval(function () {
			if (p1Roll && !p2Roll) {
				//console.log('player 1 rolled a ' + p1Roll);
				playerTurn = 2;
			}
			SOCKET_LIST.forEach(s => {
				s.emit('turn', playerTurn);
			});
			if (p2Roll) {
				winner = checkWinner();
			}
			if (winner) {
				SOCKET_LIST.forEach(s => {
					s.emit('winner', winner);
				});
				if (gameRunning) {
					state = 'winner';
					setTimeout(stopGame, 4000);
				}
			}
		}, 500);
	}

	setInterval(function () {
		//console.log(state);
		if (readyPlayers.length == 2 && !gameRunning) {
			state = 'game';
		} else if (!gameRunning) {
			state = 'wait';
		}
	}, 100);
}