const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl.js');

class TheRoarOfTheLioness extends ProvinceCard {
    setupCardAbilities() { // eslint-disable-line no-unused-vars
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyBaseProvinceStrength(card => Math.round(card.controller.honor / 2))
        });
    }
}

TheRoarOfTheLioness.id = 'the-roar-of-the-lioness';

module.exports = TheRoarOfTheLioness;
