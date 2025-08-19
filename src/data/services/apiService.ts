import { User } from "@/types/auth";

const BASE_URL = "https://api.pixshare.live/PixApi/api";
// const BASE_URL = "http://localhost:5050/api";

export const apiService = {
  async sendSMS(phoneNumber: string, message: string, otp: boolean = true) {
    try {
      const smsData = {
        phoneNumber,
        message,
        otp
      };
      
      const res = await fetch(`${BASE_URL}/Photographer/sendSMS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(smsData)
      });
      
      if (!res.ok) {
        throw new Error("Failed to send SMS");
      }
      
      // אם התגובה ריקה, נחזיר אובייקט פשוט
      const responseText = await res.text();
      return responseText ? JSON.parse(responseText) : { success: true };
    } catch (error) {
      console.error('SMS API Error:', error);
      throw error;
    }
  },

  async sendOTPEmail(email: string) {
    try {
      const res = await fetch(`${BASE_URL}/Photographer/SendEmailOtp?email=${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(email)
      });
      
      if (!res.ok) {
        throw new Error("Failed to send email OTP");
      }
      
      // אם התגובה ריקה, נחזיר אובייקט פשוט
      const responseText = await res.text();
      return responseText ? JSON.parse(responseText) : { success: true };
    } catch (error) {
      console.error('Email OTP API Error:', error);
      throw error;
    }
  },

  async verifyOTP(phoneNumberOrEmail: string, otp: string): Promise<boolean> {
    try {
      const request = {
        PhoneNumberOrEmail: phoneNumberOrEmail,
        otp: otp
      };
      
      const res = await fetch(`${BASE_URL}/Photographer/verifyOtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });
      
      if (!res.ok) {
        throw new Error("Failed to verify OTP");
      }
      
      const responseText = await res.text();
      const response = responseText ? JSON.parse(responseText) : null;
      return response?.verified || false;
    } catch (error) {
      console.error('OTP Verification API Error:', error);
      return false;
    }
  },

  async authenticateUser(userPhoneOrEmail: string, eventId: number, authenticateBy: "PhoneNumber" | "Email"): Promise<any> {
    try {
      const encodedUserPhoneOrEmail = encodeURIComponent(userPhoneOrEmail);
      const url = `${BASE_URL}/User/authenticateUser?userPhone=${encodedUserPhoneOrEmail}&&eventId=${eventId}&&authenticateBy=${authenticateBy}`;
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error("Failed to authenticate user");
      }
      
      const responseText = await res.text();
      return responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.error('User Authentication API Error:', error);
      return null;
    }
  },

  async registerUser(formData: FormData): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/User`, {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) {
        throw new Error("Failed to register user");
      }
      
      const responseText = await res.text();
      return responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.error('User Registration API Error:', error);
      throw error;
    }
  },

  async registerUserByPhoto(formData: FormData): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/User/registerByPhoto`, {
        method: 'POST', 
        body: formData
      });
      
      if (!res.ok) {
        throw new Error("Failed to register user by photo");
      }
      
      const responseText = await res.text();
      return responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.error('User Registration by Photo API Error:', error);
      throw error;
    }
  },

  async sendWelcomeSMS(phoneNumber: string, eventLink: string, userId: string): Promise<any> {
    try {
    const message = `היי, הגלריה האישית שלך כאן🎉
אם אין תמונות כרגע, תקבל/י התראה כשהן יעלו 🔔
לצפייה מהירה בגלריה 👇🏼
https://www.pixshare.live/gallery/${eventLink}?userid=${userId}
הגלריה זמינה כחודש.
בברכה, Pixshare AI`;      

      const smsData = {
        phoneNumber,
        message,
        otp: false
      };
      
      const res = await fetch(`${BASE_URL}/Photographer/sendSMS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(smsData)
      });
      
      if (!res.ok) {
        throw new Error("Failed to send welcome SMS");
      }
      
      const responseText = await res.text();
      return responseText ? JSON.parse(responseText) : { success: true };
    } catch (error) {
      console.error('Welcome SMS API Error:', error);
      throw error;
    }
  },

  async loginUser(userId: number): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/User?userId=${userId}`);
      
      if (!res.ok) {
        throw new Error("Failed to login user");
      }
      
      const responseText = await res.text();
      return responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.error('Login User API Error:', error);
      throw error;
    }
  },

  async getUserForUser(userId: number): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/User/getUsersForUser?userId=${userId}`);
      
      if (!res.ok) {
        throw new Error("Failed to get users for user");
      }
      
      const responseText = await res.text();
      return responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.error('Get Users For User API Error:', error);
      throw error;
    }
  },

  async getImages(userId: number, eventId: number): Promise<any> {
    try {
      const queryParams = `?userid=${userId}&eventid=${eventId}`;
      const url = `${BASE_URL}/User/getImages${queryParams}`;
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error("Failed to get user images");
      }
      
      const responseText = await res.text();
      return responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.error('Get Images API Error:', error);
      throw error;
    }
  },

  async downloadUserImg(downloadRequest: any): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/User/download-zip-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(downloadRequest)
      });
      
      if (!res.ok) {
        throw new Error("Failed to request download");
      }
      
      const responseText = await res.text();
      return responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.error('Download User Images API Error:', error);
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

  async updateUser(user: User) {
    const url = `${BASE_URL}/User/update-user`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!res.ok) {
      throw new Error('Failed updating user');
    }

    const data = await res.json();
    return data; 
  }

  
}

