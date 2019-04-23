new Vue({
	el: '#app',
	data: {
		gameover: true,
		playersTurn: true,
		playerHealth: 50,
		monsterHealth: 50,
		actionLogs: [],
	},
	computed: {
		playerRemaining: function() {
			return { width: this.playerHealth + '%' }
		},
		monsterRemaining: function() {
			return { width: this.monsterHealth + '%' }
		},
		justStarted: function() {
			return this.actionLogs.length < 1
		}
	},
	watch: {
		playersTurn: function() {
			// if it's the monster's turn, determine action and execute
			if (!this.playersTurn && this.monsterHealth > 0) {
				const move = this.getNumberBetween(1,3)
				switch (move) {
					case 1:	// attack
						this.attack('player', 1)
						break

					case 2:	// special attack
						this.attack('player', 2)
						break

					case 3:	// heal
					this.playersTurn = true
						this.heal('monster')
						break
				}
			}
		}
	},

	// TODO:
	// End game win or lose triggering
	// Monster thinking time debugging 


	methods: {
		newGame: function() {
			this.gameover = false
			this.playerHealth = 100
			this.monsterHealth = 100
			this.actionLogs = []
		},
		playerDies: function() {
			this.playerHealth = 0
			setTimeout(() => {
				if (confirm('You were eaten by the monster. \n\nTry again?')) {
					this.newGame()
				} else {
					this.gameover = true
				}
			}, 500)
		},
		log: function(action, attacker, defender, damage) {
			this.actionLogs.push({
				action,
				attacker,
				defender,
				damage
			})
		},
		getNumberBetween: function(min, max) {
			const range = max - min + 1
			return Math.floor(Math.random() * range) + min
		},
		attack: function(defender, special) {
			//determine roles
			const attacker = defender === 'monster' ? 'player' : 'monster'

			// determine attack damage between 8 and 16
			// if special attack, damage doubles
			const damage = this.getNumberBetween(8,16) * special
			const action = special > 1 ? 'brutally attacked' : 'attacked'

			// apply damage to defender
			if (defender === 'monster') {
				this.monsterHealth -= damage
				setTimeout(() => {
					this.playersTurn = false
				}, 300)
			} else {
				setTimeout(() => {
					this.playerHealth -= damage
					this.playersTurn = true
				}, 900)
				// this.playersTurn = true
			}

			// log the attack
			this.log(action, attacker, defender, damage)
		},
		heal: function(nursed) {
			//determine roles
			const pronoun = nursed === 'monster' ? 'itself' : 'himself'

			// determine health amount between 8 and 16
			const health = this.getNumberBetween(8,16)

			// apply health to nursed
			if (nursed === 'monster') {
				setTimeout(() => {
					this.monsterHealth += health
					this.playersTurn = true
				}, 800)
			} else {
				this.playerHealth += health
				setTimeout(() => {
					this.playersTurn = false
				}, 800)
				// this.playersTurn = false
			}

			// log the attack
			this.log('healed', nursed, pronoun, health)
		}
	}
})