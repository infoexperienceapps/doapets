class Store {
  constructor() {
    const savedUser = localStorage.getItem('doapets_user');
    const savedRequests = localStorage.getItem('doapets_requests');
    const savedAnimals = localStorage.getItem('doapets_animals');
    const savedNews = localStorage.getItem('doapets_news');

    this.state = {
      currentUser: savedUser ? JSON.parse(savedUser) : null,
      requests: savedRequests ? JSON.parse(savedRequests) : [],
      animals: savedAnimals ? JSON.parse(savedAnimals) : [],
      news: savedNews ? JSON.parse(savedNews) : [
        {
          id: "news-1",
          title: "Campanha de Vacinação e Adoção",
          content: "Atendimento com a equipe voluntária na Praça Central. Venha conhecer nossos resgatados!",
          date: "14/09/2026",
          eventDate: "2026-09-26",
          eventTime: "09:00 às 15:00",
          author: "DoaPets Oficial"
        }
      ]
    };
    this.listeners = [];
  }

  isAdmin() {
    if (!this.state.currentUser || this.isGuest()) return false;
    const name = (this.state.currentUser.name || "").toLowerCase().trim();
    const email = (this.state.currentUser.email || "").toLowerCase().trim();
    return name.includes("doapets") || name.includes("oscar3") || name.includes("ong3") || name.includes("0ng3") ||
           email.includes("doapets") || email.includes("oscar3") || email.includes("ong3") || email.includes("0ng3");
  }

  isGuest() {
    return this.state.currentUser && this.state.currentUser.isGuest === true;
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    if (newState.currentUser !== undefined) {
      if (newState.currentUser && !newState.currentUser.isGuest) {
        localStorage.setItem('doapets_user', JSON.stringify(newState.currentUser));
      } else if (!newState.currentUser) {
        localStorage.removeItem('doapets_user');
      }
    }
    if (newState.requests !== undefined) {
      localStorage.setItem('doapets_requests', JSON.stringify(newState.requests));
    }
    if (newState.animals !== undefined) {
      localStorage.setItem('doapets_animals', JSON.stringify(newState.animals));
    }
    if (newState.news !== undefined) {
      localStorage.setItem('doapets_news', JSON.stringify(newState.news));
    }
    this.listeners.forEach(fn => fn(this.state));
  }

  addAnimal(newAnimal) {
    this.setState({ animals: [newAnimal, ...this.state.animals] });
  }

  updateAnimalStatus(id, newStatus) {
    const updated = this.state.animals.map(pet => {
      if (pet.id === id) return { ...pet, status: newStatus };
      return pet;
    });
    this.setState({ animals: updated });
  }

  addNews(item) {
    this.setState({ news: [item, ...this.state.news] });
  }

  addRequest(newReq) {
    this.setState({ requests: [newReq, ...this.state.requests] });
  }

  updateRequestStatus(id, newStatus) {
    const updated = this.state.requests.map(req => {
      if (req.id === id) return { ...req, status: newStatus };
      return req;
    });
    this.setState({ requests: updated });
  }
}

export const store = new Store();
