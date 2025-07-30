const BASE_URL = "https://api.pixshare.live/PixApi/api";

export const apiService = {
  async getEvent() {
    const res = await fetch(`${BASE_URL}/Event/getByEventLink?eventLink=`+'2d115c1c-guy-sigal');
    if (!res.ok) throw new Error("Failed fetching photos");
    return res.json();
  },


async getEventImagesFullData() {
    const queryParams = `?eventId=${614}&pageNumber=${1}&pageSize=${100000}`;
    const url = `${BASE_URL}/Event/AllImagesFullData${queryParams}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed fetching photos");
    return res.json();
},
};
