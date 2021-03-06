describe('Soshi Shadowshaper', function() {
    integration(function() {
        describe('Soshi Shadowshaper\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['soshi-shadowshaper'],
                        dynastyDiscard: ['hidden-moon-dojo', 'brash-samurai'],
                        hand: ['adept-of-shadows']
                    },
                    player2: {
                        inPlay: ['doomed-shugenja'],
                        hand: ['tattooed-wanderer', 'togashi-kazue', 'charge', 'assassination'],
                        dynastyDeck: ['togashi-yokuni']
                    }
                });
                this.soshiShadowshaper = this.player1.findCardByName('soshi-shadowshaper');
                this.hiddenMoonDojo = this.player1.placeCardInProvince('hidden-moon-dojo', 'province 1');
                this.hiddenMoonDojo.facedown = false;
                this.yokuni = this.player2.placeCardInProvince('togashi-yokuni', 'province 1');
                this.brash = this.player1.placeCardInProvince('brash-samurai', 'province 2');
                this.brash.facedown = false;
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
            });

            it('should only trigger in the conflict phase', function() {
                this.player1.pass();
                this.player2.playCharacterFromHand('tattooed-wanderer');
                this.player1.clickCard('soshi-shadowshaper');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should only be able to target characters which were played during the current phase and who cost 2 or less', function() {
                this.player1.pass();
                this.tattooedWanderer = this.player2.playCharacterFromHand('tattooed-wanderer');
                this.noMoreActions();
                expect(this.game.currentPhase).toBe('conflict');
                this.adeptOfShadows = this.player1.playCharacterFromHand('adept-of-shadows');
                this.togashiKazue = this.player2.playCharacterFromHand('togashi-kazue');
                this.soshiShadowshaper = this.player1.clickCard('soshi-shadowshaper');
                expect(this.player1).toHavePrompt('Soshi Shadowshaper');
                expect(this.player1).toBeAbleToSelect(this.adeptOfShadows);
                expect(this.player1).not.toBeAbleToSelect(this.tattooedWanderer);
                expect(this.player1).not.toBeAbleToSelect(this.togashiKazue);
            });

            it('should be able to target characters which were played as if from hand', function() {
                this.noMoreActions();
                expect(this.game.currentPhase).toBe('conflict');
                this.player1.clickCard(this.brash);
                this.player1.clickPrompt('0');
                this.player2.pass();
                this.soshiShadowshaper = this.player1.clickCard('soshi-shadowshaper');
                expect(this.player1).toHavePrompt('Soshi Shadowshaper');
                expect(this.player1).toBeAbleToSelect(this.brash);
                this.player1.clickCard(this.brash);
                expect(this.brash.location).toBe('dynasty discard pile');
            });

            it('should target characters played from hand by either player', function() {
                this.noMoreActions();
                expect(this.game.currentPhase).toBe('conflict');
                this.adeptOfShadows = this.player1.playCharacterFromHand('adept-of-shadows');
                this.tattooedWanderer = this.player2.playCharacterFromHand('tattooed-wanderer');
                this.soshiShadowshaper = this.player1.clickCard('soshi-shadowshaper');
                this.doomedShugenja = this.player2.findCardByName('doomed-shugenja');
                expect(this.player1).toHavePrompt('Soshi Shadowshaper');
                expect(this.player1).toBeAbleToSelect(this.adeptOfShadows);
                expect(this.player1).toBeAbleToSelect(this.tattooedWanderer);
                expect(this.player1).not.toBeAbleToSelect(this.doomedShugenja);
            });

            it('should return the character to hand', function() {
                this.noMoreActions();
                expect(this.game.currentPhase).toBe('conflict');
                this.adeptOfShadows = this.player1.playCharacterFromHand('adept-of-shadows');
                this.tattooedWanderer = this.player2.playCharacterFromHand('tattooed-wanderer');
                this.soshiShadowshaper = this.player1.clickCard('soshi-shadowshaper');
                this.player1.clickCard(this.tattooedWanderer);
                expect(this.tattooedWanderer.location).toBe('hand');
            });

            it('should be able to \'see\' characters which left play before it arrived', function() {
                this.player1.placeCardInProvince(this.soshiShadowshaper, 'province 2');
                this.noMoreActions();
                this.player1.pass();
                this.tattooedWanderer = this.player2.playCharacterFromHand('tattooed-wanderer');
                this.player1.clickCard(this.soshiShadowshaper);
                this.player1.clickPrompt('0');
                expect(this.soshiShadowshaper.location).toBe('play area');
                this.player2.pass();
                this.player1.clickCard(this.soshiShadowshaper);
                expect(this.player1).toHavePrompt('Soshi Shadowshaper');
                expect(this.player1).toBeAbleToSelect(this.tattooedWanderer);
            });

            it('should interact correctly with Togashi Yokuni', function() {
                this.noMoreActions();
                this.adeptOfShadows = this.player1.playCharacterFromHand('adept-of-shadows');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['soshi-shadowshaper'],
                    defenders: []
                });
                this.player2.clickCard('charge');
                this.player2.clickCard(this.yokuni);
                expect(this.yokuni.inConflict).toBe(true);
                this.player1.pass();
                this.player2.clickCard(this.yokuni);
                this.player2.clickCard(this.soshiShadowshaper);
                this.player1.pass();
                this.player2.clickCard(this.yokuni);
                expect(this.player2).toHavePrompt('Togashi Yokuni');
                this.player2.clickCard(this.adeptOfShadows);
                expect(this.adeptOfShadows.location).toBe('hand');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
