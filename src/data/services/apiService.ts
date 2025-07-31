const BASE_URL = "https://api.pixshare.live/PixApi/api";

export const apiService = {
  async getEvent(eventId: string = '614') {
    const res = await fetch(`${BASE_URL}/Event/getByEventId?eventId=${eventId}`);
    if (!res.ok) throw new Error("Failed fetching event data");
    return res.json();
  },

  async getEventImagesFullData(eventId: string = '614') {
    const queryParams = `?eventId=${eventId}&pageNumber=1&pageSize=100000`;
    const url = `${BASE_URL}/Event/AllImagesFullData${queryParams}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed fetching photos");
    return res.json();
  },
};
