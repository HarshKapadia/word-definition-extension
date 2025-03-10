document.addEventListener('mouseup', function(event) {
    // Get selected text
    const selectedText = window.getSelection().toString().trim();
    
    // If text is selected and it's a single word
    if (selectedText && /^[a-zA-Z]+$/.test(selectedText)) {
      // Remove existing popup if any
      const existingPopup = document.getElementById('definition-popup');
      if (existingPopup) {
        existingPopup.remove();
      }
      
      // Create popup element
      const popup = document.createElement('div');
      popup.id = 'definition-popup';
      
      // Position the popup near the selection
      const selectionRange = window.getSelection().getRangeAt(0);
      const rect = selectionRange.getBoundingClientRect();
      
      popup.style.top = `${window.scrollY + rect.bottom + 10}px`;
      popup.style.left = `${window.scrollX + rect.left}px`;
      
      // Set loading message
      popup.innerHTML = '<div class="popup-content"><p>Looking up definition...</p></div>';
      document.body.appendChild(popup);
      
      // Fetch definition from API
      fetchDefinition(selectedText, popup);
    }
  });
  
  function fetchDefinition(word, popup) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Word not found');
        }
        return response.json();
      })
      .then(data => {
        displayDefinition(data, popup);
      })
      .catch(error => {
        popup.innerHTML = `<div class="popup-content"><p>No definition found for "${word}"</p></div>`;
      });
  }
  
  function displayDefinition(data, popup) {
    // Extract the first definition
    const word = data[0].word;
    const phonetic = data[0].phonetic || '';
    
    let definitionsHTML = '';
    
    data[0].meanings.forEach(meaning => {
      const partOfSpeech = meaning.partOfSpeech;
      
      definitionsHTML += `<p class="part-of-speech">${partOfSpeech}</p><ul>`;
      
      // Get first 2 definitions max
      const definitions = meaning.definitions.slice(0, 2);
      definitions.forEach(def => {
        definitionsHTML += `<li>${def.definition}</li>`;
        if (def.example) {
          definitionsHTML += `<p class="example">Example: "${def.example}"</p>`;
        }
      });
      
      definitionsHTML += `</ul>`;
    });
    
    // Close button
    const closeButton = '<button class="close-btn">×</button>';
    
    // Update popup content
    popup.innerHTML = `
      <div class="popup-content">
        ${closeButton}
        <h3>${word} ${phonetic}</h3>
        ${definitionsHTML}
      </div>
    `;
    
    // Add event listener to close button
    const closeBtn = popup.querySelector('.close-btn');
    closeBtn.addEventListener('click', function() {
      popup.remove();
    });
    
    // Close when clicking outside the popup
    document.addEventListener('mousedown', function(event) {
      if (popup && !popup.contains(event.target)) {
        popup.remove();
      }
    });
  }
  