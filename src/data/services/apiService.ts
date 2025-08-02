const BASE_URL = "https://api.pixshare.live/PixApi/api";

export const apiService = {
  async sendSMS(phoneNumber: string, message: string, otp: boolean = true) {
    try {
      const smsData = {
        phoneNumber,
        message,
        otp
      };
      
      const res = await fetch(`${BASE_URL}/api/Photographer/sendSMS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(smsData)
      });
      
      if (!res.ok) {
        throw new Error("Failed to send SMS");
      }
      
      return await res.json();
    } catch (error) {
      console.error('SMS API Error:', error);
      throw error;
    }
  },

  async sendOTPEmail(email: string, message: string) {
    try {
      const emailData = {
        email,
        message,
        otp: true
      };
      
      const res = await fetch(`${BASE_URL}/api/Photographer/sendEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });
      
      if (!res.ok) {
        throw new Error("Failed to send email");
      }
      
      return await res.json();
    } catch (error) {
      console.error('Email API Error:', error);
      throw error;
    }
  },

  async getEvent(eventLink: string) {
    try {
      // דמה לאירוע נמחק - לבדיקה בלבד
      if (eventLink === 'deleted-event-test') {
        return {
          id: '123',
          name: 'אירוע נמחק',
          isDeleted: true,
          isActive: false
        };
      }

      const res = await fetch(`${BASE_URL}/Event/getByEventLink?eventLink=${eventLink}`);
      if (!res.ok) {
        if (res.status === 404) {
          return null; // אירוע לא נמצא
        }
        throw new Error("Failed fetching event data");
      }
      const eventData = await res.json();
      return eventData;
    } catch (error) {
      console.error('API Error:', error);
      return null; // אירוע לא נמצא
    }
  },

  async getEventImagesFullData(eventLink: string) {
    try {
      // קודם נקבל את ה-event כדי לחלץ את ה-eventId
      const eventData = await this.getEvent(eventLink);
      if (!eventData) {
        throw new Error("Event not found");
      }
      
      const eventId = eventData.id;
      const queryParams = `?eventId=${eventId}&pageNumber=1&pageSize=100000`;
      const url = `${BASE_URL}/Event/AllImagesFullData${queryParams}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed fetching photos");
      return res.json();
    } catch (error) {
      console.error('Error fetching images:', error);
      throw error;
    }
  },

  async getEventAlbums(eventId: string) {
    const url = `${BASE_URL}/EventAlbom/getForEvent?id=${eventId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed fetching albums");
    return res.json();
  },
};
