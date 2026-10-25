export const BigStats = {

    Strength: 30,
    Speed: 30,
    Endurance: 30,

    Energy: 100,

    // CAPS
    MaxStrength: 100,
    MaxSpeed: 100,
    MaxEndurance: 100,
    MaxEnergy: 100,

    //Adds strength without exceeding the cap
    addStrength(amount: number) {
        this.Strength = Math.min(
            this.Strength + amount,
            this.MaxStrength
        );
    },

    //Adds speed without exceeding the cap
    addSpeed(amount: number) {
        this.Speed = Math.min(
            this.Speed + amount,
            this.MaxSpeed
        );
    },

    //Adds endurance without exceeding the cap
    addEndurance(amount: number) {
        this.Endurance = Math.min(
            this.Endurance + amount,
            this.MaxEndurance
        );
    },

    //Energy spending
    useEnergy(amount: number): boolean {

        // Pas assez d'énergie
        if (this.Energy < amount) {
            return false;
        }

        this.Energy -= amount;
        return true;
    },

    //Restores energy without exceeding the cap
    restoreEnergy(amount: number) {
        this.Energy = Math.min(
            this.Energy + amount,
            this.MaxEnergy
        );
    },

    // Checks if the player has enough energy to perform an action
    hasEnoughEnergy(amount: number): boolean {
        return this.Energy >= amount;
    }
};