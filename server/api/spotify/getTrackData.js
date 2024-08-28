export default defineEventHandler(async (event) => {
  const { trackID } = getQuery(event);
  
  const { access_token } = await $fetch('/api/spotify/auth');
  const response = await fetch(`https://api.spotify.com/v1/audio-features/${trackID}`, {
    method: "GET", 
    headers: { Authorization: `Bearer ${access_token}` }
  });
  
  return await response.json();
});