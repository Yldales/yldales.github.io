/**
 * Wyverndex Advanced Configuration
 * Données complètes pour le suivi des Wyverns ARK: Survival Evolved
 */

// Configuration des types de Wyvern avec leurs spécificités
const WYVERN_TYPES = {
    fire: {
        name: 'Feu',
        nameEn: 'Fire',
        color: '#ff4757',
        gradient: 'linear-gradient(45deg, #ff4757, #ff6348)',
        icon: '🔥',
        specialAttack: 'Souffle de feu',
        damage: 'DoT (8% max HP sur 6s)',
        resistance: 'Immunité au feu',
        habitat: ['Scorched Earth', 'Ragnarok', 'Valguero', 'Genesis']
    },
    lightning: {
        name: 'Foudre',
        nameEn: 'Lightning',
        color: '#3742fa',
        gradient: 'linear-gradient(45deg, #3742fa, #5352ed)',
        icon: '⚡',
        specialAttack: 'Rayon de foudre',
        damage: '25 par tick, perce armure',
        resistance: 'Immunité à la foudre',
        habitat: ['Scorched Earth', 'Ragnarok', 'Valguero', 'Genesis']
    },
    poison: {
        name: 'Poison',
        nameEn: 'Poison',
        color: '#2ed573',
        gradient: 'linear-gradient(45deg, #2ed573, #7bed9f)',
        icon: '☠️',
        specialAttack: 'Projectile toxique',
        damage: '100 impact + nuage toxique',
        resistance: 'Immunité au poison',
        habitat: ['Scorched Earth', 'Ragnarok', 'Valguero', 'Genesis']
    },
    ice: {
        name: 'Glace',
        nameEn: 'Ice',
        color: '#70a1ff',
        gradient: 'linear-gradient(45deg, #70a1ff, #5352ed)',
        icon: '❄️',
        specialAttack: 'Souffle glacial',
        damage: '20 par projectile + ralentissement',
        resistance: 'Immunité au froid',
        habitat: ['Ragnarok', 'Valguero', 'Fjordur']
    },
    forest: {
        name: 'Forêt',
        nameEn: 'Forest',
        color: '#ff9f43',
        gradient: 'linear-gradient(45deg, #ff9f43, #ffa502)',
        icon: '🌲',
        specialAttack: 'Souffle de feu',
        damage: 'Similaire au Wyvern de feu',
        resistance: 'Temporaire (boss summon)',
        habitat: ['Extinction']
    }
};

// Mécaniques de croissance et consommation
const GROWTH_MECHANICS = {
    stages: {
        baby: {
            start: 0,
            end: 10,
            name: 'Baby',
            consumptionMultiplier: 1.0,    // 360 food/hour (base rate)
            feedingRequired: true,
            imprintPossible: true
        },
        juvenile: {
            start: 10,
            end: 50,
            name: 'Juvenile',
            consumptionMultiplier: 0.556,  // 200 food/hour 
            feedingRequired: true,
            imprintPossible: true
        },
        adolescent: {
            start: 50,
            end: 100,
            name: 'Adolescent',
            consumptionMultiplier: 0.278,  // 100 food/hour
            feedingRequired: true,
            imprintPossible: false
        },
        adult: {
            start: 100,
            end: 100,
            name: 'Adulte',
            consumptionMultiplier: 0,
            feedingRequired: false,
            imprintPossible: false
        }
    },
    maturationTimes: {
        incubation: 5 * 60 * 60, // 5 heures en secondes
        baby: 9.25 * 60 * 60,    // 9h15m
        juvenile: 37 * 60 * 60,   // 1j13h
        adolescent: 46.3 * 60 * 60, // 1j22h
        total: 97.55 * 60 * 60    // 3j20h35m
    }
};

// Configuration par défaut de l'application
const DEFAULT_CONFIG = {
    // Mécaniques de base
    foodConsumptionRate: 0.1,  // Nourriture par seconde (360/heure pour Baby - ARK officiel)
    babyStageEnd: 10,          // Pourcentage de fin du stade baby
    juvenileStageEnd: 50,      // Pourcentage de fin du stade juvenile
    
    // Objets de nourriture
    milkFoodValue: 1200,       // Points de nourriture par lait de Wyvern
    milkSpoilTime: 30,         // Minutes avant que le lait ne se gâte (inventaire joueur)
    
    // Calculs avancés
    baseMetabolism: 0.025,     // Métabolisme de base
    temperatureEffect: 1.0,    // Multiplicateur de température
    growthMultiplier: 1.0,     // Multiplicateur de vitesse de croissance
    foodConsumptionMultiplier: 1.0, // Multiplicateur de consommation de nourriture
    serverMultiplier: 1.0,     // Multiplicateur serveur global (rétrocompatibilité)
    
    // Interface utilisateur
    updateInterval: 1000,      // Intervalle de mise à jour (ms)
    alertThresholds: {
        critical: 200,         // Seuil critique de nourriture
        warning: 500,          // Seuil d'avertissement
        urgent: 30             // Minutes avant famine pour alerte urgente
    },
    
    // Données de sauvegarde
    autoSave: true,            // Sauvegarde automatique
    backupInterval: 5,         // Intervalle de backup (minutes)
    maxBackups: 10             // Nombre maximum de backups
};

// Statistiques de base des Wyverns (niveau 1)
const BASE_STATS = {
    health: 1295,
    stamina: 315,
    oxygen: 150,
    food: 1800,
    weight: 400,
    meleeDamage: 80,
    movementSpeed: 100,
    torpidity: 725
};

// Multiplicateurs de level-up
const LEVELUP_MULTIPLIERS = {
    health: 194.25,
    stamina: 15.75,
    oxygen: 15,
    food: 180,
    weight: 8,
    meleeDamage: 4,
    movementSpeed: 0, // Les Wyverns ne peuvent pas level la vitesse
    torpidity: 43.5
};

// Fonctions utilitaires pour les calculs
const WyvernCalculations = {
    // Calcule le stade de croissance actuel
    getCurrentStage(growthPercentage) {
        for (const [key, stage] of Object.entries(GROWTH_MECHANICS.stages)) {
            if (growthPercentage >= stage.start && growthPercentage < stage.end) {
                return { key, ...stage };
            }
        }
        return { key: 'adult', ...GROWTH_MECHANICS.stages.adult };
    },
    
    // Calcule la consommation de nourriture par seconde
    getFoodConsumptionRate(growthPercentage, config = DEFAULT_CONFIG) {
        const stage = this.getCurrentStage(growthPercentage);
        // Utilise le nouveau multiplicateur de consommation de nourriture spécifique
        // Garde la rétrocompatibilité avec serverMultiplier si les nouveaux champs n'existent pas
        const foodMultiplier = config.foodConsumptionMultiplier !== undefined 
            ? config.foodConsumptionMultiplier 
            : config.serverMultiplier;
        return config.foodConsumptionRate * stage.consumptionMultiplier * foodMultiplier;
    },
    
    // Calcule le temps avant famine
    getTimeToStarvation(currentFood, growthPercentage, config = DEFAULT_CONFIG) {
        const consumptionRate = this.getFoodConsumptionRate(growthPercentage, config);
        if (consumptionRate === 0 || currentFood <= 0) {
            return consumptionRate === 0 ? Infinity : 0;
        }
        return currentFood / consumptionRate;
    },
    
    // Calcule la quantité de lait nécessaire pour X heures
    getMilkNeeded(hours, growthPercentage, config = DEFAULT_CONFIG) {
        const consumptionRate = this.getFoodConsumptionRate(growthPercentage, config);
        const totalFoodNeeded = consumptionRate * hours * 3600;
        return Math.ceil(totalFoodNeeded / config.milkFoodValue);
    },
    
    // Calcule le temps de croissance ajusté selon le multiplicateur de croissance
    getAdjustedGrowthTime(baseTimeSeconds, config = DEFAULT_CONFIG) {
        const growthMultiplier = config.growthMultiplier !== undefined 
            ? config.growthMultiplier 
            : config.serverMultiplier;
        return baseTimeSeconds / growthMultiplier;
    },
    
    // Calcule le temps restant pour atteindre l'âge adulte
    getTimeToAdult(currentGrowthPercentage, config = DEFAULT_CONFIG) {
        if (currentGrowthPercentage >= 100) return 0;
        
        const totalGrowthTime = this.getAdjustedGrowthTime(GROWTH_MECHANICS.maturationTimes.total, config);
        const currentTime = (currentGrowthPercentage / 100) * totalGrowthTime;
        return totalGrowthTime - currentTime;
    },
    
    // Formate le temps en format lisible
    formatTime(seconds) {
        if (seconds === Infinity) return 'Adulte';
        if (seconds <= 0) return 'Affamé';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    },
    
    // Calcule les stats à un niveau donné
    getStatsAtLevel(level, baseStats = BASE_STATS) {
        const stats = { ...baseStats };
        const levelUps = level - 1;
        
        for (const [stat, base] of Object.entries(baseStats)) {
            if (LEVELUP_MULTIPLIERS[stat]) {
                stats[stat] = base + (LEVELUP_MULTIPLIERS[stat] * levelUps);
            }
        }
        
        return stats;
    }
};

// Export pour utilisation dans l'application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        WYVERN_TYPES,
        GROWTH_MECHANICS,
        DEFAULT_CONFIG,
        BASE_STATS,
        LEVELUP_MULTIPLIERS,
        WyvernCalculations
    };
}

// Export global pour utilisation dans le navigateur
if (typeof window !== 'undefined') {
    window.WyvernData = {
        WYVERN_TYPES,
        GROWTH_MECHANICS,
        DEFAULT_CONFIG,
        BASE_STATS,
        LEVELUP_MULTIPLIERS,
        WyvernCalculations
    };
}
