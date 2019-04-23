new Vue({
	el: '#app',
	data: {
		gameover: true,
		noRedo: false,
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
			// determine monster's action and execute
			if (!this.playersTurn && this.monsterHealth > 0) {
				setTimeout(() => {
					const monstersMove = this.getNumberBetween(1,3)
					switch (monstersMove) {
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
				}, 1000)
			}
		}
	},
	methods: {
		newGame: function() {
			this.gameover = false
			this.noRedo = true
			this.playersTurn = true
			this.playerHealth = 100
			this.monsterHealth = 100
			this.actionLogs = []
		},
		playerDies: function() {
			this.playerHealth = 0
			setTimeout(() => {
				if (confirm('Oh no! You were eaten by the monster. \n\nTry again?')) {
					this.newGame()
				} else {
					this.gameover = true
					this.noRedo = true
				}
			}, 500)
		},
		monsterDies: function() {
			this.monsterHealth = 0
			setTimeout(() => {
				if (confirm('Huzzah! You vanquished the monster!. \n\nPlay again?')) {
					this.newGame()
				} else {
					this.gameover = true
					this.noRedo = true
				}
			}, 500)
		},
		determineOutcome: function() {
			if (this.playerHealth <= 0) {
				this.playerDies()
			}
			if (this.monsterHealth <= 0) {
				this.monsterDies()
			}
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
				this.playersTurn = false
			} else {
				this.playerHealth -= damage
				this.playersTurn = true
			}

			// log the attack
			this.log(action, attacker, defender, damage)

			// check for winner
			this.determineOutcome()
		},
		heal: function(nursed) {
			//determine roles
			const pronoun = nursed === 'monster' ? 'itself' : 'himself'

			// determine health amount between 8 and 16
			const health = this.getNumberBetween(8,16)

			// apply health to nursed
			if (nursed === 'monster') {
				this.monsterHealth += health
				this.playersTurn = true
			} else {
				this.playerHealth += health
				this.playersTurn = false
			}

			// log the attack
			this.log('healed', nursed, pronoun, health)
		}
	}
})
