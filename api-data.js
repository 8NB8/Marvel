async function searchMarvelCharacters(searchTerm) {
    const ts = '1700245634914';
    const publicKey = '2bbe8b485656ee207533843bf04985f4';
    const hashVal = '46586b7bcf76204976435733224d4d72';
    const apiUrl = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hashVal}&nameStartsWith=${searchTerm}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      if (data.code === 200) {
        return data.data.results;
      } else {
        console.error(`Marvel API error: ${data.code} - ${data.status}`);
        return [];
      }
    } catch (error) {
      console.error('Error fetching Marvel characters:', error);
      return [];
    }
  }
  