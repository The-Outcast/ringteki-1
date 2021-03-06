const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class Softskin extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.unlessActionCost({
                actionName: 'ready',
                cost: card => AbilityDsl.actions.discardCard({ target: card.controller.conflictDeck.size() > 2 ? card.controller.conflictDeck.first(3) : [] })
            })
        });
    }
}

Softskin.id = 'softskin';

module.exports = Softskin;
