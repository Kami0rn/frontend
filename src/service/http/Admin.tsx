const serverAddress = 'https://0f06-49-48-93-75.ngrok-free.app';
// const serverAddress = 'http://127.0.0.1:5000';

export interface AdminToggle {
    action: string;
  }


export const AdminTog = async (action: AdminToggle) => {
  try {
    const response = await fetch(`${serverAddress}/chat_toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to create chat:', error);
    return null;
  }
};

export const FetchChatStatus = async () => {
  try {
      const response = await fetch(`${serverAddress}/status`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          return data;
      } else {
          throw new Error("Response was not JSON");
      }
  } catch (error) {
      console.error("Error fetching chat status:", error);
      return null;
  }
};
