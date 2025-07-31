const BASE_URL = "https://api.pixshare.live/PixApi/api";

export const apiService = {
  async getEvent(eventLink: string = '2d115c1c-guy-sigal') {
    const res = await fetch(`${BASE_URL}/Event/getByEventLink?eventLink=${eventLink}`);
    if (!res.ok) throw new Error("Failed fetching event data");
    const eventData = await res.json();
    return eventData;
  },

  async getEventImagesFullData(eventLink: string = '2d115c1c-guy-sigal') {
    // קודם נקבל את ה-event כדי לחלץ את ה-eventId
    const eventData = await this.getEvent(eventLink);
    const eventId = eventData.id;
    
    const queryParams = `?eventId=${eventId}&pageNumber=1&pageSize=100000`;
    const url = `${BASE_URL}/Event/AllImagesFullData${queryParams}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed fetching photos");
    return res.json();
  },
};
