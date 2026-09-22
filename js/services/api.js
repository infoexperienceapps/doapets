import { CONFIG } from '../config.js';

export const ApiService = {
  async getAnimals() {
    if (CONFIG.IS_MOCK) {
      return [
        {
          id: "pet-1",
          name: "Pipoca",
          species: "Cachorro",
          age: "2 anos",
          sex: "Fêmea",
          city: "Formiga, MG",
          status: "Disponível",
          summary: "Muito dócil, brincalhona e adora crianças."
        }
      ];
    }
    const res = await fetch(`${CONFIG.API_BASE_URL}/animals`);
    return await res.json();
  }
};
