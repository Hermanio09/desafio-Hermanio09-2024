const recintos = [
    { numero: 1, bioma: "savana", tamanho: 10, animais: [{ especie: "MACACO", quantidade: 3 }] },
    { numero: 2, bioma: "floresta", tamanho: 5, animais: [] },
    { numero: 3, bioma: "savana e rio", tamanho: 7, animais: [{ especie: "GAZELA", quantidade: 1 }] },
    { numero: 4, bioma: "rio", tamanho: 8, animais: [] },
    { numero: 5, bioma: "savana", tamanho: 9, animais: [{ especie: "LEAO", quantidade: 1 }] }
];

const animaisPermitidos = {
    LEAO: { tamanho: 3, biomas: ["savana"], carnivoro: true },
    LEOPARDO: { tamanho: 2, biomas: ["savana"], carnivoro: true },
    CROCODILO: { tamanho: 3, biomas: ["rio"], carnivoro: true },
    MACACO: { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
    GAZELA: { tamanho: 2, biomas: ["savana"], carnivoro: false },
    HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"], carnivoro: false }
};

class RecintosZoo {

    analisaRecintos(especie, quantidade) {
        if (!animaisPermitidos[especie]) {
            return { erro: "Animal inválido" };
        }

        if (isNaN(quantidade) || quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const animalInfo = animaisPermitidos[especie];
        const tamanhoNecessario = animalInfo.tamanho * quantidade;

        let recintosViaveis = recintos.filter(recinto => {
            if (!animalInfo.biomas.includes(recinto.bioma) && !(animalInfo.biomas.length > 1 && recinto.bioma.includes('e'))) {
                return false;
            }

            let espacoOcupado = recinto.animais.reduce((total, animal) => {
                const especieAtual = animaisPermitidos[animal.especie];
                return total + (especieAtual.tamanho * animal.quantidade);
            }, 0);

            let espacoExtra = recinto.animais.length > 0 && recinto.animais[0].especie !== especie ? 1 : 0;

            let espacoDisponivel = recinto.tamanho - espacoOcupado - espacoExtra;
            if (espacoDisponivel < tamanhoNecessario) {
                return false;
            }

            if (animalInfo.carnivoro && recinto.animais.some(animal => animal.especie !== especie)) {
                return false;
            }

            if (especie === "HIPOPOTAMO" && recinto.bioma !== "savana e rio") {
                return false;
            }

            if (especie === "MACACO" && recinto.animais.length === 0 && quantidade < 2) {
                return false;
            }

            return true;
        });

        recintosViaveis.sort((a, b) => a.numero - b.numero);

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return {
            recintosViaveis: recintosViaveis.map(recinto => {

                let espacoOcupado = recinto.animais.reduce((total, animal) => {
                    const especieAtual = animaisPermitidos[animal.especie];
                    return total + (especieAtual.tamanho * animal.quantidade);
                }, 0);
        
                let espacoExtra = (recinto.animais.length > 0 && recinto.animais.some(animal => animal.especie !== especie)) ? 1 : 0;
        
                let espacoDisponivel = recinto.tamanho - espacoOcupado - espacoExtra;
        
                return `Recinto ${recinto.numero} (espaço livre: ${espacoDisponivel} total: ${recinto.tamanho})`;
            })
        };
        
    }

}

export { RecintosZoo as RecintosZoo };